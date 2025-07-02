/**
 * Centralized exports of all MCP tool schemas for type-safe evaluation
 */

import { z } from 'zod';

// Import schemas directly to create types
import { ListDocumentsInputSchema } from './discovery/listDocuments.js';
import { ReadDocumentInfoInputSchema } from './discovery/readDocumentInfo.js';
import { ExtractTextInputSchema } from './extraction/extractText.js';
import { SearchInputSchema } from './extraction/search.js';
import { ExtractTablesInputSchema } from './extraction/extractTables.js';
import { ExtractFormDataSchema } from './forms/extractFormData.js';
import { FillFormFieldSchema } from './forms/fillFormFields.js';
import { AddAnnotationSchema } from './annotations/addAnnotation.js';
import { ReadAnnotationsSchema } from './annotations/readAnnotations.js';
import { DeleteAnnotationsSchema } from './annotations/deleteAnnotations.js';
import { CreateRedactionSchema } from './annotations/createRedaction.js';
import { ApplyRedactionsSchema } from './annotations/applyRedactions.js';
import { AddWatermarkSchema } from './document-editing/addWatermark.js';
import { SplitDocumentSchema } from './document-editing/splitDocument.js';
import { DuplicateDocumentSchema } from './document-editing/duplicateDocument.js';
import { AddNewPageSchema } from './document-editing/addNewPage.js';
import { RotatePagesSchema } from './document-editing/rotatePages.js';
import { MergeDocumentPagesSchema } from './document-editing/mergeDocumentPages.js';
import { ExtractKeyValuePairsSchema } from './extraction/extractKeyValuePairs.js';
import { HealthCheckSchema } from './healthCheck.js';
import { RenderDocumentPageSchema } from './extraction/renderDocumentPage.js';

// Create Zod input schemas for type inference
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const ExtractFormDataInputSchema = z.object(ExtractFormDataSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const FillFormFieldInputSchema = z.object(FillFormFieldSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const AddAnnotationInputSchema = z.object(AddAnnotationSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const ReadAnnotationsInputSchema = z.object(ReadAnnotationsSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const DeleteAnnotationsInputSchema = z.object(DeleteAnnotationsSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const CreateRedactionInputSchema = z.object(CreateRedactionSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const ApplyRedactionsInputSchema = z.object(ApplyRedactionsSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const AddWatermarkInputSchema = z.object(AddWatermarkSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const SplitDocumentInputSchema = z.object(SplitDocumentSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const DuplicateDocumentInputSchema = z.object(DuplicateDocumentSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const AddNewPageInputSchema = z.object(AddNewPageSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const RotatePagesInputSchema = z.object(RotatePagesSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const MergeDocumentPagesInputSchema = z.object(MergeDocumentPagesSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const ExtractKeyValuePairsInputSchema = z.object(ExtractKeyValuePairsSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const HealthCheckInputSchema = z.object(HealthCheckSchema);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Schema variables used only for type inference
const RenderDocumentPageInputSchema = z.object(RenderDocumentPageSchema);

/**
 * Infer input types from all tool schemas
 */
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;
export type ReadDocumentInfoInput = z.infer<typeof ReadDocumentInfoInputSchema>;
export type ExtractTextInput = z.infer<typeof ExtractTextInputSchema>;
export type SearchInput = z.infer<typeof SearchInputSchema>;
export type ExtractTablesInput = z.infer<typeof ExtractTablesInputSchema>;
export type ExtractFormDataInput = z.infer<typeof ExtractFormDataInputSchema>;
export type FillFormFieldInput = z.infer<typeof FillFormFieldInputSchema>;
export type AddAnnotationInput = z.infer<typeof AddAnnotationInputSchema>;
export type ReadAnnotationsInput = z.infer<typeof ReadAnnotationsInputSchema>;
export type DeleteAnnotationsInput = z.infer<typeof DeleteAnnotationsInputSchema>;
export type CreateRedactionInput = z.infer<typeof CreateRedactionInputSchema>;
export type ApplyRedactionsInput = z.infer<typeof ApplyRedactionsInputSchema>;
export type AddWatermarkInput = z.infer<typeof AddWatermarkInputSchema>;
export type SplitDocumentInput = z.infer<typeof SplitDocumentInputSchema>;
export type DuplicateDocumentInput = z.infer<typeof DuplicateDocumentInputSchema>;
export type AddNewPageInput = z.infer<typeof AddNewPageInputSchema>;
export type RotatePagesInput = z.infer<typeof RotatePagesInputSchema>;
export type MergeDocumentPagesInput = z.infer<typeof MergeDocumentPagesInputSchema>;
export type ExtractKeyValuePairsInput = z.infer<typeof ExtractKeyValuePairsInputSchema>;
export type HealthCheckInput = z.infer<typeof HealthCheckInputSchema>;
export type RenderDocumentPageInput = z.infer<typeof RenderDocumentPageInputSchema>;
