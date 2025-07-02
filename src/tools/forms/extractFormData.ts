import { DocumentEngineClient } from '../../api/Client.js';
import { FormFieldValue, FormFieldWithWidgets } from '../../api/DocumentEngineSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import {
  getDocumentFormFields,
  getDocumentFormFieldValues,
  getDocumentInfo,
} from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { formatBBox } from '../../utils/Common.js';

/**
 * Schema for extract_form_data tool
 */
export const ExtractFormDataSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  field_names: z
    .array(z.string())
    .optional()
    .describe('List of specific form field names to extract'),
  include_empty_fields: z
    .boolean()
    .default(true)
    .describe('Whether to include fields with empty values'),
};

const ExtractFormDataInputSchema = z.object(ExtractFormDataSchema);
type ExtractFormDataInput = z.infer<typeof ExtractFormDataInputSchema>;

/**
 * Extract structured data from form fields in a document
 */
export async function extractFormData(
  client: DocumentEngineClient,
  params: ExtractFormDataInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ExtractFormDataInputSchema.parse(params);
    const { document_fingerprint, field_names, include_empty_fields = true } = validatedParams;

    const docInfo = await getDocumentInfo(client, document_fingerprint);
    const title = docInfo.title || 'Untitled Document';

    const formFieldsResponse = await getDocumentFormFields(client, document_fingerprint);

    // Check if form fields data exists
    if (!formFieldsResponse.data.data) {
      throw new Error(
        `No form fields data returned for document ID: ${document_fingerprint.document_id}, Layer: ${document_fingerprint.layer}`
      );
    }

    let formFields = formFieldsResponse.data.data;

    // Filter form fields if field_names is provided
    if (field_names && field_names.length > 0) {
      formFields = formFields.filter(field => {
        // Check if field.content exists and has a name property
        return field.content && field.content.name && field_names.includes(field.content.name);
      });
    }

    // Get form field values (this is layer-aware)
    const formFieldValuesResponse = await getDocumentFormFieldValues(client, document_fingerprint);

    // Check if form field values data exists
    if (!formFieldValuesResponse.data.data) {
      throw new Error(
        `No form field values data returned for document ID: ${document_fingerprint.document_id}, Layer: ${document_fingerprint.layer}`
      );
    }

    const formFieldValues = formFieldValuesResponse.data.data.formFieldValues || [];

    // Create a map of field names to their values for easy lookup
    const fieldValueMap = new Map<string, FormFieldValue>();
    formFieldValues.forEach((fieldValue: FormFieldValue) => {
      if (fieldValue && fieldValue.name) {
        fieldValueMap.set(fieldValue.name, fieldValue);
      }
    });

    // Filter out empty fields if include_empty_fields is false
    if (!include_empty_fields) {
      formFields = formFields.filter(field => {
        // Check if field.content exists and has a name property
        if (!field.content || !field.content.name) return false;

        // Get the field value from the map
        const fieldValue = fieldValueMap.get(field.content.name);

        // Check if the field has a value that's not null, undefined, or empty string
        if (!fieldValue) return false;

        if (Array.isArray(fieldValue.value)) {
          return fieldValue.value.length > 0 && fieldValue.value.some(v => v !== null && v !== '');
        }

        return (
          fieldValue.value !== null && fieldValue.value !== undefined && fieldValue.value !== ''
        );
      });
    }

    // Group form fields by type
    const fieldsByType: Record<string, FormFieldWithWidgets[]> = {};
    formFields.forEach(field => {
      // Check if field.content exists and has a type property
      if (!field.content || !field.content.type) return;

      const fieldType = field.content.type;
      if (!fieldsByType[fieldType]) {
        fieldsByType[fieldType] = [];
      }
      fieldsByType[fieldType].push(field);
    });

    // Build the markdown content
    let markdown = `# Form Data Extraction\n\n`;
    markdown += `📄 **Document:** ${title}\n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔖 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `📝 **Total Form Fields:** ${formFields.length}  \n\n`;

    if (formFields.length === 0) {
      markdown += `No form fields found in this document${field_names ? ' matching the specified field names' : ''}.`;
      return { markdown };
    }

    markdown += `---\n\n`;

    // Add form fields by type
    for (const [type, fields] of Object.entries(fieldsByType)) {
      markdown += `## ${formatFieldType(type)} Fields (${fields.length})\n\n`;

      // Create a table for this field type
      markdown += `| Field Name | Value | Page | Required |\n`;
      markdown += `|------------|-------|------|----------|\n`;

      // Process fields in parallel to get page indices
      for (const field of fields) {
        // Check if field.content exists
        if (!field.content) continue;

        // Check if field.widgetAnnotations exists
        const widgetAnnotations = field.widgetAnnotations || [];
        let pageNumber = 'N/A';

        if (
          widgetAnnotations.length > 0 &&
          widgetAnnotations[0]?.content?.pageIndex !== undefined
        ) {
          pageNumber = `${widgetAnnotations[0].content.pageIndex + 1}`;
        }

        // Check if field is required
        const required =
          field.content.flags &&
          Array.isArray(field.content.flags) &&
          field.content.flags.includes('required')
            ? '✓'
            : '';

        // Get the field value from the map
        const fieldValue = field.content.name ? fieldValueMap.get(field.content.name) : undefined;
        const value =
          fieldValue && field.content.type ? formatFieldValue(fieldValue.value) : 'Empty';

        markdown += `| ${field.content.name || 'Unnamed Field'} | ${value} | ${pageNumber} | ${required} |\n`;
      }

      markdown += `\n`;
    }

    // Add detailed information section
    markdown += `## Detailed Information\n\n`;
    markdown += `For each form field, the following details are available:\n\n`;

    await Promise.all(
      formFields.map(async field => {
        // Check if field.content exists
        if (!field.content) {
          markdown += `### Unnamed Field\n\n`;
          markdown += `- **Type:** Unknown\n`;
          markdown += `- **Value:** Empty\n`;
          markdown += `- **Page:** N/A\n`;
          return;
        }

        // Get the field value from the map
        const fieldValue = field.content.name ? fieldValueMap.get(field.content.name) : undefined;

        markdown += `### ${field.content.name || 'Unnamed Field'}\n\n`;
        markdown += `- **Type:** ${field.content.type ? formatFieldType(field.content.type) : 'Unknown'}\n`;

        // Use the field value from the map if available
        const value =
          fieldValue && field.content.type ? formatFieldValue(fieldValue.value) : 'Empty';
        markdown += `- **Value:** ${value}\n`;

        // Check if field.widgetAnnotations exists
        const widgetAnnotations = field.widgetAnnotations || [];
        let pageIndex;

        if (
          widgetAnnotations.length > 0 &&
          widgetAnnotations[0]?.content?.pageIndex !== undefined
        ) {
          pageIndex = widgetAnnotations[0].content.pageIndex;
        }

        markdown += `- **Page:** ${pageIndex !== undefined ? pageIndex + 1 : 'N/A'}\n`;

        // Check if field is required
        if (
          field.content.flags &&
          Array.isArray(field.content.flags) &&
          field.content.flags.includes('required')
        ) {
          markdown += `- **Required:** Yes\n`;
        }

        if (widgetAnnotations.length > 0 && widgetAnnotations[0]?.content) {
          const widget = widgetAnnotations[0].content;
          if (widget.bbox && widget.bbox.length === 4 && widget.pageIndex !== undefined) {
            markdown += `- **Location:** Page ${widget.pageIndex + 1}, coordinates ${formatBBox(widget.bbox)}\n`;
          }
        }

        // Add options if available for choice fields
        if ('options' in field && field.options) {
          const options = field.options as string[] | unknown;
          markdown += `- **Options:** ${Array.isArray(options) ? options.join(', ') : JSON.stringify(options)}\n`;
        }

        markdown += `\n`;
      })
    );

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Extracting Form Data\n\nAn error occurred while trying to extract form data: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}

/**
 * Format field type for display
 */
function formatFieldType(type: string): string {
  // Remove prefix if present and capitalize
  const cleanType = type.replace(/^pspdfkit\//, '');
  return cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
}

/**
 * Format field value for display
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Form field values can be any type
function formatFieldValue(value: any): string {
  if (value === null || value === undefined || value === '') {
    return 'Empty';
  }

  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  // For text values, truncate if too long
  if (typeof value === 'string' && value.length > 50) {
    return `${value.substring(0, 47)}...`;
  }

  return String(value);
}
