import { WorkflowStateAnnotation } from '../State';
import { uploadDocuments } from '../utils/FileHandlers';

/**
 * Upload Node: Upload documents to Document Engine
 */
export async function uploadNode(
  state: typeof WorkflowStateAnnotation.State
): Promise<typeof WorkflowStateAnnotation.Update> {
  console.log('📤 Uploading documents...');

  try {
    const filePaths = state.documents.map(doc => doc.path);
    const documentIds = await uploadDocuments(filePaths);

    const updatedDocuments = state.documents.map((doc, index) => ({
      ...doc,
      documentId: documentIds[index],
    }));

    console.log(`✅ Uploaded ${documentIds.length} documents`);

    return {
      documents: updatedDocuments,
    };
  } catch (error) {
    console.error('❌ Upload failed:', (error as Error).message);
    throw error;
  }
}
