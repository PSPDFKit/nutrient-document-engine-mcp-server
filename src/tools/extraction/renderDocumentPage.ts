import { DocumentEngineClient } from '../../api/Client.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import {
  getDocumentInfo,
  renderDocumentPage as renderDocumentPageWithLayer,
} from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for render_document_page tool
 */
export const RenderDocumentPageSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  pages: z.array(z.number()).describe('Array of page indices to render (0-based)'),
  width: z
    .number()
    .optional()
    .describe(
      'The width of the rendered image in pixels. If width nor height is given, the render size defaults to the page size.'
    ),
  height: z
    .number()
    .optional()
    .describe(
      'The height of the rendered image in pixels. If width nor height is given, the render size defaults to the page size.'
    ),
};

export const RenderDocumentPageInputSchema = z.object(RenderDocumentPageSchema);
export type RenderDocumentPageInput = z.infer<typeof RenderDocumentPageInputSchema>;

/**
 * Render one or more pages of a document as images
 */
export async function renderDocumentPage(
  client: DocumentEngineClient,
  params: RenderDocumentPageInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = RenderDocumentPageInputSchema.parse(params);
    const { document_fingerprint, pages, width, height } = validatedParams;

    // Get document info to validate page indices
    const docInfo = await getDocumentInfo(client, document_fingerprint);
    const pageCount = docInfo.pageCount || 0;

    // Use the pages array directly
    const pagesToRender: number[] = [...pages];

    // Validate all page indices
    for (const idx of pagesToRender) {
      if (idx < 0 || idx >= pageCount) {
        throw new Error(
          `Page index ${idx} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
        );
      }
    }

    // Prepare query parameters
    const queryParams: Record<string, string> = {};

    // Handle different cases for width and height
    if (width !== undefined && height !== undefined) {
      // If both are provided, use width (prioritize width over height)
      queryParams.width = width.toString();
    } else if (width !== undefined) {
      // If only width is provided, use it
      queryParams.width = width.toString();
    } else if (height !== undefined) {
      // If only height is provided, use it
      queryParams.height = height.toString();
    } else {
      // If no dimensions are available, use a reasonable default
      queryParams.width = '800';
    }

    // Create dimension text for markdown
    let dimensionsText = '';
    if (width !== undefined) {
      dimensionsText = `Width: ${width}px`;
    } else if (height !== undefined) {
      dimensionsText = `Height: ${height}px`;
    } else {
      dimensionsText = `Width: 800px (default)`;
    }

    // Render each page
    const renderedPages = await Promise.all(
      pagesToRender.map(async pageIdx => {
        // Get page dimensions from document info
        const pageInfo = docInfo.pages?.[pageIdx];
        const pageWidth = pageInfo?.width;
        const pageHeight = pageInfo?.height;

        // Get the rendered page image
        const response = await renderDocumentPageWithLayer(
          client,
          document_fingerprint,
          pageIdx,
          queryParams,
          {
            responseType: 'arraybuffer',
            headers: {
              Accept: 'image/png',
            },
          }
        );

        // Get the content type from the response
        const contentType = response.headers['content-type'] || 'image/png';

        // Convert the binary data to base64
        const buffer = response.data;
        const base64 = Buffer.from(buffer).toString('base64');

        return {
          pageIndex: pageIdx,
          pageNumber: pageIdx + 1,
          contentType,
          base64,
          pageWidth,
          pageHeight,
        };
      })
    );

    // Create markdown description
    let markdown =
      `# Document Page Render\n\n` +
      `📄 **Document ID:** ${document_fingerprint.document_id}\n` +
      (document_fingerprint.layer ? `🔀 **Layer:** ${document_fingerprint.layer}\n` : '') +
      `📄 **Total Pages Rendered:** ${renderedPages.length} of ${pageCount} total pages\n` +
      `🖼️ **Image Format:** ${renderedPages[0]?.contentType || 'image/png'}\n` +
      `📏 **Dimensions:** ${dimensionsText}\n\n`;

    // Add details for each rendered page
    markdown += `## Page Details\n\n`;
    renderedPages.forEach((page, index) => {
      markdown +=
        `### Page ${page.pageNumber} of ${pageCount}\n` +
        `📐 **Original Page Size:** ${page.pageWidth && page.pageHeight ? `${page.pageWidth} × ${page.pageHeight} points` : 'Unknown'}\n\n`;

      if (index < renderedPages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    return {
      markdown,
      images: renderedPages.map(page => ({
        mimeType: page.contentType,
        base64: page.base64,
        pageIndex: page.pageIndex,
      })),
    };
  } catch (error) {
    // Provide a user-friendly error message
    return {
      markdown: `# Error Rendering Pages\n\nAn error occurred while trying to render the pages: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your parameters and try again.`,
    };
  }
}
