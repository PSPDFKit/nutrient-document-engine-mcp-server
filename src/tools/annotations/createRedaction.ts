import { z } from 'zod';

import { DocumentEngineClient } from '../../api/Client.js';
import { createDocumentRedactions } from '../../api/DocumentLayerAbstraction.js';
import { CreateRedactions } from '../../api/DocumentEngineSchema.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Create Redaction Tool
 *
 * Marks sensitive content for removal using regex patterns, presets, or text matching.
 * This tool creates a redaction preview without permanently removing content.
 */

export const CreateRedactionSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  redaction_type: z.enum(['regex', 'preset', 'text']),
  text: z
    .string()
    .optional()
    .describe(
      'Use this field to specify text to redact. This field is required for redaction type "text".'
    ),
  pattern: z
    .string()
    .optional()
    .describe(
      'Use this field to specify a regex pattern to redact. This field is required for redaction type "regex".'
    ),
  preset: z
    .enum([
      'social-security-number',
      'credit-card-number',
      'email-address',
      'international-phone-number',
      'north-american-phone-number',
      'date',
      'time',
      'url',
      'us-zip-code',
      'ipv4',
      'ipv6',
      'mac-address',
      'vin',
    ])
    .optional()
    .describe(
      'Use this field to specify a preset pattern to redact. This field is required for redaction type "preset".'
    ),
};

export const CreateRedactionInputSchema = z.object(CreateRedactionSchema).refine(
  data => {
    // Validate that required fields are present for each redaction type
    if (data.redaction_type === 'regex' && !data.pattern) {
      return false;
    }
    if (data.redaction_type === 'preset' && !data.preset) {
      return false;
    }
    if (data.redaction_type === 'text' && !data.text) {
      return false;
    }
    return true;
  },
  {
    message: 'Invalid redaction configuration: missing required fields for redaction type',
  }
);

export type CreateRedactionInput = z.infer<typeof CreateRedactionInputSchema>;

/**
 * Get human-readable description for preset type
 */
function getPresetDescription(presetType: string): string {
  switch (presetType) {
    case 'social-security-number':
      return 'Social Security Number';
    case 'credit-card-number':
      return 'Credit Card Number';
    case 'email-address':
      return 'Email Address';
    case 'international-phone-number':
      return 'International Phone Number';
    case 'north-american-phone-number':
      return 'North American Phone Number';
    case 'date':
      return 'Date';
    case 'time':
      return 'Time';
    case 'url':
      return 'URL';
    case 'us-zip-code':
      return 'US ZIP Code';
    case 'ipv4':
      return 'IPv4 Address';
    case 'ipv6':
      return 'IPv6 Address';
    case 'mac-address':
      return 'MAC Address';
    case 'vin':
      return 'Vehicle Identification Number';
    default:
      return presetType;
  }
}

/**
 * Format redaction type for display
 */
function formatRedactionType(
  redactionType: string,
  pattern?: string,
  presetType?: string,
  text?: string
): string {
  switch (redactionType) {
    case 'regex':
      return `Custom Pattern: ${pattern}`;
    case 'preset':
      return `Preset: ${getPresetDescription(presetType || '')}`;
    case 'text':
      return `Text: ${text || pattern}`;
    default:
      return redactionType;
  }
}

export async function createRedaction(
  client: DocumentEngineClient,
  params: CreateRedactionInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = CreateRedactionInputSchema.parse(params);
    const { document_fingerprint, redaction_type, pattern, preset, text } = validatedParams;

    let payload: CreateRedactions;

    if (redaction_type === 'regex' && pattern) {
      payload = {
        strategy: 'regex',
        strategyOptions: { regex: pattern },
      };
    } else if (redaction_type === 'preset' && preset) {
      payload = {
        strategy: 'preset',
        strategyOptions: { preset: preset },
      };
    } else if (redaction_type === 'text' && text) {
      payload = {
        strategy: 'text',
        strategyOptions: { text },
      };
    } else {
      throw new Error('Invalid redaction configuration');
    }

    const response = await createDocumentRedactions(client, document_fingerprint, payload);

    const responseData = response.data?.data;
    if (!responseData) {
      throw new Error('Invalid response from Document Engine API');
    }
    const redactionAnnotations = responseData.annotations || [];

    // Generate redaction ID
    const redactionIds = redactionAnnotations.map(annotation => annotation.id).join(', ');

    // Extract information from response
    const matchCount = redactionAnnotations.length || 0;

    // Get affected pages from annotations
    const pagesAffected =
      matchCount > 0
        ? [
            ...new Set(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Annotation object structure varies by type
              redactionAnnotations.map((annotation: any) => annotation.pageIndex as number)
            ),
          ].sort((a: number, b: number) => a - b)
        : [];

    // Build the markdown response
    let markdown = `# Redaction Creation Complete\n\n`;
    markdown += `🔍 **Redaction IDs:** [${redactionIds}]  \n`;
    markdown += `📊 **Matches Found:** ${matchCount} instances  \n`;

    if (pagesAffected.length > 0) {
      markdown += `📄 **Pages Affected:** ${pagesAffected.map((p: number) => p + 1).join(', ')}  \n`;
    } else {
      markdown += `📄 **Pages Affected:** None  \n`;
    }

    markdown += `👀 **Preview Available:** Yes  \n\n`;
    markdown += `---\n\n`;

    if (matchCount > 0) {
      // Redaction summary section
      markdown += `## Redaction Summary\n\n`;
      markdown += `### 📋 Pattern: ${formatRedactionType(redaction_type, pattern, preset, text)}\n`;
      markdown += `- **Type:** ${redaction_type === 'preset' ? 'Preset' : redaction_type === 'regex' ? 'Custom Regex' : 'Text Match'}\n`;
      markdown += `- **Pattern:** ${redaction_type === 'regex' ? pattern : redaction_type === 'preset' ? preset : text}\n`;
      markdown += `- **Matches:** ${matchCount} instances\n\n`;

      // Locations found section
      if (pagesAffected.length > 0) {
        markdown += `### 📍 Locations Found\n`;

        // Group annotations by page
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Annotation objects have varying structures
        const pageGroups: Record<number, any[]> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Annotation object structure varies by type
        redactionAnnotations.forEach((annotation: any) => {
          const page = annotation.pageIndex as number;
          if (!pageGroups[page]) {
            pageGroups[page] = [];
          }
          pageGroups[page].push(annotation);
        });

        for (const page of pagesAffected) {
          const pageAnnotations = pageGroups[page] || [];
          markdown += `- **Page ${page + 1}:** ${pageAnnotations.length} ${pageAnnotations.length === 1 ? 'match' : 'matches'} detected\n`;
        }
        markdown += `\n`;
      }
    } else {
      // No matches found
      markdown += `## No Matches Found\n\n`;
      markdown += `🔍 **Pattern:** ${formatRedactionType(redaction_type, pattern, preset, text)}\n`;
      markdown += `📄 **Text Analyzed:** Document content scanned\n`;
      markdown += `💡 **Suggestion:** Try adjusting your pattern or using a different redaction type\n\n`;
    }

    markdown += `---\n\n`;

    // Important notes section
    markdown += `## ⚠️ Important Notes\n`;
    markdown += `- **Preview mode:** No content has been permanently redacted yet\n`;

    if (matchCount > 0) {
      markdown += `- **Backup recommended:** Create document backup before applying redactions with \`duplicate_document\`\n`;
    } else {
      markdown += `- **No action needed:** No sensitive content found with current pattern\n`;
      markdown += `- **Try different patterns:** Consider adjusting search criteria\n`;
    }

    markdown += `\n---\n\n`;

    // Processing summary
    markdown += `\n---\n\n`;
    markdown += `## Processing Summary\n`;
    markdown += `- **Status:** Creation complete\n`;
    markdown += `- **Document ID:** ${document_fingerprint.document_id}\n`;
    if (document_fingerprint.layer) {
      markdown += `- **Layer:** ${document_fingerprint.layer}\n`;
    }
    markdown += `- **Redaction IDs:** [${redactionIds}]\n`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Creating Redaction\n\n`;
    errorMarkdown += `An error occurred while trying to create redaction analysis: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Redaction Type:** ${params.redaction_type}  \n`;

    if (params.pattern) {
      errorMarkdown += `**Pattern:** ${params.pattern}  \n`;
    }
    if (params.preset) {
      errorMarkdown += `**Preset Type:** ${params.preset}  \n`;
    }
    if (params.text) {
      errorMarkdown += `**Text:** ${params.text}  \n`;
    }

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct\n`;
    errorMarkdown += `2. For regex patterns, ensure the pattern syntax is valid\n`;
    errorMarkdown += `3. Check that the document contains extractable text\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
