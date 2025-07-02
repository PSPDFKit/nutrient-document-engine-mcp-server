import { DocumentEngineClient } from './Client.js';
import {
  AnnotationCreateSingle,
  BuildInstructions,
  CreateRedactions,
  DocumentInfo,
  FormFieldValuesRecords,
} from './DocumentEngineSchema.js';
import type { AxiosRequestConfig } from 'openapi-client-axios';
import { DocumentFingerprint } from '../tools/schemas/DocumentFingerprintSchema.js';

/**
 * Provides layer-aware wrappers for Document Engine API calls.
 * When a layer is specified in the DocumentFingerprint, it uses layer-specific endpoints.
 * Otherwise, it uses the default endpoints.
 */

/**
 * Get text from a document page with layer support
 */
export async function getDocumentPageText(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  pageIndex: number,
  ocr?: boolean
) {
  const params = {
    documentId: fingerprint.document_id,
    pageIndex,
    ...(ocr ? { ocr: 'true' } : {}),
  };

  if (fingerprint.layer) {
    return client['get-document-layer-page-text']({
      ...params,
      layerName: fingerprint.layer,
    });
  }

  // Use default endpoint
  return client['get-document-page-text'](params);
}

/**
 * Get annotations with layer support
 */
export async function getDocumentAnnotations(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  pageIndex?: number
) {
  const params = {
    documentId: fingerprint.document_id,
    ...(pageIndex !== undefined ? { pageIndex } : {}),
  };

  const headers = { headers: { Accept: 'application/json' } };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['get-document-layer-annotations'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      null,
      headers
    );
  }

  // Use default endpoint
  return client['get-document-annotations'](params, null, headers);
}

/**
 * Create annotation with layer support
 */
export async function createDocumentAnnotation(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  annotation: AnnotationCreateSingle
) {
  const params = {
    documentId: fingerprint.document_id,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['create-document-layer-annotation'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      annotation
    );
  }

  // Use default endpoint
  return client['create-document-annotation'](params, annotation);
}

export async function getDocumentAnnotation(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  annotationId: string
) {
  const params = {
    documentId: fingerprint.document_id,
    annotationId,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['get-document-layer-annotation']({
      ...params,
      layerName: fingerprint.layer,
    });
  }

  // Use default endpoint
  return client['get-document-annotation'](params);
}

/**
 * Delete annotation with layer support
 */
export async function deleteDocumentAnnotation(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  annotationId: string
) {
  const params = {
    documentId: fingerprint.document_id,
    annotationId,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['delete-document-layer-annotation']({
      ...params,
      layerName: fingerprint.layer,
    });
  }

  // Use default endpoint
  return client['delete-document-annotation'](params);
}

/**
 * Get form field values with layer support
 */
export async function getDocumentFormFieldValues(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint
) {
  const params = {
    documentId: fingerprint.document_id,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['get-document-layer-form-field-values'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      null,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
  }

  // Use default endpoint
  return client['get-document-form-field-values'](params, null, {
    headers: {
      Accept: 'application/json',
    },
  });
}

/**
 * Update form field values with layer support
 */
export async function updateDocumentFormFieldValues(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  formFieldValues: FormFieldValuesRecords
) {
  const params = {
    documentId: fingerprint.document_id,
    formFieldValues,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['update-document-layer-form-field-values']({
      ...params,
      layerName: fingerprint.layer,
    });
  }

  // Use default endpoint
  return client['update-document-form-field-values'](params);
}

/**
 * Apply redactions with layer support
 */
export async function applyDocumentRedactions(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  options?: Record<string, unknown>
) {
  const params = {
    documentId: fingerprint.document_id,
    ...options,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['apply-document-layer-redactions'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Use default endpoint
  return client['apply-document-redactions'](params, null, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create redactions with layer support
 */
export async function createDocumentRedactions(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  redactionPayload: CreateRedactions
) {
  const params = {
    documentId: fingerprint.document_id,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['create-document-layer-redactions'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      redactionPayload
    );
  }

  // Use default endpoint
  return client['create-document-redactions'](params, redactionPayload);
}

/**
 * List all layers for a document
 */
export async function listDocumentLayers(client: DocumentEngineClient, documentId: string) {
  return client['list-layers']({
    documentId,
  });
}

/**
 * Create a new layer
 */
export async function createDocumentLayer(
  client: DocumentEngineClient,
  documentId: string,
  layerName: string,
  sourceLayer?: string
) {
  return client['create-new-layer'](
    { documentId },
    { name: layerName, source_layer_name: sourceLayer }
  );
}

/**
 * Apply build instructions to a document with layer support
 */
export async function applyDocumentInstructions(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  buildInstructions: BuildInstructions
) {
  const params = {
    documentId: fingerprint.document_id,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['document-layer-apply-instructions'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      buildInstructions
    );
  }

  // Use default endpoint
  return client['document-apply-instructions'](params, buildInstructions);
}

/**
 * Copy a document using the Document Engine API
 */
export async function copyDocument(client: DocumentEngineClient, fingerprint: DocumentFingerprint) {
  if (fingerprint.layer) {
    // Use layer-specific endpoint
    const response = await client['copy-document-layer-with-instant-json']({
      documentId: fingerprint.document_id,
      layerName: fingerprint.layer,
    });
    return response.data.documentId;
  }

  // Use default endpoint
  const response = await client['copy-document']({}, { document_id: fingerprint.document_id });
  return response.data.data.document_id;
}

export async function renderDocumentPage(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  pageIndex: number,
  queryParams: {
    width?: number;
    height?: number;
  },
  config?: AxiosRequestConfig
) {
  const params = {
    documentId: fingerprint.document_id,
    pageIndex,
    ...queryParams,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['render-document-layer-page'](
      {
        ...params,
        layerName: fingerprint.layer,
      },
      null,
      config
    );
  }

  // Use default endpoint
  return client['render-document-page'](params, null, config);
}

export async function getDocumentFormFields(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint
) {
  const params = {
    documentId: fingerprint.document_id,
  };

  if (fingerprint.layer) {
    // Use layer-specific endpoint
    return client['get-document-layer-form-fields']({
      ...params,
      layerName: fingerprint.layer,
    });
  }

  // Use default endpoint
  return client['get-document-form-fields'](params);
}

/**
 * Get document information using DocumentFingerprint
 * Note: Document info is always fetched from the base document, not from layers
 */
export async function getDocumentInfo(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint
): Promise<DocumentInfo> {
  const params = {
    documentId: fingerprint.document_id,
  };

  let documentInfoResponse;
  if (fingerprint.layer) {
    // Use layer-specific endpoint
    documentInfoResponse = await client['fetch-document-layer-info']({
      ...params,
      layerName: fingerprint.layer,
    });
  } else {
    documentInfoResponse = await client['fetch-document-info'](params);
  }

  if (!documentInfoResponse?.data?.data) {
    throw new Error(
      `No document info returned for document ID: ${fingerprint.document_id}${fingerprint.layer ? `, layer name: ${fingerprint.layer}` : ''}`
    );
  }

  return documentInfoResponse.data.data;
}
