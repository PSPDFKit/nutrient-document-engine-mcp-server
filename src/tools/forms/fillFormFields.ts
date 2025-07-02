import { DocumentEngineClient } from '../../api/Client.js';
import {
  getDocumentFormFields,
  getDocumentInfo,
  updateDocumentFormFieldValues,
} from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';

export const FillFormFieldSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  field_values: z
    .array(
      z.object({
        fieldName: z.string(),
        value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
      })
    )
    .describe('Object containing field names as keys and their values'),
  validate_required: z
    .boolean()
    .optional()
    .default(true)
    .describe('Whether to validate that form fields exist before updating'),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FillFormFieldInputSchema = z.object(FillFormFieldSchema);
type FillFormFieldInput = z.infer<typeof FillFormFieldInputSchema>;

/**
 * Populate form fields with validated data
 */
export async function fillFormFields(
  client: DocumentEngineClient,
  { document_fingerprint, field_values, validate_required = true }: FillFormFieldInput
): Promise<MCPToolOutput> {
  try {
    // Get document info for context
    const { title = 'Untitled Document' } = await getDocumentInfo(client, document_fingerprint);

    const formFieldValuesRecords = field_values.map(({ fieldName, value }) => ({
      name: fieldName,
      value: String(value),
      type: 'pspdfkit/form-field-value' as const,
      v: 1 as const,
      createdBy: null,
      updatedBy: null,
    }));

    // Get current form fields to validate against (if validation is enabled)
    let existingFields: string[] = [];
    const validationErrors: string[] = [];

    if (validate_required) {
      try {
        const formFieldsResponse = await getDocumentFormFields(client, document_fingerprint);
        existingFields =
          formFieldsResponse.data?.data
            ?.map(field => field.content?.name)
            .filter((name): name is string => typeof name === 'string') || [];

        // Check for fields that don't exist
        const nonExistentFields = formFieldValuesRecords
          .map(fv => fv.name)
          .filter(name => !existingFields.includes(name));

        if (nonExistentFields.length > 0) {
          validationErrors.push(
            ...nonExistentFields.map(name => `Field "${name}" does not exist in the document`)
          );
        }
      } catch {
        // Ignore validation errors - continue to actual execution
      }
    }

    // Update form field values
    let updateSuccessful = false;
    let apiError: string | null = null;

    if (validationErrors.length === 0) {
      try {
        await updateDocumentFormFieldValues(client, document_fingerprint, formFieldValuesRecords);
        updateSuccessful = true;
      } catch (error: unknown) {
        const errorWithResponse = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        apiError =
          errorWithResponse.response?.data?.message ||
          errorWithResponse.message ||
          'Unknown error occurred';
      }
    }

    // Build the markdown response
    let markdown = `# Form Filling Complete\n\n`;
    markdown += `📄 **Document:** ${title}  \n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }

    if (updateSuccessful) {
      markdown += `✅ **Status:** Successfully updated  \n`;
      markdown += `📋 **Fields Updated:** ${formFieldValuesRecords.length}  \n`;

      if (validationErrors.length > 0) {
        markdown += `⚠️ **Validation Warnings:** ${validationErrors.length}  \n`;
      }
    } else {
      markdown += `❌ **Status:** Update failed  \n`;
      markdown += `📋 **Fields Attempted:** ${formFieldValuesRecords.length}  \n`;

      if (validationErrors.length > 0) {
        markdown += `⚠️ **Validation Errors:** ${validationErrors.length}  \n`;
      }
    }

    markdown += `\n---\n\n`;

    if (updateSuccessful) {
      // Show successfully updated fields
      markdown += `## Successfully Updated Fields\n\n`;

      formFieldValuesRecords.forEach(field => {
        const displayValue =
          field.value.length > 50 ? `${field.value.substring(0, 47)}...` : field.value;
        markdown += `- ✅ **${field.name}:** Updated to "${displayValue}"\n`;
      });

      markdown += `\n`;
    }

    // Show validation errors or API errors
    if (validationErrors.length > 0 || apiError) {
      markdown += `## Errors (❌ Need Attention)\n\n`;

      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          markdown += `- ❌ **Validation:** ${error}\n`;
        });
      }

      if (apiError) {
        markdown += `- ❌ **API Error:** ${apiError}\n`;
      }

      markdown += `\n`;
    }

    markdown += `---\n\n`;

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Filling Form Fields\n\nAn error occurred while trying to fill form fields: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again. Use \`extract_form_data\` to see available form fields.`,
    };
  }
}
