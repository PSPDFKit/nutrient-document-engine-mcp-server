# Features Reference

This document describes the document processing tools available through the Nutrient Document Engine MCP Server.

## Document Discovery Operations

### read_document_info
Retrieve document metadata and basic information including title, page count, creation date, and file size.

Returns document title, page count, creation date, and file size for overview and validation purposes.

### list_documents
List and browse documents with filtering, pagination, and sorting.

Supports filtering by title or date, sorting by various fields, and pagination for large document libraries.

## Content Extraction


### extract_text
Extract text from documents with OCR support, coordinate positioning, and page range selection.

Returns text with coordinate positioning data. Supports page range selection and combines OCR with native PDF text extraction.

### search
Search documents using text queries, regex patterns, or preset search templates.

Finds text across document content, annotations, and comments. Supports pattern matching for emails, phone numbers, and other data types.

### extract_tables
Extract table data from documents with automatic detection and formatting.

Converts PDF tables to structured data formats. Useful for financial reports, invoices, and data analysis workflows.

### render_document_page
Render document pages as high-quality images with customizable dimensions.

Generates document page images with customizable dimensions for thumbnails, previews, and document viewers.


## Document Annotations

### add_annotation
Add various types of annotations including notes, highlights, stamps, and links with precise positioning.

Supports highlights, notes, stamps, and links with precise positioning and author tracking for document review and collaboration.

### read_annotations
Read and filter annotations by type, author, or page location.

Retrieves annotations with filtering by type, author, or page location for review and change tracking.

### delete_annotations
Remove specific annotations with confirmation controls.

Removes specific annotations with confirmation controls for document cleanup and finalization.

## Document Forms

### extract_form_data
Extract form field values from interactive PDF forms with field validation.

Extracts values from PDF form fields with validation for processing applications, surveys, and automated workflows.

### fill_form_fields
Programmatically fill PDF form fields with data validation and required field checking.

Fills PDF form fields programmatically with data validation and required field checking for automation and personalization.

## Document Editing

### duplicate_document
Create exact copies of documents for versioning and workflow management.

Creates exact document copies for versioning, backup, and distribution.

### add_watermark
Add text or image watermarks with precise positioning, opacity, and rotation controls.

Adds text or image watermarks with positioning, opacity, and rotation controls for branding and security.

### split_document
Split large documents into smaller files at specified page boundaries with custom naming.

Splits documents at specified page boundaries with custom naming for section separation and focused document sets.


## Security and Redaction

### create_redaction
Create redaction annotations for sensitive content using text matching, regex patterns, or preset templates.

**Preset patterns include:**
- Social Security Numbers
- Credit Card Numbers
- Email Addresses
- International Phone Numbers
- North American Phone Numbers
- Dates
- Times
- URLs
- IPv4 Addresses
- IPv6 Addresses
- US ZIP Codes
- MAC Addresses
- Vehicle Identification Numbers (VINs)

Creates redaction annotations for sensitive content to comply with privacy regulations and prepare documents for public release.

### apply_redactions
Permanently apply redaction annotations to remove sensitive content from documents.

Permanently applies redaction annotations to remove sensitive content and create safe versions for sharing.

## System Operations

### health_check
Monitor system connectivity and Document Engine status with detailed diagnostic information.

Monitors system connectivity and Document Engine status with detailed diagnostic information for troubleshooting and monitoring.

## Advanced Capabilities

All 17 available tools support:
- **Page Range Selection**: Process specific page ranges for efficiency.
- **Error Handling**: Comprehensive error reporting and recovery.
- **Batch Operations**: Process multiple items in single requests.
- **Metadata Preservation**: Maintain document properties and structure.
- **Format Support**: Handle various PDF types and versions.
- **Performance Optimization**: Efficient processing for large documents.
