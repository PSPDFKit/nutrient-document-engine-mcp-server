import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  export interface HeaderParameters {
    Password?: Parameters.Password;
  }
  namespace Parameters {
    export type AnnotationIdPathParam = string;
    export type Annotations = boolean;
    export type AttachmentId = string;
    export type BookmarkId = string;
    export type CaseSensitive = boolean;
    export type Comments = boolean;
    export type Conformance =
      | 'pdfa-1a'
      | 'pdfa-1b'
      | 'pdfa-2a'
      | 'pdfa-2u'
      | 'pdfa-2b'
      | 'pdfa-3a'
      | 'pdfa-3u';
    export type CountRemainingDocuments = boolean;
    export type Cursor = string;
    export type DocumentId = string;
    export type DocumentIdQuery = string;
    export type DocumentType = 'pdf' | 'pdfa';
    export type EndDate = string; // date-time
    export type Flatten = boolean;
    export type FormFieldIdPathParam = string;
    export type FormFieldWidgetIdPathParam = string;
    export type IncludeAnnotations = boolean;
    export type JobId = string;
    export type KeepSignatures = boolean;
    export type LayerName = string;
    export type Limit = number;
    export interface Optimize {
      grayscaleText?: boolean;
      grayscaleGraphics?: boolean;
      grayscaleImages?: boolean;
      grayscaleFormFields?: boolean;
      grayscaleAnnotations?: boolean;
      disableImages?: boolean;
      mrcCompression?: boolean;
      imageOptimizationQuality?: number;
      /**
       * If set to `true`, the resulting PDF file will be linearized.
       * This means that the document will be optimized in a special way that allows it to be loaded faster over the network.
       * You need the `Linearization` feature to be enabled in your Nutrient Document Engine license in order to use this option.
       */
      linearize?: boolean;
    }
    export type OrderBy = 'title' | 'created_at';
    export type OrderDirection = 'asc' | 'desc';
    export type PageIndex = number;
    export type PageSize = number;
    export type Password = string;
    export type Q =
      | string
      | string /**
       * - `credit-card-number` — matches a number with 13 to 19 digits that begins with 1—6.
       * Spaces and `-` are allowed anywhere in the number.
       * - `date` — matches date formats such as `mm/dd/yyyy`, `mm/dd/yy`, `dd/mm/yyyy`, and `dd/mm/yy`.
       * It rejects any days greater than 31 or months greater than 12 and accepts a leading 0 in front of a single-digit day or month.
       * The delimiter can be `-`, `.`, or `/`.
       * - `email-address` — matches an email address. Expects the format of `*@*.*` with at least two levels of the domain name.
       * - `international-phone-number` — matches international phone numbers.
       * The number can have 7 to 15 digits with spaces or `-` occurring anywhere within the number, and it must have prefix of `+` or `00`.
       * - `ipv4` — matches an IPv4 address with an optional mask at the end.
       * - `ipv6` — matches a full and compressed IPv6 address as defined in [RFC 2373](http://www.faqs.org/rfcs/rfc2373.html).
       * - `mac-address` — matches a MAC address with either `-` or `:` as a delimiter.
       * - `north-american-phone-number` — matches North American-style phone numbers.
       * NANPA standardization is used with international support.
       * - `social-security-number` — matches a social security number.
       * Expects the format of `XXX-XX-XXXX` or `XXXXXXXXX`, with X denoting digits.
       * - `time` — matches time formats such as `00:00:00`, `00:00`, and `00:00 PM`. 12- and 24-hour formats are allowed.
       * Seconds and AM/PM denotation are both optional.
       * - `url` — matches a URL with a prefix of `http` or `https`, with an optional subdomain.
       * - `us-zip-code` — matches a USA-style zip code. The format expected is `XXXXX`, `XXXXX-XXXX` or `XXXXX/XXXX`.
       * - `vin` — matches US and ISO Standard 3779 Vehicle Identification Number.
       * The format expects 17 characters, with the last 5 characters being numeric. `I`, `i`, `O`, `o` ,`Q`, `q`, and `_` characters are not allowed.
       * example:
       * email-address
       */
      | Schemas.SearchPreset;
    export type RenderAPStreams = boolean;
    export type SecretId = number;
    export type SecretType = 'jwt' | 'dashboard_password' | 'secret_key_base';
    export type Source = boolean;
    export type Start = number;
    export type StartDate = string; // date-time
    export type Title = string;
    export type Type = 'text' | 'regex' | 'preset';
  }
  export interface PathParameters {
    AttachmentId?: Parameters.AttachmentId;
    BookmarkId?: Parameters.BookmarkId;
    DocumentId?: Parameters.DocumentId;
    JobId?: Parameters.JobId;
    LayerName?: Parameters.LayerName;
    PageIndex?: Parameters.PageIndex;
    AnnotationIdPathParam?: Parameters.AnnotationIdPathParam;
    FormFieldIdPathParam?: Parameters.FormFieldIdPathParam;
    FormFieldWidgetIdPathParam?: Parameters.FormFieldWidgetIdPathParam;
    SecretType?: Parameters.SecretType;
    SecretId?: Parameters.SecretId;
  }
  export interface QueryParameters {
    PageSize?: Parameters.PageSize;
    Cursor?: Parameters.Cursor;
    CountRemainingDocuments?: Parameters.CountRemainingDocuments;
    Title?: Parameters.Title;
    OrderBy?: Parameters.OrderBy;
    OrderDirection?: Parameters.OrderDirection;
    StartDate?: Parameters.StartDate /* date-time */;
    EndDate?: Parameters.EndDate /* date-time */;
    DocumentIdQuery?: Parameters.DocumentIdQuery;
    Q?: Parameters.Q;
    Type?: Parameters.Type;
    Start?: Parameters.Start;
    Limit?: Parameters.Limit;
    IncludeAnnotations?: Parameters.IncludeAnnotations;
    CaseSensitive?: Parameters.CaseSensitive;
    DocumentType?: Parameters.DocumentType;
    Source?: Parameters.Source;
    Flatten?: Parameters.Flatten;
    RenderAPStreams?: Parameters.RenderAPStreams;
    Annotations?: Parameters.Annotations;
    Comments?: Parameters.Comments;
    Optimize?: Parameters.Optimize;
    Conformance?: Parameters.Conformance;
    KeepSignatures?: Parameters.KeepSignatures;
  }
  namespace RequestBodies {
    export interface ValidatePDFARequest {
      /**
       * PDF/A file on which to perform validation.
       */
      file?: string; // binary
    }
  }
  namespace Responses {
    export type BuildResponseOk = Schemas.BuildResponseJsonContents;
  }
  namespace Schemas {
    /**
     * Represents a PDF action.
     *
     * There are many different action types. You can learn more about their semantics
     * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
     *
     * All actions have a `type` property. Depending on the type, the action object
     * includes additional properties.
     * example:
     * {
     *   "type": "goTo",
     *   "pageIndex": 0
     * }
     */
    export type Action =
      /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      /* GoToAction */ | GoToAction
      | /* GoToRemoteAction */ GoToRemoteAction
      | /* GoToEmbeddedAction */ GoToEmbeddedAction
      | /* LaunchAction */ LaunchAction
      | /* URIAction */ URIAction
      | /* HideAction */ HideAction
      | /* JavaScriptAction */ JavaScriptAction
      | /* SubmitFormAction */ SubmitFormAction
      | /* ResetFormAction */ ResetFormAction
      | /* NamedAction */ NamedAction;
    export interface AddPageConfiguration {
      /**
       * A background color that will fill the page.
       * example:
       * #000000
       */
      backgroundColor: string; // ^#[0-9a-fA-F]{6}$
      /**
       * Page width in points.
       * example:
       * 595
       */
      pageWidth: number;
      /**
       * Page height in points.
       * example:
       * 842
       */
      pageHeight: number;
      rotateBy: /**
       * Clockwise rotation of the page.
       * example:
       * 0
       */
      PageRotation;
      /**
       * Insets of the page in a form [left, top, width, height].
       * example:
       * [
       *   10,
       *   10,
       *   10,
       *   10
       * ]
       */
      insets?: [number, number, number, number];
    }
    /**
     * Annotation JSON v2
     * JSON representation of an annotation.
     */
    export type Annotation =
      /**
       * Annotation JSON v2
       * JSON representation of an annotation.
       */
      /**
       * MarkupAnnotation
       * Markup annotations include highlight, squiggly, strikeout, and underline. All of these require a list of rectangles that they're drawn to. The highlight annotation will lay the color on top of the element and apply the multiply blend mode.
       */
      | MarkupAnnotation /**
       * RedactionAnnotation
       * Redaction annotations determines the location of the area marked for redaction.
       */
      | RedactionAnnotation /**
       * TextAnnotation
       * A text box annotation that can be placed anywhere on the screen.
       */
      | TextAnnotation /**
       * InkAnnotation
       * Ink annotations are used for freehand drawings on a page. They can contain multiple line segments. Points within a segment are connected to a line.
       */
      | InkAnnotation /**
       * LinkAnnotation
       * A link can be used to trigger an action when clicked or pressed. The link will be drawn on the bounding box.
       */
      | LinkAnnotation /**
       * NoteAnnotation
       * Note annotations are “sticky notes” attached to a point in the PDF document. They're represented as markers, and each one has an icon associated with it. Its text content is revealed on selection.
       */
      | NoteAnnotation /**
       * EllipseAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | EllipseAnnotation /**
       * RectangleAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | RectangleAnnotation /**
       * LineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | LineAnnotation /**
       * PolylineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolylineAnnotation /**
       * PolygonAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolygonAnnotation /**
       * ImageAnnotation
       * Image annotations are used to annotate a PDF with images.
       */
      | ImageAnnotation /**
       * StampAnnotation
       * A stamp annotation represents a stamp in a PDF.
       */
      | StampAnnotation /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      | WidgetAnnotation /**
       * CommentMarkerAnnotation
       * Comment markers are annotations attached to a point in the PDF document that can be a root of a comment thread. They're represented as markers, and each one has an icon associated with it. Its text content match the content of the first comment in the thread.
       */
      | CommentMarkerAnnotation;
    /**
     * Bounding box of the annotation within the page in a form [left, top, width, height].
     * example:
     * [
     *   255.10077620466092,
     *   656.7566095695641,
     *   145.91672653256705,
     *   18.390804597701162
     * ]
     */
    export type AnnotationBbox = [number, number, number, number];
    /**
     * Annotation Contents
     * JSON representation of an annotation contents.
     */
    export type AnnotationContent =
      /**
       * Annotation Contents
       * JSON representation of an annotation contents.
       */
      /**
       * MarkupAnnotation
       * Markup annotations include highlight, squiggly, strikeout, and underline. All of these require a list of rectangles that they're drawn to. The highlight annotation will lay the color on top of the element and apply the multiply blend mode.
       */
      | MarkupAnnotation /**
       * RedactionAnnotation
       * Redaction annotations determines the location of the area marked for redaction.
       */
      | RedactionAnnotation /**
       * TextAnnotation
       * A text box annotation that can be placed anywhere on the screen.
       */
      | TextAnnotation /**
       * InkAnnotation
       * Ink annotations are used for freehand drawings on a page. They can contain multiple line segments. Points within a segment are connected to a line.
       */
      | InkAnnotation /**
       * LinkAnnotation
       * A link can be used to trigger an action when clicked or pressed. The link will be drawn on the bounding box.
       */
      | LinkAnnotation /**
       * NoteAnnotation
       * Note annotations are “sticky notes” attached to a point in the PDF document. They're represented as markers, and each one has an icon associated with it. Its text content is revealed on selection.
       */
      | NoteAnnotation /**
       * EllipseAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | EllipseAnnotation /**
       * RectangleAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | RectangleAnnotation /**
       * LineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | LineAnnotation /**
       * PolylineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolylineAnnotation /**
       * PolygonAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolygonAnnotation /**
       * ImageAnnotation
       * Image annotations are used to annotate a PDF with images.
       */
      | ImageAnnotation /**
       * StampAnnotation
       * A stamp annotation represents a stamp in a PDF.
       */
      | StampAnnotation;
    /**
     * Represents multiple annotations to be created.
     */
    export interface AnnotationCreateMultiple {
      annotations: {
        content: /**
         * Annotation Contents
         * JSON representation of an annotation contents.
         */
        AnnotationContent;
        user_id?: /**
         * User
         * The user identifier.
         *
         * Note that Nutrient Document Engine does not provide any kind of user management and accepts
         * any string (or `null`) as a valid user ID.
         *
         * For records created or updated in the browser, the `user_id `is extracted from the
         * JSON Web Token (JWT) used for authentication.
         */
        User;
        group?: /**
         * Group
         * The resource group.
         *
         * Group allows to grant access to resources via Collaboration Permissions.
         */
        Group;
      }[];
    }
    /**
     * Represents multiple annotations to be created with attachment.
     */
    export interface AnnotationCreateMultipleWithAttachment {
      [name: string]: /**
       * The binary content of an attachment.
       *
       * Part name is the SHA-256 hash of the attachment contents.
       * example:
       * <binary data>
       */
      AttachmentContent /* binary */ | AnnotationCreateMultipleWithAttachment['annotations'];
      annotations: {
        annotations: {
          content: /**
           * Annotation Contents
           * JSON representation of an annotation contents.
           */
          AnnotationContent;
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          User;
          group?: /**
           * Group
           * The resource group.
           *
           * Group allows to grant access to resources via Collaboration Permissions.
           */
          Group;
        }[];
      };
    }
    /**
     * Represents a single annotation to be created.
     */
    export interface AnnotationCreateSingle {
      content: /**
       * Annotation Contents
       * JSON representation of an annotation contents.
       */
      AnnotationContent;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      id?: /**
       * Annotation ID, unique in scope of a single Instant Layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      AnnotationId;
    }
    /**
     * Represents a single annotation to be created with attachment.
     */
    export interface AnnotationCreateSingleWithAttachment {
      [name: string]: /**
       * The binary content of an attachment.
       *
       * Part name is the SHA-256 hash of the attachment contents.
       * example:
       * <binary data>
       */
      AttachmentContent /* binary */ | AnnotationCreateSingleWithAttachment['annotation'];
      annotation?: {
        content: /**
         * Annotation Contents
         * JSON representation of an annotation contents.
         */
        AnnotationContent;
        user_id?: /**
         * User
         * The user identifier.
         *
         * Note that Nutrient Document Engine does not provide any kind of user management and accepts
         * any string (or `null`) as a valid user ID.
         *
         * For records created or updated in the browser, the `user_id `is extracted from the
         * JSON Web Token (JWT) used for authentication.
         */
        User;
        group?: /**
         * Group
         * The resource group.
         *
         * Group allows to grant access to resources via Collaboration Permissions.
         */
        Group;
      };
    }
    /**
     * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
     * example:
     * {
     *   "foo": "bar"
     * }
     */
    export type AnnotationCustomData = {
      [name: string]: any;
    } | null;
    /**
     * Annotation ID, unique in scope of a single Instant Layer.
     * example:
     * 01DNEDPQQ22W49KDXRFPG4EPEQ
     */
    export type AnnotationId = string;
    /**
     * All annotations
     * The string "all" to remove all annotations.
     * example:
     * all
     */
    export type AnnotationIdsAll = string;
    /**
     * Annotation IDs
     * A list of annotation ids to remove.
     */
    export type AnnotationIdsList = string[];
    /**
     * MultipleAnnotationsResponse
     * Response when multiple annotations are created / updated.
     */
    export interface AnnotationMultipleResponse {
      /**
       * A text summary of the status of the request
       * example:
       * Operation was partially successful
       */
      details?: string;
      request_id?: string;
      /**
       * If all the items in the batch request were successful, then the status will be a success.
       * A partial_failure will occur if only a few of the items in the batch request succeeded.
       * Failure is when none of the items in the batch succeed.
       */
      result?: 'partial_failure' | 'success' | 'failure';
      /**
       * HTTP status code for the request. The status code is 200 if the request was processed.
       * This does not have anything to do with the result - the status code will be 200 even if part of the
       * request failed. In the case of total failures such as malformed JSON, or document not found,
       * this status will be other than 200.
       */
      status?: 200 | 400 | 500;
      /**
       * List of successfully created / updated annotations.
       */
      data?: {
        content: /**
         * Annotation Contents
         * JSON representation of an annotation contents.
         */
        AnnotationContent;
        user_id?: /**
         * User
         * The user identifier.
         *
         * Note that Nutrient Document Engine does not provide any kind of user management and accepts
         * any string (or `null`) as a valid user ID.
         *
         * For records created or updated in the browser, the `user_id `is extracted from the
         * JSON Web Token (JWT) used for authentication.
         */
        User;
        group?: /**
         * Group
         * The resource group.
         *
         * Group allows to grant access to resources via Collaboration Permissions.
         */
        Group;
        id: /**
         * Annotation ID, unique in scope of a single Instant Layer.
         * example:
         * 01DNEDPQQ22W49KDXRFPG4EPEQ
         */
        AnnotationId;
        updatedBy?: /**
         * User
         * The user identifier.
         *
         * Note that Nutrient Document Engine does not provide any kind of user management and accepts
         * any string (or `null`) as a valid user ID.
         *
         * For records created or updated in the browser, the `user_id `is extracted from the
         * JSON Web Token (JWT) used for authentication.
         */
        User;
      }[];
      /**
       * List of failing paths.
       */
      failing_paths?: {
        /**
         * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response
         * example:
         * $.annotations[0]
         */
        path?: string;
        /**
         * example:
         * Page index out of bounds.
         */
        error?: string;
        /**
         * example:
         * The page index of the given annotation was greater than the number of pages in the document.
         */
        details?: string;
      }[];
    }
    /**
     * Note
     * Text of an annotation note.
     * example:
     * This is a note.
     */
    export type AnnotationNote = string;
    /**
     * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
     */
    export type AnnotationOpacity = number;
    /**
     * The text contents.
     * example:
     * Annotation text.
     */
    export type AnnotationPlainText = string;
    /**
     * AnnotationRecord
     * Represents a PDF annotation.
     */
    export interface AnnotationRecord {
      content?: /**
       * Annotation Contents
       * JSON representation of an annotation contents.
       */
      | AnnotationContent /**
         * Annotation JSON v1
         * JSON representation of an annotation.
         */
        | AnnotationV1;
      id?: /**
       * Annotation ID, unique in scope of a single Instant Layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      AnnotationId;
      createdBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
    }
    /**
     * AnnotationReference
     */
    export interface AnnotationReference {
      fieldName?: string;
      pdfObjectId?: number;
    }
    /**
     * Rotation
     * Counterclockwise annotation rotation in degrees.
     */
    export type AnnotationRotation = 0 | 90 | 180 | 270;
    /**
     * The text contents.
     */
    export interface AnnotationText {
      /**
       * The format of the annotation's contents. Can be either `xhtml` or `plain`.
       * If `xhtml` is used, the text will be rendered as XHTML.
       * If `plain` is used, the text will be rendered as plain text.
       *
       * Supported XHTML tags include `span`, `p`, `html`, `body`, `b`, `i`, and `a`.
       * Hyperlinks are also supported in the `a` tags using the `href` attribute.
       * Styles are supported by using inline styles with the `style` attribute.
       * Supported CSS properties include `background-color`, `font-weight`, `font-style`, `text-decoration`, `color`
       */
      format?: 'xhtml' | 'plain';
      /**
       * Actual text content of the annotation. This is the text that will be displayed in the annotation.
       * example:
       * Annotation with <b>xhtml</b> contents.
       */
      value?: string;
    }
    /**
     * Represents a single annotation to be updated.
     */
    export interface AnnotationUpdate {
      content: /**
       * Annotation Contents
       * JSON representation of an annotation contents.
       */
      AnnotationContent;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      /**
       * example:
       * replace_this_with_an_actual_annotation_id
       */
      id?: string;
    }
    /**
     * Represents multiple annotations to be updated.
     */
    export interface AnnotationUpdateMultiple {
      annotations: {
        content: /**
         * Annotation Contents
         * JSON representation of an annotation contents.
         */
        AnnotationContent;
        user_id?: /**
         * User
         * The user identifier.
         *
         * Note that Nutrient Document Engine does not provide any kind of user management and accepts
         * any string (or `null`) as a valid user ID.
         *
         * For records created or updated in the browser, the `user_id `is extracted from the
         * JSON Web Token (JWT) used for authentication.
         */
        User;
        group?: /**
         * Group
         * The resource group.
         *
         * Group allows to grant access to resources via Collaboration Permissions.
         */
        Group;
        /**
         * example:
         * replace_this_with_an_actual_annotation_id
         */
        id: string;
      }[];
    }
    /**
     * Annotation JSON v1
     * JSON representation of an annotation.
     */
    export type AnnotationV1 =
      /**
       * Annotation JSON v1
       * JSON representation of an annotation.
       */
      /**
       * MarkupAnnotation
       * Markup annotations include highlight, squiggly, strikeout, and underline. All of these require a list of rectangles that they're drawn to. The highlight annotation will lay the color on top of the element and apply the multiply blend mode.
       */
      | MarkupAnnotationV1 /**
       * RedactionAnnotation
       * Redaction annotations determines the location of the area marked for redaction.
       */
      | RedactionAnnotationV1 /**
       * TextAnnotation
       * A text box annotation that can be placed anywhere on the screen.
       */
      | TextAnnotationV1 /**
       * InkAnnotation
       * Ink annotations are used for freehand drawings on a page. They can contain multiple line segments. Points within a segment are connected to a line.
       */
      | InkAnnotationV1 /**
       * LinkAnnotation
       * A link can be used to trigger an action when clicked or pressed. The link will be drawn on the bounding box.
       */
      | LinkAnnotationV1 /**
       * NoteAnnotation
       * Note annotations are “sticky notes” attached to a point in the PDF document. They're represented as markers, and each one has an icon associated with it. Its text content is revealed on selection.
       */
      | NoteAnnotationV1 /**
       * EllipseAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | EllipseAnnotationV1 /**
       * RectangleAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | RectangleAnnotationV1 /**
       * LineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | LineAnnotationV1 /**
       * PolylineAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolylineAnnotationV1 /**
       * PolygonAnnotation
       * Shape annotations are used to draw different shapes on a page.
       */
      | PolygonAnnotationV1 /**
       * ImageAnnotation
       * Image annotations are used to annotate a PDF with images.
       */
      | ImageAnnotationV1 /**
       * StampAnnotation
       * A stamp annotation represents a stamp in a PDF.
       */
      | StampAnnotationV1 /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      | WidgetAnnotationV1;
    export interface ApplyInstantJsonAction {
      /**
       * Apply the Instant JSON to the document to import annotations or forms to a document.
       */
      type: 'applyInstantJson';
      file: FileHandle;
    }
    export interface ApplyRedactionsAction {
      /**
       * Applies the redactions created by an earlier `createRedactions` action.
       */
      type: 'applyRedactions';
    }
    export interface ApplyXfdfAction {
      /**
       * Apply the XFDF to the document to import annotations to a document.
       */
      type: 'applyXfdf';
      file: FileHandle;
    }
    export interface AsyncJobStatus {
      /**
       * `status` indicates the state of the job.
       * If there is more relevant information - particularly important for failed and cancelled jobs,
       * then that information will be in `details`.
       */
      data: {
        status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
        details?:
          | string
          | {
              [name: string]: any;
            };
      };
    }
    /**
     * Attachment
     * Represents a binary "attachment" associated with an Annotation.
     *
     * For example, this might be an image attachment for `ImageAnnotation`.
     */
    export interface Attachment {
      /**
       * Base64-encoded binary data of the attachment.
       */
      binary?: string;
      /**
       * MIME type of the attachment's content. For example, `image/png`.
       */
      contentType?: string;
    }
    /**
     * The binary content of an attachment.
     *
     * Part name is the SHA-256 hash of the attachment contents.
     * example:
     * <binary data>
     */
    export type AttachmentContent = string; // binary
    /**
     * Attachments
     * Attachments are defined as an associative array.
     * * Keys are SHA-256 hashes of the attachment contents or the `pdfObjectId`
     * of the attachment (in case it's part of the source PDF).
     * * Values are the actual `Attachment` objects with Base-64 encoded binary
     * contents of the attachment and its content type.
     * example:
     * {
     *   "388dd55f16b0b7ccdf7abdc7a0daea7872ef521de56ee820b4440e52c87d081b": {
     *     "binary": "YXR0YWNobWVudCBjb250ZW50cwo=",
     *     "contentType": "image/png"
     *   },
     *   "ccbb4499fa6d9f003545fa43ec19511fdb7227ca505bba9f74d787dff57af77b": {
     *     "binary": "YW5vdGhlciBhdHRhY2htZW50IGNvbnRlbnRzCg==",
     *     "contentType": "plain/text"
     *   }
     * }
     */
    export interface Attachments {
      [name: string]: /**
       * Attachment
       * Represents a binary "attachment" associated with an Annotation.
       *
       * For example, this might be an image attachment for `ImageAnnotation`.
       */
      Attachment;
    }
    /**
     * BackgroundColor
     * A background color that will fill the bounding box.
     * example:
     * #000000
     */
    export type BackgroundColor = string; // ^#[0-9a-fA-F]{6}$
    /**
     * BaseAction
     */
    export interface BaseAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
    }
    /**
     * BaseAnnotation
     */
    export interface BaseAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: string;
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
    }
    /**
     * BaseAnnotation
     */
    export interface BaseAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: string;
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
    }
    /**
     * BaseFormField
     */
    export interface BaseFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: string;
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
    }
    /**
     * Object representing PDF output.
     */
    export interface BasePDFOutput {
      metadata?: Metadata;
      labels?: Label[];
      /**
       * Defines the password which allows to open a file with defined
       * permissions
       */
      user_password?: string;
      /**
       * Defines the password which allows to manage the permissions for the file
       */
      owner_password?: string;
      /**
       * Defines the permissions which are granted when a file is opened with user password
       */
      user_permissions?: PDFUserPermission[];
      optimize?: OptimizePdf;
    }
    export interface BaseWatermarkAction {
      /**
       * Watermark all pages with text watermark.
       */
      type: 'watermark';
      /**
       * Width of the watermark in PDF points.
       */
      width: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Height of the watermark in PDF points.
       */
      height: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the top edge of a page.
       */
      top?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the right edge of a page.
       */
      right?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the bottom edge of a page.
       */
      bottom?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the left edge of a page.
       */
      left?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Rotation of the watermark in counterclockwise degrees.
       */
      rotation?: number;
      /**
       * Watermark opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
    }
    /**
     * BatchOperationResult
     * This is the response of a batch operation.
     *
     * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
     * - The request succeeds
     * - The request fails completely
     * - The request fails partially
     * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
     * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
     * for the 2 form fields that were created successfully
     *
     * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
     *
     * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
     * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
     * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
     * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
     *
     * The status field of this response will be the same as the HTTP status code is returned along with the response.
     *
     * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
     * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
     * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
     * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
     * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
     * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
     */
    export interface BatchOperationResult {
      /**
       * A text summary of the status of the request
       * example:
       * Operation was partially successful
       */
      details?: string;
      request_id?: string;
      /**
       * If all the items in the batch request were successful, then the status will be a success.
       * A partial_failure will occur if only a few of the items in the batch request succeeded.
       * Failure is when none of the items in the batch succeed.
       */
      result?: 'partial_failure' | 'success' | 'failure';
      /**
       * HTTP status code for the request. The status code is 200 if the request was processed.
       * This does not have anything to do with the result - the status code will be 200 even if part of the
       * request failed. In the case of total failures such as malformed JSON, or document not found,
       * this status will be other than 200.
       */
      status?: 200 | 400 | 500;
      /**
       * List of failing paths.
       */
      failingPaths?: {
        /**
         * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
         * example:
         * $.property[0]
         */
        path?: string;
        /**
         * example:
         * Missing required property
         */
        details?: string;
      }[];
    }
    /**
     * BlendMode
     */
    export type BlendMode =
      | 'normal'
      | 'multiply'
      | 'screen'
      | 'overlay'
      | 'darken'
      | 'lighten'
      | 'colorDodge'
      | 'colorBurn'
      | 'hardLight'
      | 'softLight'
      | 'difference'
      | 'exclusion';
    /**
     * Bookmark
     * A record representing a bookmark.
     */
    export interface Bookmark {
      /**
       * The optional bookmark name. This is used to identify the bookmark.
       */
      name?: string;
      type: 'pspdfkit/bookmark';
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      action: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * The PDF object ID of the bookmark in the PDF.
       */
      pdfBookmarkId?: string;
    }
    /**
     * BookmarkRecord
     */
    export interface BookmarkRecord {
      content: /**
       * Bookmark
       * A record representing a bookmark.
       */
      Bookmark;
      createdBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      id: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
    }
    /**
     * BorderStyle
     */
    export type BorderStyle = 'solid' | 'dashed' | 'beveled' | 'inset' | 'underline';
    export type BuildAction =
      | ApplyInstantJsonAction
      | ApplyXfdfAction
      | FlattenAction
      | OcrAction
      | RotateAction
      | WatermarkAction
      | CreateRedactionsAction
      | ApplyRedactionsAction;
    export interface BuildInstructions {
      /**
       * Parts of the document to be built.
       *
       * Multiple types of parts are supported:
       * * `FilePart` that represents a binary input file that can be either a part name in the `multipart/form-data` request or an URL of a remote file.
       * * `HTMLPart` that represents an HTML input file along with it's assets.
       * * `NewPagePart` that represents a document with empty pages.
       * * `DocumentPart` that represents a document (with optional layer) managed by Nutrient Document Engine. Only applicable if used in a Document Engine context.
       */
      parts: Part[];
      /**
       * Actions to be performed on the document after it is built.
       */
      actions?: BuildAction[];
      output?: BuildOutput;
    }
    export type BuildOutput =
      /* Object representing PDF output. */
      | PDFOutput
      | /* Object representing PDF output. */ PDFAOutput /**
       * ImageOutput
       * Render the document as an image.
       */
      | ImageOutput /**
       * JSONContentOutput
       * JSON with document contents. Returned for `json-content` output type.
       */
      | JSONContentOutput
      | /* OfficeOutput */ OfficeOutput;
    export interface BuildResponseJsonContents {
      pages?: PageJsonContents[];
    }
    /**
     * ButtonFormField
     * A simple push button that responds immediately to user input without retaining any state.
     */
    export interface ButtonFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/button';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      /**
       * Specifies the 'normal' caption of the button
       */
      buttonLabel: string;
    }
    /**
     * The size of the document in bytes.
     * example:
     * 192000
     */
    export type ByteSize = number;
    export interface Character {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * example:
       * T
       */
      value: string;
    }
    /**
     * CheckBoxFormField
     * A check box that can either be checked or unchecked. One check box form field can also be associated to multiple single check box widgets
     */
    export interface CheckboxFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/checkbox';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      options: /**
       * The list of form field options.
       *
       * The index of the widget annotation ID in the `annotationIds`
       * property corresponds to an index in the  form field option array.
       * example:
       * [
       *   {
       *     "label": "MALE",
       *     "value": "MALE"
       *   },
       *   {
       *     "label": "FEMALE",
       *     "value": "FEMALE"
       *   }
       * ]
       */
      FormFieldOptions;
      defaultValues: /* Default values corresponding to each option. */ FormFieldDefaultValues;
      additionalActions?: /* Additional actions that can be performed on the form field. */ FormFieldAdditionalActionsEvent;
    }
    export interface ChoiceFormField {
      options: /**
       * The list of form field options.
       *
       * The index of the widget annotation ID in the `annotationIds`
       * property corresponds to an index in the  form field option array.
       * example:
       * [
       *   {
       *     "label": "MALE",
       *     "value": "MALE"
       *   },
       *   {
       *     "label": "FEMALE",
       *     "value": "FEMALE"
       *   }
       * ]
       */
      FormFieldOptions;
      /**
       * If true, more than one of the field's option items may be selected
       * simultaneously.
       */
      multiSelect?: boolean;
      /**
       * If true, the new value is committed as soon as a selection is made, without
       * requiring the user to blur the field.
       */
      commitOnChange?: boolean;
      defaultValues?: /* Default values corresponding to each option. */ FormFieldDefaultValues;
      additionalActions?: /* Additional actions that can be performed on the form field. */ FormFieldAdditionalActionsEvent;
    }
    /**
     * CloudyBorderInset
     * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
     */
    export type CloudyBorderInset = number[];
    /**
     * CloudyBorderIntensity
     */
    export type CloudyBorderIntensity = number;
    /**
     * ComboBoxFormField
     * A combo box is a drop-down box with the option add custom entries (see `edit`).
     */
    export interface ComboBoxFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/combobox';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      options: /**
       * The list of form field options.
       *
       * The index of the widget annotation ID in the `annotationIds`
       * property corresponds to an index in the  form field option array.
       * example:
       * [
       *   {
       *     "label": "MALE",
       *     "value": "MALE"
       *   },
       *   {
       *     "label": "FEMALE",
       *     "value": "FEMALE"
       *   }
       * ]
       */
      FormFieldOptions;
      /**
       * If true, more than one of the field's option items may be selected
       * simultaneously.
       */
      multiSelect?: boolean;
      /**
       * If true, the new value is committed as soon as a selection is made, without
       * requiring the user to blur the field.
       */
      commitOnChange?: boolean;
      defaultValues?: /* Default values corresponding to each option. */ FormFieldDefaultValues;
      additionalActions?: /* Additional actions that can be performed on the form field. */ FormFieldAdditionalActionsEvent;
      /**
       * If true, the combo box includes an editable text box as well as a dropdown list. If false, it includes only a drop-down list.
       */
      edit: boolean;
      /**
       * If true, the text entered in the field is not spell-checked.
       */
      doNotSpellCheck: boolean;
    }
    /**
     * A single comment in the document
     */
    export interface Comment {
      id: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      group: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      createdBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      content: /**
       * Comments JSON
       * JSON representation of a comment.
       */
      CommentContent;
    }
    /**
     * Comments JSON
     * JSON representation of a comment.
     */
    export type CommentContent =
      /**
       * Comments JSON
       * JSON representation of a comment.
       */
      /* Comment JSON v2 */ InstantCommentV2 | /* Comment JSON v1 */ InstantCommentV1;
    export interface CommentCreate {
      id?: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      content: {
        text: /**
         * Text of a comment
         * example:
         * What a wonderful idea!
         */
        CommentText;
        createdAt?: /**
         * ISO8601 timestamp of when the comment was written
         * example:
         * 2019-11-14T15:05:03.089Z
         */
        CommentCreatedAt;
        updatedAt?: /**
         * ISO8601 timestamp of when the comment was edited
         * example:
         * 2019-11-22T18:05:03.712Z
         */
        CommentUpdatedAt;
        customData?: /**
         * CustomData
         * Object of arbitrary properties attached to an entity
         */
        CustomData;
        creatorName?: /**
         * Name of the comment author
         * example:
         * John Doe
         */
        CommentCreatorName;
      };
    }
    /**
     * ISO8601 timestamp of when the comment was written
     * example:
     * 2019-11-14T15:05:03.089Z
     */
    export type CommentCreatedAt = string;
    /**
     * Name of the comment author
     * example:
     * John Doe
     */
    export type CommentCreatorName = string | null;
    /**
     * CommentMarkerAnnotation
     * Comment markers are annotations attached to a point in the PDF document that can be a root of a comment thread. They're represented as markers, and each one has an icon associated with it. Its text content match the content of the first comment in the thread.
     */
    export interface CommentMarkerAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: string;
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      text?: /* The text contents. */ AnnotationText;
      icon: /* NoteIcon */ NoteIcon;
      /**
       * A color that fills the note shape and its icon.
       * example:
       * #ffd83f
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
      isCommentThreadRoot?: /**
       * isCommentThreadRoot
       * Indicates whether the annotation is the root of a comment thread.
       */
      IsCommentThreadRoot;
    }
    /**
     * Text of a comment
     * example:
     * What a wonderful idea!
     */
    export type CommentText = string | null;
    /**
     * ISO8601 timestamp of when the comment was edited
     * example:
     * 2019-11-22T18:05:03.712Z
     */
    export type CommentUpdatedAt = string | null;
    export interface CommentsCreate {
      /**
       * A list of comments to be added
       */
      comments: CommentCreate[];
    }
    export interface CommentsCreateErrors {
      /**
       * A list of errors encountered when creating comments.
       *
       * Each entry in the list represents errors for a single comment.
       */
      comments?: {
        [key: string]: any;
      }[];
    }
    export interface CommentsCreateErrorsWithRoot {
      /**
       * Errors encountered when creating root annotation.
       * example:
       * {
       *   "content": [
       *     "is required"
       *   ]
       * }
       */
      annotation?: {
        [key: string]: any;
      };
      /**
       * A list of errors encountered when creating comments.
       *
       * Each entry in the list represents errors for a single comment.
       */
      comments?: {
        [key: string]: any;
      }[];
    }
    export interface CommentsCreateWithRoot {
      annotation: /* Represents a single annotation to be created. */ AnnotationCreateSingle;
      /**
       * A list of comments to be added
       */
      comments: CommentCreate[];
    }
    export interface CommentsCreated {
      data: {
        /**
         * IDs of the added comments
         */
        comments: {
          id: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          RecordId;
        }[];
      };
    }
    export interface CommentsCreatedWithRoot {
      data: {
        annotation: {
          id: /**
           * Annotation ID, unique in scope of a single Instant Layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          AnnotationId;
        };
        /**
         * IDs of the added comments
         */
        comments: {
          id: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          RecordId;
        }[];
      };
    }
    export interface CommentsList {
      data: {
        /**
         * A list of all comments under the given annotation
         */
        comments: /* A single comment in the document */ Comment[];
      };
    }
    /**
     * Specifies the confidence score of pair, in the range [0 - 100].
     * example:
     * 95.4
     */
    export type Confidence = number;
    /**
     * CreateDigitalSignature
     * example:
     * {
     *   "signatureType": "cades",
     *   "flatten": false,
     *   "appearance": {
     *     "mode": "signatureOnly",
     *     "contentType": "image/png",
     *     "showWatermark": true,
     *     "showSignDate": true
     *   },
     *   "position": {
     *     "pageIndex": 0
     *   },
     *   "cadesLevel": "b-lt"
     * }
     */
    export interface CreateDigitalSignature {
      /**
       * The signature type to create.
       * Note: While this field is required if sending signature parameters,
       * the entire `data` object itself is optional in the multipart request.
       */
      signatureType: 'cms' | 'cades';
      /**
       * Controls whether to flatten the document before signing it.
       * This is useful when you want the document's appearance to remain stable before signing and to ensure there's no indication that the document can be edited after signing.
       *
       * Note that the resulting document's records (annotations and form fields) will be deleted.
       */
      flatten?: boolean;
      /**
       * Name of the signature form field to sign. Use this when signing an existing signature form field.
       * If a signature field with this name does not exist in the document, it will be created at the position specified with `position`.
       *
       * If a signature field with the specified name exists and `position` is also set, the request will result in an error.
       *
       * Note: Either `formFieldName` or `position` must be provided if creating a visible signature.
       * example:
       * signatureI-field
       */
      formFieldName?: string;
      /**
       * The appearance settings for the visible signature. Omit if you want an invisible signature to be created.
       */
      appearance?: {
        /**
         * Specifies what will be rendered in the signature appearance: graphics, description, or both.
         * Visit the [Configure Digital Signature Appearance guide](https://www.nutrient.io/guides/web/signatures/digital-signatures/signature-lifecycle/configure-digital-signature-appearance/) for a detailed description of the signature modes.
         * example:
         * signatureOnly
         */
        mode?: 'signatureOnly' | 'signatureAndDescription' | 'descriptionOnly';
        /**
         * The content type of the watermark image when provided in the `image` parameter of the multipart request.
         * Supported types are `application/pdf`, `image/png`, and `image/jpeg`.
         * example:
         * image/png
         */
        contentType?: string;
        /**
         * Controls whether the signer name from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the name will not be shown in the signature appearance.
         */
        showSigner?: boolean;
        /**
         * Controls whether the signing reason from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the reason will not be shown in the signature appearance.
         */
        showReason?: boolean;
        /**
         * Controls whether the signing location from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the location will not be shown in the signature appearance.
         */
        showLocation?: boolean;
        /**
         * Controls whether to include the watermark in the signature appearance.
         * When `true` and a watermark image is provided via the `watermark` parameter, it will be included.
         * When `true` and no watermark image is provided, the Nutrient logo will be used as the default watermark.
         */
        showWatermark?: boolean;
        /**
         * Controls whether to show the signing date and time in the signature appearance.
         * When `true`, the date and time will be shown in ISO 8601 format.
         * Example: 2023-06-15 13:57:31
         */
        showSignDate?: boolean;
        /**
         * Controls whether to include the timezone in the signing date.
         * Only applies when `showSignDate` is `true`.
         */
        showDateTimezone?: boolean;
      };
      /**
       * Position of the visible signature form field. Omit if you want an invisible signature or if you specified the `formFieldName` option.
       */
      position?: {
        /**
         * The index of the page where the signature appearance will be rendered.
         */
        pageIndex: number;
        /**
         * An array of 4 numbers (points) representing the bounding box where the signature appearance will be rendered on the specified `pageIndex`.
         *
         * [left, top, width, height]
         *
         * The unit is PDF points (1 PDF point equals 1⁄72 of an inch).
         * The first two numbers describe the [left,top] coordinates of the top left corner of the bounding box,
         * while the second two numbers describe the width and height of the bounding box.
         * example:
         * [
         *   0,
         *   0,
         *   100,
         *   100
         * ]
         */
        rect: [number, number, number, number];
      };
      /**
       * Optional metadata that describes the digital signature and becomes part of the signature itself.
       * This information will be shown by PDF readers to end users and can be included in the visual appearance of the signature
       * if you opted for a visible signature and enabled the necessary options in `appearance`.
       */
      signatureMetadata?: {
        /**
         * The name of the person or organization signing the document.
         * example:
         * John Appleseed
         */
        signerName?: string;
        /**
         * The reason for signing the document.
         * example:
         * Document Accepted
         */
        signatureReason?: string;
        /**
         * The geographical or digital location where the document is being signed.
         * example:
         * Vienna, Austria
         */
        signatureLocation?: string;
      };
      /**
       * The CAdES level to use when creating the signature. The default value is `CAdES B-LT`.
       * This parameter is ignored when the `signatureType` is `cms`.
       *
       * This is more like a hint of what level to use, and you should be aware that the API can return `b-b` even when you ask for `b-lt`. This can happen when the timestamp authority server is down, etc.
       *
       * If this API is invoked with the [Document Engine](https://www.nutrient.io/sdk/document-engine), you can override the default with the following environment variable: [`DIGITAL_SIGNATURE_CADES_LEVEL`](https://www.nutrient.io/guides/document-engine/configuration/options/).
       *
       * For Long-Term Validation (LTV) of the signature - when this API is invoked with the [Document Engine](https://www.nutrient.io/sdk/document-engine) - you need to ensure that the signing certificate chain links to a trusted anchor Certificate Authority (CA) at the time of signing.
       *
       * To add the root CA and necessary intermediate CAs to your Document Engine instance, follow the instructions in [our guide on Providing Trusted Root Certificates](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates).
       */
      cadesLevel?: 'b-lt' | 'b-t' | 'b-b';
    }
    /**
     * CreateDigitalSignature
     * example:
     * {
     *   "signatureContainer": "raw",
     *   "signatureType": "cades",
     *   "signingToken": "user-1-with-rights",
     *   "flatten": false,
     *   "appearance": {
     *     "mode": "signatureOnly",
     *     "contentType": "image/png",
     *     "showSigner": true,
     *     "showReason": true,
     *     "showLocation": true,
     *     "showWatermark": true,
     *     "showSignDate": true
     *   },
     *   "position": {
     *     "pageIndex": 0,
     *     "rect": [
     *       0,
     *       0,
     *       100,
     *       100
     *     ]
     *   },
     *   "signatureMetadata": {
     *     "signerName": "John Appleseed",
     *     "signatureReason": "accepted",
     *     "signatureLocation": "Vienna"
     *   },
     *   "cadesLevel": "b-lt"
     * }
     */
    export interface CreateDigitalSignatureCustom {
      /**
       * Controls the signature container that will be requested from the signing service:
       *   * `pkcs7` - signing service is expected to return PKCS#7 container with signed data.
       *   * `raw` - signing service is expected to return RSA signed data directly. Expects PKCS#1 v1.5 signed data.
       *
       * The default value is `pkcs7`.
       * example:
       * pkcs7
       */
      signatureContainer?: 'pkcs7' | 'raw';
      /**
       * The hash algorithm to use when computing the digest of the document.
       *
       * The default value is `sha256`.
       * It is recommended to use `sha256` or better.
       * example:
       * sha256
       */
      hashAlgorithm?: 'md5' | 'sha160' | 'sha224' | 'sha256' | 'sha384' | 'sha512';
      /**
       * A set of base64-encoded X.509 certificates that will be used to sign the document.
       *
       * Required for `raw` signature container or `cades` signature type. If not provided, will be requested from the signing service.
       */
      certificates?: string[];
      /**
       * A string token that will be forwarded to the underlying signing service.
       * example:
       * user-1-with-rights
       */
      signingToken?: string;
      /**
       * Estimated size of the signature (in bytes). The estimated size is the size for the signature
       * that will be reserved in the PDF document before digitally signing it.
       *
       * A big estimated size will possibly make the signed
       * document bigger than necessary, but a too small one will cause the
       * signing process to fail. The value will be clamped to the nearest even value
       * between 0 and 256 KB (262144 bytes).
       *
       * By default, Document Engine will set a size of 32 KB (32768 bytes), which should be enough to support even complex certificates.
       *
       * > ℹ️ Note: The `estimatedSize` corresponds to the `/Contents` field of the signature field
       * — that is, the signature container. The size of the signature container mostly depends on the
       * complexity of the certificates used for digital signatures.
       * example:
       * 65536
       */
      estimatedSize?: number;
    }
    /**
     * Document Engine supports importing an XFDF or Instant JSON
     * file on upload. This replaces all existing annotations
     *  in the uploaded PDF with the annotations from the uploaded
     *  XFDF or Instant JSON file.
     *
     * If you want to add annotations to already existing ones
     * instead of replacing them when you import an XFDF file, you
     * can set `keep_current_annotations` to `true`.
     */
    export type CreateDocumentAttachment = string; // binary
    /**
     * By default, a document added by a URL is not persistently stored in
     * Document Engine and will be fetched from the URL when necessary
     *
     * If this is set to `true`, the document will be stored persistently.
     *
     * Ignored when the document is not being created by a URL.
     */
    export type CreateDocumentCopyAssetToStorageBackend = boolean;
    /**
     * The document ID.
     *
     * Document Engine supports providing an arbitrary `document_id`
     * on upload. This can be useful when you want to use your own
     * identifiers for documents.
     *
     * This feature can also be used to migrate from an existing
     * document management solution on demand, as we explained in
     * the [document migration
     * guide](https://www.nutrient.io/guides/document-engine/file-management/migrate/from-amazon-s3/).
     * example:
     * 7KPSE41NWKDGK5T9CFS3S53JTP
     */
    export type CreateDocumentId = string;
    /**
     * Add Document with Instructions
     */
    export interface CreateDocumentInstructions {
      instructions: BuildInstructions;
      storage?: /* DocumentStorageConfiguration */ StorageConfiguration;
      document_id?: /**
       * The document ID.
       *
       * Document Engine supports providing an arbitrary `document_id`
       * on upload. This can be useful when you want to use your own
       * identifiers for documents.
       *
       * This feature can also be used to migrate from an existing
       * document management solution on demand, as we explained in
       * the [document migration
       * guide](https://www.nutrient.io/guides/document-engine/file-management/migrate/from-amazon-s3/).
       * example:
       * 7KPSE41NWKDGK5T9CFS3S53JTP
       */
      CreateDocumentId;
      title?: /**
       * The document title.
       *
       * Document Engine supports providing an arbitrary `title` on upload,
       * which will override the title included in the PDF document (if present).
       *
       * The title specified here will not be embedded in the PDF. If you download the PDF,
       * the original title will still be shown. In place of the title upload parameter,
       * you can set the title via Build instructions with title specified in the PDF output metadata.
       * This will actually embed the title in the PDF.
       */
      CreateDocumentTitle;
      overwrite_existing_document?: /**
       * By default an error is thrown when uploading a document with
       * an already existing id.
       *
       * If this is set to `true` any existing document will be removed
       * before the new document is created using the provided id.
       */
      CreateDocumentOverwriteExistingDocument;
    }
    /**
     * Only effective when attaching an XFDF file.
     *
     * If you want to add annotations to already existing ones
     * instead of replacing them when you import an XFDF file, you
     * can set `keep_current_annotations` to `true`.
     */
    export type CreateDocumentKeepCurrentAnnotations = boolean;
    /**
     * By default an error is thrown when uploading a document with
     * an already existing id.
     *
     * If this is set to `true` any existing document will be removed
     * before the new document is created using the provided id.
     */
    export type CreateDocumentOverwriteExistingDocument = boolean;
    /**
     * SHA256 checksum of the PDF file.
     *
     * When using the API to add a document from a URL, your backend storage must
     * always deliver the same file, since the SHA256 will never be recalculated after
     * the document is created. If the file on your storage backend changes and
     * Document Engine needs to refetch the file (e.g. because it's no longer cached),
     * this will result in a `hash_mismatch` error on Document Engine.
     */
    export type CreateDocumentSha256 = string;
    /**
     * The document title.
     *
     * Document Engine supports providing an arbitrary `title` on upload,
     * which will override the title included in the PDF document (if present).
     *
     * The title specified here will not be embedded in the PDF. If you download the PDF,
     * the original title will still be shown. In place of the title upload parameter,
     * you can set the title via Build instructions with title specified in the PDF output metadata.
     * This will actually embed the title in the PDF.
     */
    export type CreateDocumentTitle = string;
    /**
     * Add Document from Upload
     */
    export interface CreateDocumentUpload {
      /**
       * The binary content of the file.
       * example:
       * <PDF data>
       */
      file: string; // binary
      storage?: /* DocumentStorageConfiguration */ StorageConfiguration;
      document_id?: /**
       * The document ID.
       *
       * Document Engine supports providing an arbitrary `document_id`
       * on upload. This can be useful when you want to use your own
       * identifiers for documents.
       *
       * This feature can also be used to migrate from an existing
       * document management solution on demand, as we explained in
       * the [document migration
       * guide](https://www.nutrient.io/guides/document-engine/file-management/migrate/from-amazon-s3/).
       * example:
       * 7KPSE41NWKDGK5T9CFS3S53JTP
       */
      CreateDocumentId;
      title?: /**
       * The document title.
       *
       * Document Engine supports providing an arbitrary `title` on upload,
       * which will override the title included in the PDF document (if present).
       *
       * The title specified here will not be embedded in the PDF. If you download the PDF,
       * the original title will still be shown. In place of the title upload parameter,
       * you can set the title via Build instructions with title specified in the PDF output metadata.
       * This will actually embed the title in the PDF.
       */
      CreateDocumentTitle;
      attachment?: /**
       * Document Engine supports importing an XFDF or Instant JSON
       * file on upload. This replaces all existing annotations
       *  in the uploaded PDF with the annotations from the uploaded
       *  XFDF or Instant JSON file.
       *
       * If you want to add annotations to already existing ones
       * instead of replacing them when you import an XFDF file, you
       * can set `keep_current_annotations` to `true`.
       */
      CreateDocumentAttachment /* binary */;
      keep_current_annotations?: /**
       * Only effective when attaching an XFDF file.
       *
       * If you want to add annotations to already existing ones
       * instead of replacing them when you import an XFDF file, you
       * can set `keep_current_annotations` to `true`.
       */
      CreateDocumentKeepCurrentAnnotations;
      overwrite_existing_document?: /**
       * By default an error is thrown when uploading a document with
       * an already existing id.
       *
       * If this is set to `true` any existing document will be removed
       * before the new document is created using the provided id.
       */
      CreateDocumentOverwriteExistingDocument;
    }
    /**
     * Add Document from URL
     */
    export interface CreateDocumentUrl {
      document_id?: /**
       * The document ID.
       *
       * Document Engine supports providing an arbitrary `document_id`
       * on upload. This can be useful when you want to use your own
       * identifiers for documents.
       *
       * This feature can also be used to migrate from an existing
       * document management solution on demand, as we explained in
       * the [document migration
       * guide](https://www.nutrient.io/guides/document-engine/file-management/migrate/from-amazon-s3/).
       * example:
       * 7KPSE41NWKDGK5T9CFS3S53JTP
       */
      CreateDocumentId;
      title?: /**
       * The document title.
       *
       * Document Engine supports providing an arbitrary `title` on upload,
       * which will override the title included in the PDF document (if present).
       *
       * The title specified here will not be embedded in the PDF. If you download the PDF,
       * the original title will still be shown. In place of the title upload parameter,
       * you can set the title via Build instructions with title specified in the PDF output metadata.
       * This will actually embed the title in the PDF.
       */
      CreateDocumentTitle;
      /**
       * Absolute URL of the PDF document.
       *
       * When using the API to add a document from a URL, your backend storage must
       * always deliver the same file, since the SHA256 will never be recalculated after
       * the document is created. If the file on your storage backend changes and
       * Document Engine needs to refetch the file (e.g. because it's no longer cached),
       * this will result in a `hash_mismatch` error on Document Engine.
       */
      url: string;
      storage?: /* DocumentStorageConfiguration */ StorageConfiguration;
      copy_asset_to_storage_backend?: /**
       * By default, a document added by a URL is not persistently stored in
       * Document Engine and will be fetched from the URL when necessary
       *
       * If this is set to `true`, the document will be stored persistently.
       *
       * Ignored when the document is not being created by a URL.
       */
      CreateDocumentCopyAssetToStorageBackend;
      sha256?: /**
       * SHA256 checksum of the PDF file.
       *
       * When using the API to add a document from a URL, your backend storage must
       * always deliver the same file, since the SHA256 will never be recalculated after
       * the document is created. If the file on your storage backend changes and
       * Document Engine needs to refetch the file (e.g. because it's no longer cached),
       * this will result in a `hash_mismatch` error on Document Engine.
       */
      CreateDocumentSha256;
      attachment?: /**
       * Document Engine supports importing an XFDF or Instant JSON
       * file on upload. This replaces all existing annotations
       *  in the uploaded PDF with the annotations from the uploaded
       *  XFDF or Instant JSON file.
       *
       * If you want to add annotations to already existing ones
       * instead of replacing them when you import an XFDF file, you
       * can set `keep_current_annotations` to `true`.
       */
      CreateDocumentAttachment /* binary */;
      keep_current_annotations?: /**
       * Only effective when attaching an XFDF file.
       *
       * If you want to add annotations to already existing ones
       * instead of replacing them when you import an XFDF file, you
       * can set `keep_current_annotations` to `true`.
       */
      CreateDocumentKeepCurrentAnnotations;
      overwrite_existing_document?: /**
       * By default an error is thrown when uploading a document with
       * an already existing id.
       *
       * If this is set to `true` any existing document will be removed
       * before the new document is created using the provided id.
       */
      CreateDocumentOverwriteExistingDocument;
    }
    /**
     * CreateRedactions
     */
    export type CreateRedactions =
      /* CreateRedactions */
      | {
          strategy: 'preset';
          strategyOptions: CreateRedactionsStrategyOptionsPreset;
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          User;
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        }
      | {
          strategy: 'regex';
          strategyOptions: CreateRedactionsStrategyOptionsRegex;
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          User;
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        }
      | {
          strategy: 'text';
          strategyOptions: CreateRedactionsStrategyOptionsText;
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          User;
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        };
    export type CreateRedactionsAction =
      | {
          strategy: 'preset';
          strategyOptions: CreateRedactionsStrategyOptionsPreset;
          /**
           * Creates redactions according to the given strategy. Once redactions are created, they need to be applied using the `applyRedactions` action.
           * You can configure some visual aspects of the redaction annotation, including its background color, overlay text, and so on, by passing an optional `content` object.
           */
          type: 'createRedactions';
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        }
      | {
          strategy: 'regex';
          strategyOptions: CreateRedactionsStrategyOptionsRegex;
          /**
           * Creates redactions according to the given strategy. Once redactions are created, they need to be applied using the `applyRedactions` action.
           * You can configure some visual aspects of the redaction annotation, including its background color, overlay text, and so on, by passing an optional `content` object.
           */
          type: 'createRedactions';
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        }
      | {
          strategy: 'text';
          strategyOptions: CreateRedactionsStrategyOptionsText;
          /**
           * Creates redactions according to the given strategy. Once redactions are created, they need to be applied using the `applyRedactions` action.
           * You can configure some visual aspects of the redaction annotation, including its background color, overlay text, and so on, by passing an optional `content` object.
           */
          type: 'createRedactions';
          content?: /**
           * RedactionAnnotation
           * Redaction annotations determines the location of the area marked for redaction.
           */
          RedactionAnnotation;
        };
    /**
     * CreateRedactionsErrors
     */
    export interface CreateRedactionsErrors {
      /**
       * An object with errors encountered when creating redaction annotations.
       * example:
       * {
       *   "strategy": [
       *     "is invalid"
       *   ]
       * }
       */
      error: {
        [key: string]: any;
      };
    }
    export interface CreateRedactionsStrategyOptionsPreset {
      preset: /**
       * - `credit-card-number` — matches a number with 13 to 19 digits that begins with 1—6.
       * Spaces and `-` are allowed anywhere in the number.
       * - `date` — matches date formats such as `mm/dd/yyyy`, `mm/dd/yy`, `dd/mm/yyyy`, and `dd/mm/yy`.
       * It rejects any days greater than 31 or months greater than 12 and accepts a leading 0 in front of a single-digit day or month.
       * The delimiter can be `-`, `.`, or `/`.
       * - `email-address` — matches an email address. Expects the format of `*@*.*` with at least two levels of the domain name.
       * - `international-phone-number` — matches international phone numbers.
       * The number can have 7 to 15 digits with spaces or `-` occurring anywhere within the number, and it must have prefix of `+` or `00`.
       * - `ipv4` — matches an IPv4 address with an optional mask at the end.
       * - `ipv6` — matches a full and compressed IPv6 address as defined in [RFC 2373](http://www.faqs.org/rfcs/rfc2373.html).
       * - `mac-address` — matches a MAC address with either `-` or `:` as a delimiter.
       * - `north-american-phone-number` — matches North American-style phone numbers.
       * NANPA standardization is used with international support.
       * - `social-security-number` — matches a social security number.
       * Expects the format of `XXX-XX-XXXX` or `XXXXXXXXX`, with X denoting digits.
       * - `time` — matches time formats such as `00:00:00`, `00:00`, and `00:00 PM`. 12- and 24-hour formats are allowed.
       * Seconds and AM/PM denotation are both optional.
       * - `url` — matches a URL with a prefix of `http` or `https`, with an optional subdomain.
       * - `us-zip-code` — matches a USA-style zip code. The format expected is `XXXXX`, `XXXXX-XXXX` or `XXXXX/XXXX`.
       * - `vin` — matches US and ISO Standard 3779 Vehicle Identification Number.
       * The format expects 17 characters, with the last 5 characters being numeric. `I`, `i`, `O`, `o` ,`Q`, `q`, and `_` characters are not allowed.
       * example:
       * email-address
       */
      SearchPreset;
      /**
       * Determines if redaction annotations are created on top of annotations whose
       * content match the provided preset.
       */
      includeAnnotations?: boolean;
      /**
       * The index of the page from where you want to start the search.
       */
      start?: number;
      /**
       * Starting from start, the number of pages to search. Default is to the end of
       * the document.
       */
      limit?: number;
    }
    export interface CreateRedactionsStrategyOptionsRegex {
      /**
       * Regex search term used for searching for text to redact.
       * example:
       * @pspdfkit\\.com
       */
      regex: string;
      /**
       * Determines if redaction annotations are created on top of annotations whose
       * content match the provided preset.
       */
      includeAnnotations?: boolean;
      /**
       * Determines if the search will be case sensitive.
       */
      caseSensitive?: boolean;
      /**
       * The index of the page from where you want to start the search.
       */
      start?: number;
      /**
       * Starting from start, the number of pages to search. Default is to the end of
       * the document.
       */
      limit?: number;
    }
    export interface CreateRedactionsStrategyOptionsText {
      /**
       * Search term used for searching for text to redact.
       * example:
       * @nutrient.io
       */
      text: string;
      /**
       * Determines if redaction annotations are created on top of annotations whose
       * content match the provided preset.
       */
      includeAnnotations?: boolean;
      /**
       * Determines if the search will be case sensitive.
       */
      caseSensitive?: boolean;
      /**
       * The index of the page from where you want to start the search.
       */
      start?: number;
      /**
       * Starting from start, the number of pages to search. Default is to the end of
       * the document.
       */
      limit?: number;
    }
    /**
     * CustomData
     * Object of arbitrary properties attached to an entity
     */
    export type CustomData = {
      [name: string]: any;
    } | null;
    export interface DeleteAnnotations {
      /**
       * example:
       * all
       */
      annotationIds: /**
       * example:
       * all
       */
      /**
       * All annotations
       * The string "all" to remove all annotations.
       * example:
       * all
       */
      | AnnotationIdsAll /**
         * Annotation IDs
         * A list of annotation ids to remove.
         */
        | AnnotationIdsList;
    }
    /**
     * DigitalSignature
     * Represents a digital signature associated with a portion of the document.
     * A signature's status is expressed via two properties:
     *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
     *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
     */
    export interface DigitalSignature {
      /**
       * example:
       * John Appleseed
       */
      signerName?: string;
      /**
       * example:
       * 2013-12-19 14:45:26
       */
      creationDate?: string;
      /**
       * example:
       * accepted
       */
      signatureReason?: string;
      /**
       * example:
       * Vienna
       */
      signatureLocation?: string;
      documentIntegrityStatus:
        | 'ok'
        | 'tampered_document'
        | 'failed_to_retrieve_signature_contents'
        | 'failed_to_retrieve_byterange'
        | 'failed_to_compute_digest'
        | 'failed_to_retrieve_signing_certificate'
        | 'failed_to_retrieve_public_key'
        | 'failed_encryption_padding'
        | 'failed_unsupported_signature_type'
        | 'general_failure';
      certificateChainValidationStatus:
        | 'ok'
        | 'ok_but_self_signed'
        | 'ok_but_could_not_check_revocation'
        | 'untrusted'
        | 'expired'
        | 'not_yet_valid'
        | 'invalid'
        | 'revoked'
        | 'failed_to_retrieve_signature_contents'
        | 'general_validation_problem';
      signatureValidationStatus: 'valid' | 'warning' | 'error';
      isTrusted: boolean;
      isSelfSigned: boolean;
      isExpired: boolean;
      documentModifiedSinceSignature: boolean;
      /**
       * example:
       * 2023-12-01T15:34:15Z
       */
      validFrom?: string;
      /**
       * example:
       * 2025-11-30T15:34:14Z
       */
      validUntil?: string;
      type?: 'pspdfkit/signature-info';
      /**
       * example:
       * Signature-a9c0376e-15cd-416f-9b8f-bbf341fae0ca
       */
      signatureFormFQN?: string;
      /**
       * example:
       * false
       */
      ltv?: boolean;
      signatureType?: 'cms' | 'cades';
    }
    /**
     * CreateDigitalSignature
     * example:
     * {
     *   "signatureType": "cades",
     *   "flatten": false,
     *   "appearance": {
     *     "mode": "signatureOnly",
     *     "contentType": "image/png",
     *     "showWatermark": true,
     *     "showSignDate": true,
     *     "showSigner": true,
     *     "showReason": true,
     *     "showLocation": true
     *   },
     *   "position": {
     *     "pageIndex": 0,
     *     "rect": [
     *       0,
     *       0,
     *       100,
     *       100
     *     ]
     *   },
     *   "cadesLevel": "b-lt",
     *   "signatureContainer": "raw",
     *   "signingToken": "user-1-with-rights",
     *   "signatureMetadata": {
     *     "signerName": "John Appleseed",
     *     "signatureReason": "accepted",
     *     "signatureLocation": "Vienna"
     *   }
     * }
     */
    export interface DigitalSignatureCreate {
      /**
       * The signature type to create.
       * Note: While this field is required if sending signature parameters,
       * the entire `data` object itself is optional in the multipart request.
       */
      signatureType: 'cms' | 'cades';
      /**
       * Controls whether to flatten the document before signing it.
       * This is useful when you want the document's appearance to remain stable before signing and to ensure there's no indication that the document can be edited after signing.
       *
       * Note that the resulting document's records (annotations and form fields) will be deleted.
       */
      flatten?: boolean;
      /**
       * Name of the signature form field to sign. Use this when signing an existing signature form field.
       * If a signature field with this name does not exist in the document, it will be created at the position specified with `position`.
       *
       * If a signature field with the specified name exists and `position` is also set, the request will result in an error.
       *
       * Note: Either `formFieldName` or `position` must be provided if creating a visible signature.
       * example:
       * signatureI-field
       */
      formFieldName?: string;
      /**
       * The appearance settings for the visible signature. Omit if you want an invisible signature to be created.
       */
      appearance?: {
        /**
         * Specifies what will be rendered in the signature appearance: graphics, description, or both.
         * Visit the [Configure Digital Signature Appearance guide](https://www.nutrient.io/guides/web/signatures/digital-signatures/signature-lifecycle/configure-digital-signature-appearance/) for a detailed description of the signature modes.
         * example:
         * signatureOnly
         */
        mode?: 'signatureOnly' | 'signatureAndDescription' | 'descriptionOnly';
        /**
         * The content type of the watermark image when provided in the `image` parameter of the multipart request.
         * Supported types are `application/pdf`, `image/png`, and `image/jpeg`.
         * example:
         * image/png
         */
        contentType?: string;
        /**
         * Controls whether the signer name from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the name will not be shown in the signature appearance.
         */
        showSigner?: boolean;
        /**
         * Controls whether the signing reason from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the reason will not be shown in the signature appearance.
         */
        showReason?: boolean;
        /**
         * Controls whether the signing location from `signatureMetadata` is shown in the signature appearance.
         * When `false`, the location will not be shown in the signature appearance.
         */
        showLocation?: boolean;
        /**
         * Controls whether to include the watermark in the signature appearance.
         * When `true` and a watermark image is provided via the `watermark` parameter, it will be included.
         * When `true` and no watermark image is provided, the Nutrient logo will be used as the default watermark.
         */
        showWatermark?: boolean;
        /**
         * Controls whether to show the signing date and time in the signature appearance.
         * When `true`, the date and time will be shown in ISO 8601 format.
         * Example: 2023-06-15 13:57:31
         */
        showSignDate?: boolean;
        /**
         * Controls whether to include the timezone in the signing date.
         * Only applies when `showSignDate` is `true`.
         */
        showDateTimezone?: boolean;
      };
      /**
       * Position of the visible signature form field. Omit if you want an invisible signature or if you specified the `formFieldName` option.
       */
      position?: {
        /**
         * The index of the page where the signature appearance will be rendered.
         */
        pageIndex: number;
        /**
         * An array of 4 numbers (points) representing the bounding box where the signature appearance will be rendered on the specified `pageIndex`.
         *
         * [left, top, width, height]
         *
         * The unit is PDF points (1 PDF point equals 1⁄72 of an inch).
         * The first two numbers describe the [left,top] coordinates of the top left corner of the bounding box,
         * while the second two numbers describe the width and height of the bounding box.
         * example:
         * [
         *   0,
         *   0,
         *   100,
         *   100
         * ]
         */
        rect: [number, number, number, number];
      };
      /**
       * Optional metadata that describes the digital signature and becomes part of the signature itself.
       * This information will be shown by PDF readers to end users and can be included in the visual appearance of the signature
       * if you opted for a visible signature and enabled the necessary options in `appearance`.
       */
      signatureMetadata?: {
        /**
         * The name of the person or organization signing the document.
         * example:
         * John Appleseed
         */
        signerName?: string;
        /**
         * The reason for signing the document.
         * example:
         * Document Accepted
         */
        signatureReason?: string;
        /**
         * The geographical or digital location where the document is being signed.
         * example:
         * Vienna, Austria
         */
        signatureLocation?: string;
      };
      /**
       * The CAdES level to use when creating the signature. The default value is `CAdES B-LT`.
       * This parameter is ignored when the `signatureType` is `cms`.
       *
       * This is more like a hint of what level to use, and you should be aware that the API can return `b-b` even when you ask for `b-lt`. This can happen when the timestamp authority server is down, etc.
       *
       * If this API is invoked with the [Document Engine](https://www.nutrient.io/sdk/document-engine), you can override the default with the following environment variable: [`DIGITAL_SIGNATURE_CADES_LEVEL`](https://www.nutrient.io/guides/document-engine/configuration/options/).
       *
       * For Long-Term Validation (LTV) of the signature - when this API is invoked with the [Document Engine](https://www.nutrient.io/sdk/document-engine) - you need to ensure that the signing certificate chain links to a trusted anchor Certificate Authority (CA) at the time of signing.
       *
       * To add the root CA and necessary intermediate CAs to your Document Engine instance, follow the instructions in [our guide on Providing Trusted Root Certificates](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates).
       */
      cadesLevel?: 'b-lt' | 'b-t' | 'b-b';
      /**
       * Controls the signature container that will be requested from the signing service:
       *   * `pkcs7` - signing service is expected to return PKCS#7 container with signed data.
       *   * `raw` - signing service is expected to return RSA signed data directly. Expects PKCS#1 v1.5 signed data.
       *
       * The default value is `pkcs7`.
       * example:
       * pkcs7
       */
      signatureContainer?: 'pkcs7' | 'raw';
      /**
       * The hash algorithm to use when computing the digest of the document.
       *
       * The default value is `sha256`.
       * It is recommended to use `sha256` or better.
       * example:
       * sha256
       */
      hashAlgorithm?: 'md5' | 'sha160' | 'sha224' | 'sha256' | 'sha384' | 'sha512';
      /**
       * A set of base64-encoded X.509 certificates that will be used to sign the document.
       *
       * Required for `raw` signature container or `cades` signature type. If not provided, will be requested from the signing service.
       */
      certificates?: string[];
      /**
       * A string token that will be forwarded to the underlying signing service.
       * example:
       * user-1-with-rights
       */
      signingToken?: string;
      /**
       * Estimated size of the signature (in bytes). The estimated size is the size for the signature
       * that will be reserved in the PDF document before digitally signing it.
       *
       * A big estimated size will possibly make the signed
       * document bigger than necessary, but a too small one will cause the
       * signing process to fail. The value will be clamped to the nearest even value
       * between 0 and 256 KB (262144 bytes).
       *
       * By default, Document Engine will set a size of 32 KB (32768 bytes), which should be enough to support even complex certificates.
       *
       * > ℹ️ Note: The `estimatedSize` corresponds to the `/Contents` field of the signature field
       * — that is, the signature container. The size of the signature container mostly depends on the
       * complexity of the certificates used for digital signatures.
       * example:
       * 65536
       */
      estimatedSize?: number;
    }
    /**
     * DigitalSignatures
     */
    export interface DigitalSignatures {
      checkedAt?: string; // datetime
      documentModifiedSinceSignature?: boolean;
      status?: 'valid' | 'warning' | 'error';
      signatures?: /**
       * DigitalSignature
       * Represents a digital signature associated with a portion of the document.
       * A signature's status is expressed via two properties:
       *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
       *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
       */
      DigitalSignature[];
    }
    export type DigitalSignaturesRefresh = /* RefreshDigitalSignatures */ RefreshDigitalSignatures;
    export interface DocumentCreated {
      document_id: /**
       * The ID of the document.
       * example:
       * 7KPZW8XFGM4F1C92KWBK1B748M
       */
      DocumentId;
      errors: /* An array of errors encountered during the operation. */ Errors;
      password_protected: /**
       * Indicates whether the document is password protected.
       * example:
       * true
       */
      PasswordProtected;
      sourcePdfSha256: /**
       * SHA256 hash of the PDF file underlying the document.
       * example:
       * 1defd934dbbf77587eb9b7f45d162d2a3aea16c840a9e7cfa190fb2ea1f40a76
       */
      SourcePdfSha256;
      title: /**
       * The document title.
       * example:
       * Nutrient Document Engine API Specification
       */
      Title;
      createdAt: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
    }
    export type DocumentEngineAnnotation =
      /**
       * AnnotationRecord
       * Represents a PDF annotation.
       */
      AnnotationRecord;
    /**
     * The ID of the document.
     * example:
     * 7KPZW8XFGM4F1C92KWBK1B748M
     */
    export type DocumentId = string;
    /**
     * DocumentInfo
     */
    export interface DocumentInfo {
      /**
       * Are XFA forms present in the document?
       */
      hasXFA?: boolean;
      metadata?: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string;
        producer?: string;
        creator?: string;
        dateCreated?: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        IsoDateTime;
        dateModified?: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        IsoDateTime;
      };
      /**
       * The number of pages of the document.
       * example:
       * 3
       */
      pageCount: number;
      pages?: /* Page */ Page[];
      /**
       * The [document's permission](https://www.nutrient.io/guides/web/features/document-permissions/).
       */
      permissions?: {
        /**
         * Indicates whether annotations and form fields can be added or modified,
         * and if form fields can be filled in.
         * example:
         * true
         */
        annotationAndForms?: boolean;
        /**
         * Indicates whether document pages can be rotated, added or deleted.
         * Also determines if outline items and thumbnail images can be created.
         * example:
         * false
         */
        assemble?: boolean;
        /**
         * Indicates whether text and graphics in the document can be extracted (copied).
         * example:
         * true
         */
        extract?: boolean;
        /**
         * Indicates whether text and graphics in the document can be extracted in support of accessibility
         * to users with disabilities or for other purposes.
         * example:
         * true
         */
        extractAccessibility?: boolean;
        /**
         * Indicates whether form fields can be filled in.
         * example:
         * true
         */
        fillForms?: boolean;
        /**
         * Indicates whether the document can be modified in any other way than specified
         * by other permissions.
         * example:
         * false
         */
        modification?: boolean;
        /**
         * Indicates whether the document can be printed.
         * example:
         * true
         */
        print?: boolean;
        /**
         * Indicates whether the document can be printed in high quality.
         * example:
         * false
         */
        printHighQuality?: boolean;
      };
      title?: /**
       * The document title.
       * example:
       * Nutrient Document Engine API Specification
       */
      Title;
    }
    /**
     * Represents an operation which can be applied to a document.
     *
     * All operations have a `type` property. Depending on the type, the action object
     * includes additional properties.
     * example:
     * {
     *   "type": "rotatePages",
     *   "pageIndexes": [
     *     0
     *   ],
     *   "rotateBy": 90
     * }
     */
    export type DocumentOperation =
      /**
       * Represents an operation which can be applied to a document.
       *
       * All operations have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "rotatePages",
       *   "pageIndexes": [
       *     0
       *   ],
       *   "rotateBy": 90
       * }
       */
      | {
          type: 'addPage';
          afterPageIndex: DocumentOperationPageIndex;
          /**
           * A background color that will fill the page.
           * example:
           * #000000
           */
          backgroundColor: string; // ^#[0-9a-fA-F]{6}$
          /**
           * Page width in points.
           * example:
           * 595
           */
          pageWidth: number;
          /**
           * Page height in points.
           * example:
           * 842
           */
          pageHeight: number;
          rotateBy: /**
           * Clockwise rotation of the page.
           * example:
           * 0
           */
          PageRotation;
          /**
           * Insets of the page in a form [left, top, width, height].
           * example:
           * [
           *   10,
           *   10,
           *   10,
           *   10
           * ]
           */
          insets?: [number, number, number, number];
        }
      | {
          type: 'addPage';
          beforePageIndex: DocumentOperationPageIndex;
          /**
           * A background color that will fill the page.
           * example:
           * #000000
           */
          backgroundColor: string; // ^#[0-9a-fA-F]{6}$
          /**
           * Page width in points.
           * example:
           * 595
           */
          pageWidth: number;
          /**
           * Page height in points.
           * example:
           * 842
           */
          pageHeight: number;
          rotateBy: /**
           * Clockwise rotation of the page.
           * example:
           * 0
           */
          PageRotation;
          /**
           * Insets of the page in a form [left, top, width, height].
           * example:
           * [
           *   10,
           *   10,
           *   10,
           *   10
           * ]
           */
          insets?: [number, number, number, number];
        }
      | {
          type: 'duplicatePages';
          pageIndexes: DocumentOperationPageIndexes;
        }
      | {
          type: 'duplicatePages';
          pageIndexes: DocumentOperationPageIndexes;
          afterPageIndex: DocumentOperationPageIndex;
        }
      | {
          type: 'duplicatePages';
          pageIndexes: DocumentOperationPageIndexes;
          beforePageIndex: DocumentOperationPageIndex;
        }
      | {
          type: 'rotatePages';
          pageIndexes: DocumentOperationPageIndexes;
          rotateBy: /**
           * Clockwise rotation of the page.
           * example:
           * 0
           */
          PageRotation;
        }
      | {
          type: 'keepPages';
          pageIndexes: DocumentOperationPageIndexes;
        }
      | {
          type: 'removePages';
          pageIndexes: DocumentOperationPageIndexes;
        }
      | {
          type: 'setPageLabel';
          pageIndexes: DocumentOperationPageIndexes;
          /**
           * Page label to set.
           */
          pageLabel: string;
        }
      | {
          type: 'applyXfdf';
          /**
           * Name of the part in `multipart/form-data` request with XFDF data.
           */
          dataFilePath: string;
        }
      | {
          type: 'applyInstantJson';
          /**
           * Name of the part in `multipart/form-data` request with Instant JSON data.
           */
          dataFilePath: string;
        }
      | {
          type: 'performOcr';
          pageIndexes: DocumentOperationPageIndexes;
          language?: /**
           * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
           * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
           * example:
           * english
           */
          OcrLanguage;
        }
      | {
          type: 'flattenAnnotations';
          pageIndexes?: DocumentOperationPageIndexes;
          /**
           * Annotation IDs to flatten. If not specified, all annotations will be flattened.
           */
          annotationIds?: number[];
        }
      | {
          type: 'updateMetadata';
          metadata?: {
            title?: string;
            author?: string;
          };
        }
      | {
          type: 'applyRedactions';
        };
    export type DocumentOperationPageIndex = number | 'first' | 'last';
    export type DocumentOperationPageIndexes = DocumentOperationPageIndex[] | 'all';
    /**
     * An array of operations which can be applied to the document.
     */
    export type DocumentOperations =
      /**
       * Represents an operation which can be applied to a document.
       *
       * All operations have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "rotatePages",
       *   "pageIndexes": [
       *     0
       *   ],
       *   "rotateBy": 90
       * }
       */
      DocumentOperation[];
    /**
     * PageIndex
     * 0-based index of the page.
     * example:
     * 0
     */
    export type DocumentPageIndex = number;
    /**
     * This allows to reference a document stored on Document Engine.
     * It is also possible to refer to currently scoped file by using special ID:
     *   ```
     *   {"document": {"id": "#self"}}
     *   ```
     */
    export interface DocumentPart {
      document: {
        id: /**
         * Document ID
         * The ID of the document.
         * example:
         * 7KPZW8XFGM4F1C92KWBK1B748M
         */
        SchemasDocumentId | '#self';
        /**
         * The name of the layer to be used.
         * example:
         * my-existing-layer
         */
        layer?: string;
      };
      /**
       * The password for the input file
       */
      password?: string;
      pages?: /**
       * Defines the range of pages in a document. The indexing starts from 0. It is possible
       * to use negative numbers to refer to pages from the last page. For example, `-1` refers to the last page.
       */
      PageRange;
      actions?: BuildAction[];
    }
    /**
     * DocumentProperties
     */
    export interface DocumentProperties {
      id: string;
      passwordProtected: /**
       * Indicates whether the document is password protected.
       * example:
       * true
       */
      PasswordProtected;
      sourcePdfSha256: /**
       * SHA256 hash of the PDF file underlying the document.
       * example:
       * 1defd934dbbf77587eb9b7f45d162d2a3aea16c840a9e7cfa190fb2ea1f40a76
       */
      SourcePdfSha256;
      title: /**
       * The document title.
       * example:
       * Nutrient Document Engine API Specification
       */
      Title;
      byteSize: /**
       * The size of the document in bytes.
       * example:
       * 192000
       */
      ByteSize;
      createdAt: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      /**
       * Information about the assert storage for the underlying PDF file.
       */
      storage?: {
        /**
         * * When the type is `built-in`, it uses the built-in database-backed storage.
         * * When the type is `s3`, it uses the S3 asset storage. The response also includes the S3 bucket used.
         * * When the type is `remote`, it indicates a remote PDF file. The response includes the URL of the file.
         */
        type: 'built-in' | 'remote' | 's3';
        /**
         * Name of the S3 bucket storing the PDF file. Set only if storage type is `s3`.
         */
        bucket?: string;
        /**
         * URL pointing at the PDF file. Set only if storage type is `remote`.
         */
        url?: string;
      };
    }
    /**
     * Download PDF
     */
    export interface DownloadPDF {
      /**
       * The type of output file. Can be pdfa or pdf.
       * example:
       * pdfa
       */
      type: 'pdf' | 'pdfa';
      /**
       * If set to `true`, the originally uploaded version of the PDF file will be fetched.
       * The remaining properties are mutually exclusive with this property.
       */
      source?: boolean;
      /**
       * Determines whether a flattened version of the PDF file will be downloaded. If set to `true`,
       * the resulting PDF file will have its annotations burned into the document and will have no annotations.
       */
      flatten?: boolean;
      /**
       * If set to `true`, the resulting PDF file will have its custom AP streams rendered into the document.
       */
      render_ap_streams?: boolean;
      /**
       * If set to `true`, annotations will be included in the downloaded file
       */
      annotations?: boolean;
      /**
       * If set to `true`, comments will be included in the downloaded file.
       */
      comments?: boolean;
      /**
       * If set to `false`, signatures and form fields will get flattened in the resulting PDF.
       * Defaults to `true`.
       */
      keep_signatures?: boolean;
      /**
       * The level of conformance of the pdfa file. Defaults to `pdfa-1b` if the type is set to `pdfa` and conformance is not explicitly specified.
       * example:
       * pdfa-1a
       */
      conformance?:
        | 'pdfa-1a'
        | 'pdfa-1b'
        | 'pdfa-2a'
        | 'pdfa-2u'
        | 'pdfa-2b'
        | 'pdfa-3a'
        | 'pdfa-3u';
      optimize?: OptimizePdf;
    }
    /**
     * EllipseAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface EllipseAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/ellipse';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * EllipseAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface EllipseAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/ellipse';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * EmbeddedFile
     */
    export interface EmbeddedFile {
      content?: {
        /**
         * example:
         * 1
         */
        v: number;
        type: 'pspdfkit/embedded-file';
        fileAttachmentId: string;
        contentType?: string;
        description?: string;
        fileName?: string;
        /**
         * example:
         * 22348
         */
        fileSize?: number;
        updatedAt?: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        IsoDateTime;
      };
      createdBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      id: string;
    }
    /**
     * A single error with a reason.
     */
    export interface Error {
      reason: string;
    }
    export interface ErrorResponse {
      /**
       * example:
       * The request is malformed
       */
      details?: string;
      status?: 400 | 500;
      /**
       * example:
       * xy123zzdafaf
       */
      requestId?: string;
      /**
       * List of failing paths.
       */
      failingPaths?: {
        /**
         * example:
         * $.property[0]
         */
        path?: string;
        /**
         * example:
         * Missing required property
         */
        details?: string;
      }[];
    }
    /**
     * An array of errors encountered during the operation.
     */
    export type Errors = /* A single error with a reason. */ Error[];
    export type Features = (
      | 'annotations'
      | 'annotations_api'
      | 'cad_conversion'
      | 'cad_conversion_api'
      | 'comments'
      | 'comments_api'
      | 'compression'
      | 'compression_api'
      | 'content_editing'
      | 'data_extraction'
      | 'data_extraction_api'
      | 'document_assistant'
      | 'digital_signatures'
      | 'digital_signatures_api'
      | 'disable_analytics'
      | 'document_editor'
      | 'document_editor_api'
      | 'electronic_signatures'
      | 'electronic_signatures_api'
      | 'forms'
      | 'forms_api'
      | 'forms_creator'
      | 'forms_creator_api'
      | 'html_conversion'
      | 'html_conversion_api'
      | 'image_conversion'
      | 'image_conversion_api'
      | 'image_rendering'
      | 'image_rendering_api'
      | 'email_conversion'
      | 'email_conversion_api'
      | 'instant'
      | 'legacy_signatures'
      | 'legacy_electron'
      | 'linearization'
      | 'linearization_api'
      | 'measurement_tools'
      | 'measurement_tools_api'
      | 'ocr'
      | 'ocr_api'
      | 'office_conversion'
      | 'office_conversion_api'
      | 'office_templating'
      | 'office_templating_api'
      | 'pdfa'
      | 'pdfa_api'
      | 'pdf_to_office_conversion'
      | 'pdf_to_office_conversion_api'
      | 'redaction'
      | 'redaction_api'
      | 'user_interface'
      | 'viewer'
    )[];
    export type FileHandle =
      | {
          /**
           * Specifies the URL from a file can be downloaded
           * example:
           * https://remote-file-storage/input-file
           */
          url: string;
          /**
           * Optional parameter to verify a downloaded file using provided SHA256 hash.
           * It is expected to be base16 encoded using lowercase.
           */
          sha256?: string;
        }
      | string;
    /**
     * example:
     * {
     *   "file": "pdf-file-from-multipart"
     * }
     */
    export interface FilePart {
      file: FileHandle;
      /**
       * The password for the input file
       */
      password?: string;
      pages?: /**
       * Defines the range of pages in a document. The indexing starts from 0. It is possible
       * to use negative numbers to refer to pages from the last page. For example, `-1` refers to the last page.
       */
      PageRange;
      /**
       * Defines the layout of the generated pages.
       */
      layout?: {
        /**
         * The orientation of generated pages.
         */
        orientation?: 'portrait' | 'landscape';
        size?:
          | ('A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'Letter' | 'Legal')
          | {
              /**
               * The width of pages in mm.
               * example:
               * 210
               */
              width?: number;
              /**
               * The height of pages in mm.
               * example:
               * 297
               */
              height?: number;
            };
        /**
         * The margins of generated pages. All dimensions are in mm.
         */
        margin?: {
          left?: number;
          top?: number;
          right?: number;
          bottom?: number;
        };
      };
      /**
       * The content type of the file. Used to determine the file type when the file content type is not available and can't be inferred.
       * example:
       * application/pdf
       */
      content_type?: string;
      actions?: BuildAction[];
    }
    /**
     * FillColor
     * example:
     * #FF0000
     */
    export type FillColor = string; // ^#[0-9a-fA-F]{6}$
    export interface FlattenAction {
      /**
       * Flatten the annotations in the document.
       */
      type: 'flatten';
      /**
       * Annotation IDs to flatten. These can be annotation IDs or `pdfObjectId`s.
       * If not specified, all annotations will be flattened.
       */
      annotationIds?: (string | number)[];
    }
    /**
     * Font
     * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
     * example:
     * Helvetica
     */
    export type Font = string;
    /**
     * FontColor
     * A foreground color of the text.
     * example:
     * #ffffff
     */
    export type FontColor = string; // ^#[0-9a-fA-F]{6}$
    /**
     * FontFile
     * A font used in the document.
     */
    export interface FontFile {
      /**
       * A friendly name for this font face
       * example:
       * Al Bayan Bold
       */
      fullName?: string;
      /**
       * The index inside the font file where the font face is
       * example:
       * 2
       */
      idx?: number;
      /**
       * The name of the font file that contains this font face
       * This is the name of the file on Document Engine.
       * example:
       * AlBayan.ttc"
       */
      fileName?: string;
    }
    /**
     * FontSizeAuto
     * Size of the text that automatically adjusts to fit the bounding box.
     * example:
     * auto
     */
    export type FontSizeAuto = 'auto';
    /**
     * FontSizeInt
     * Size of the text in PDF points.
     * example:
     * 10
     */
    export type FontSizeInt = number;
    /**
     * Text style. Can be only italic, only bold, italic and bold, or none of these.
     */
    export type FontStyle = ('bold' | 'italic')[];
    /**
     * FontSubstitution
     * Whenever Document Engine does not have the specified font (pattern),
     * it will use the substitute font specified, if the substitute is available
     */
    export interface FontSubstitution {
      /**
       * Font family name replacements are made based upon pattern matching,
       * allowing for a font family name to be replaced with a different name.
       *
       * Patterns are matched using the following rules:
       * * `*` matches multiple characters
       * * `?` matches a single character
       * * Pattern and the target name are case-insensitive.
       * example:
       * Roboto-*
       */
      pattern: string;
      /**
       * example:
       * Courier New
       */
      target: string;
    }
    /**
     * FontSubstitutionList
     * A list of font substitutions.
     *
     * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
     */
    export type FontSubstitutionList =
      /**
       * FontSubstitution
       * Whenever Document Engine does not have the specified font (pattern),
       * it will use the substitute font specified, if the substitute is available
       */
      FontSubstitution[];
    /**
     * Form field JSON
     * JSON representation of a form field
     */
    export type FormField =
      /**
       * Form field JSON
       * JSON representation of a form field
       */
      /**
       * ButtonFormField
       * A simple push button that responds immediately to user input without retaining any state.
       */
      | ButtonFormField /**
       * ListBoxFormField
       * A list box where multiple values can be selected.
       */
      | ListBoxFormField /**
       * ComboBoxFormField
       * A combo box is a drop-down box with the option add custom entries (see `edit`).
       */
      | ComboBoxFormField /**
       * CheckBoxFormField
       * A check box that can either be checked or unchecked. One check box form field can also be associated to multiple single check box widgets
       */
      | CheckboxFormField /**
       * RadioButtonFormField
       * A group of radio buttons. Similar to `CheckBoxFormField`, but there can only be one value set at the same time.
       */
      | RadioButtonFormField /**
       * TextFormField
       * A text input element, that can either span a single or multiple lines.
       */
      | TextFormField /**
       * SignatureFormField
       * A field that contains a digital signature.
       */
      | SignatureFormField;
    /**
     * Additional actions that can be performed on the form field.
     */
    export interface FormFieldAdditionalActionsEvent {
      /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      onChange?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      /* GoToAction */ | GoToAction
        | /* GoToRemoteAction */ GoToRemoteAction
        | /* GoToEmbeddedAction */ GoToEmbeddedAction
        | /* LaunchAction */ LaunchAction
        | /* URIAction */ URIAction
        | /* HideAction */ HideAction
        | /* JavaScriptAction */ JavaScriptAction
        | /* SubmitFormAction */ SubmitFormAction
        | /* ResetFormAction */ ResetFormAction
        | /* NamedAction */ NamedAction;
      /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      onCalculate?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      /* GoToAction */ | GoToAction
        | /* GoToRemoteAction */ GoToRemoteAction
        | /* GoToEmbeddedAction */ GoToEmbeddedAction
        | /* LaunchAction */ LaunchAction
        | /* URIAction */ URIAction
        | /* HideAction */ HideAction
        | /* JavaScriptAction */ JavaScriptAction
        | /* SubmitFormAction */ SubmitFormAction
        | /* ResetFormAction */ ResetFormAction
        | /* NamedAction */ NamedAction;
    }
    /**
     * Additional actions that can be performed on the form field.
     */
    export interface FormFieldAdditionalActionsInput {
      /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      onInput?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      /* GoToAction */ | GoToAction
        | /* GoToRemoteAction */ GoToRemoteAction
        | /* GoToEmbeddedAction */ GoToEmbeddedAction
        | /* LaunchAction */ LaunchAction
        | /* URIAction */ URIAction
        | /* HideAction */ HideAction
        | /* JavaScriptAction */ JavaScriptAction
        | /* SubmitFormAction */ SubmitFormAction
        | /* ResetFormAction */ ResetFormAction
        | /* NamedAction */ NamedAction;
      /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      onFormat?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      /* GoToAction */ | GoToAction
        | /* GoToRemoteAction */ GoToRemoteAction
        | /* GoToEmbeddedAction */ GoToEmbeddedAction
        | /* LaunchAction */ LaunchAction
        | /* URIAction */ URIAction
        | /* HideAction */ HideAction
        | /* JavaScriptAction */ JavaScriptAction
        | /* SubmitFormAction */ SubmitFormAction
        | /* ResetFormAction */ ResetFormAction
        | /* NamedAction */ NamedAction;
    }
    /**
     * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
     * with the form field you are creating.
     * Note that the form field's group will be inherited by any widgets and values associated with it
     */
    export interface FormFieldCreate {
      id?: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      content: /**
       * Form field JSON
       * JSON representation of a form field
       */
      FormField;
    }
    /**
     * Default value of the form field.
     */
    export type FormFieldDefaultValue = string;
    /**
     * Default values corresponding to each option.
     */
    export type FormFieldDefaultValues = string[];
    /**
     * A form option identifies a possible option for the form field.
     */
    export interface FormFieldOption {
      /**
       * The label of the option.
       * example:
       * One
       */
      label: string;
      /**
       * The export value of the option.
       * example:
       * Two
       */
      value: string;
    }
    /**
     * The list of form field options.
     *
     * The index of the widget annotation ID in the `annotationIds`
     * property corresponds to an index in the  form field option array.
     * example:
     * [
     *   {
     *     "label": "MALE",
     *     "value": "MALE"
     *   },
     *   {
     *     "label": "FEMALE",
     *     "value": "FEMALE"
     *   }
     * ]
     */
    export type FormFieldOptions =
      /* A form option identifies a possible option for the form field. */ FormFieldOption[];
    export interface FormFieldRecord {
      id?: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      createdBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      createdAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      updatedAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      content?: /**
       * Form field JSON
       * JSON representation of a form field
       */
      FormField;
    }
    /**
     * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
     * with the form field you are updating while dropping previously associated widgets.
     * Note that the form field's group will be inherited by any widgets and values associated with it
     */
    export interface FormFieldUpdate {
      id: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      content: /**
       * Form field JSON
       * JSON representation of a form field
       */
      FormField;
    }
    /**
     * FormFieldValue
     * A record representing a form field value.
     *
     * ## Choice Fields
     *
     * When creating form fields with multiple widgets like `CheckBoxFormField` or `RadioButtonFormField`, you need to ensure two things:
     * - The number of annotations in the `annotationIds` field must be equal to the number of elements in the `options` field.
     * - For each option in `options` you need to specify the `annotationId` that is mapped to this specific option on the PDF.
     *
     * The list of `options` in a `CheckBoxFormField` or `RadioButtonFormField` are the names of the `ON` state appearance
     * of each widget annotation that is a child of the form field. The `options` array and the `annotationWidgetIds`
     * array keep the same order, that is, the `ON` state appearance name for `annotationIds[0]` is in `options[0]`.
     * The value of the `OFF` state is customizable but always has the same name, "Off", so it's not included in the model.
     *
     * In order to check a checkbox or radio button, if the `options` list contains, for example, `["Checked"]`,
     * then you need to and pass the same list. The system will internally notice that you are setting the form
     * value of a checkbox or radio button and automatically interpret "Checked" not as text, but as the PDF name
     * that represents an appearance stream named "Checked", representing the ON state.
     *
     * The same applies to the OFF state, which by design always has the name "Off", as explained previously.
     */
    export interface FormFieldValue {
      /**
       * Unique name of the form field. This property is used to link form field value to a `FormField`.
       */
      name: string;
      value?: (string | null) | string[];
      type: 'pspdfkit/form-field-value';
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * Radio buttons and checkboxes can have multiple widgets with the same form value associated,
       * but can be selected independently. `optionIndexes`` contains the value indexes that should be actually set.
       *
       * If set, the value field doesn't get used, and the widget found at the corresponding indexes in
       * the form field's annotationIds property are checked.
       *
       * If set on fields other than `RadioButtonFormField` or `CheckBoxFormField`, setting the form value will fail.
       */
      optionIndexes?: number[];
      /**
       * Specifies if the given text should fit into the visible portion of the text form field.
       */
      isFitting?: boolean;
    }
    /**
     * FormFieldValue
     * A record representing a form field value.
     *
     * ## Choice Fields
     *
     * When creating form fields with multiple widgets like `CheckBoxFormField` or `RadioButtonFormField`, you need to ensure two things:
     * - The number of annotations in the `annotationIds` field must be equal to the number of elements in the `options` field.
     * - For each option in `options` you need to specify the `annotationId` that is mapped to this specific option on the PDF.
     *
     * The list of `options` in a `CheckBoxFormField` or `RadioButtonFormField` are the names of the `ON` state appearance
     * of each widget annotation that is a child of the form field. The `options` array and the `annotationWidgetIds`
     * array keep the same order, that is, the `ON` state appearance name for `annotationIds[0]` is in `options[0]`.
     * The value of the `OFF` state is customizable but always has the same name, "Off", so it's not included in the model.
     *
     * In order to check a checkbox or radio button, if the `options` list contains, for example, `["Checked"]`,
     * then you need to and pass the same list. The system will internally notice that you are setting the form
     * value of a checkbox or radio button and automatically interpret "Checked" not as text, but as the PDF name
     * that represents an appearance stream named "Checked", representing the ON state.
     *
     * The same applies to the OFF state, which by design always has the name "Off", as explained previously.
     */
    export interface FormFieldValueRecord {
      /**
       * Unique name of the form field. This property is used to link form field value to a `FormField`.
       */
      name: string;
      value?: (string | null) | string[];
      type: 'pspdfkit/form-field-value';
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * Radio buttons and checkboxes can have multiple widgets with the same form value associated,
       * but can be selected independently. `optionIndexes`` contains the value indexes that should be actually set.
       *
       * If set, the value field doesn't get used, and the widget found at the corresponding indexes in
       * the form field's annotationIds property are checked.
       *
       * If set on fields other than `RadioButtonFormField` or `CheckBoxFormField`, setting the form value will fail.
       */
      optionIndexes?: number[];
      /**
       * Specifies if the given text should fit into the visible portion of the text form field.
       */
      isFitting?: boolean;
      createdBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      /**
       * The form field value group. Group allows to grant access to resources via Collaboration Permissions.
       *
       * The group of the form field value is always the group of the associated form field.
       */
      group?: string | null;
    }
    export interface FormFieldValueUpdate {
      formFieldValues?: {
        name: string;
        value: string;
      }[];
    }
    export type FormFieldValuesRecords =
      /**
       * FormFieldValue
       * A record representing a form field value.
       *
       * ## Choice Fields
       *
       * When creating form fields with multiple widgets like `CheckBoxFormField` or `RadioButtonFormField`, you need to ensure two things:
       * - The number of annotations in the `annotationIds` field must be equal to the number of elements in the `options` field.
       * - For each option in `options` you need to specify the `annotationId` that is mapped to this specific option on the PDF.
       *
       * The list of `options` in a `CheckBoxFormField` or `RadioButtonFormField` are the names of the `ON` state appearance
       * of each widget annotation that is a child of the form field. The `options` array and the `annotationWidgetIds`
       * array keep the same order, that is, the `ON` state appearance name for `annotationIds[0]` is in `options[0]`.
       * The value of the `OFF` state is customizable but always has the same name, "Off", so it's not included in the model.
       *
       * In order to check a checkbox or radio button, if the `options` list contains, for example, `["Checked"]`,
       * then you need to and pass the same list. The system will internally notice that you are setting the form
       * value of a checkbox or radio button and automatically interpret "Checked" not as text, but as the PDF name
       * that represents an appearance stream named "Checked", representing the ON state.
       *
       * The same applies to the OFF state, which by design always has the name "Off", as explained previously.
       */
      FormFieldValueRecord[];
    /**
     * A single form field widget in a document layer
     */
    export interface FormFieldWidget {
      /**
       * An identifier for a form field widget. It is unique across a layer
       */
      id: string;
      group: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      createdBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      content: /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      WidgetAnnotation;
    }
    export type FormFieldWidgetContent =
      /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      WidgetAnnotation;
    /**
     * A single widget in a document layer
     */
    export interface FormFieldWidgetCreate {
      /**
       * An identifier for a widget. It is unique across a layer
       */
      id?: /**
       * A unique identifier for the form field widget. It is unique in a layer
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
       */
      FormFieldWidgetId;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      content: /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      WidgetAnnotation;
    }
    /**
     * A unique identifier for the form field widget. It is unique in a layer
     * example:
     * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
     */
    export type FormFieldWidgetId = string;
    /**
     * Note that you cannot set the group for a widget.
     * The widget will inherit the group of the form field it is associated with.
     */
    export interface FormFieldWidgetUpdate {
      content: /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      WidgetAnnotation;
      user_id?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      /**
       * This is an identifier for this widget. It is unique across the layer. It is required for update operations.
       */
      id: /**
       * A unique identifier for the form field widget. It is unique in a layer
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
       */
      FormFieldWidgetId;
    }
    /**
     * A single form field widget in a document layer and the form field it's associated with
     */
    export interface FormFieldWidgetWithFormField {
      /**
       * An identifier for a form field widget. It is unique across a layer
       */
      id: string;
      group: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      createdBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      content: /**
       * WidgetAnnotation
       * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
       */
      WidgetAnnotation;
      formField?: FormFieldRecord;
    }
    export interface FormFieldWithWidgets {
      id?: /**
       * RecordId
       * An unique Instant JSON identifier of the record. Must be unique in a layer.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      RecordId;
      group?: /**
       * Group
       * The resource group.
       *
       * Group allows to grant access to resources via Collaboration Permissions.
       */
      Group;
      createdBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      updatedBy?: /**
       * User
       * The user identifier.
       *
       * Note that Nutrient Document Engine does not provide any kind of user management and accepts
       * any string (or `null`) as a valid user ID.
       *
       * For records created or updated in the browser, the `user_id `is extracted from the
       * JSON Web Token (JWT) used for authentication.
       */
      User;
      createdAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      updatedAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      content?: /**
       * Form field JSON
       * JSON representation of a form field
       */
      FormField;
      /**
       * The widgets associated with this form field.
       */
      widgetAnnotations?: /* A single form field widget in a document layer */ FormFieldWidget[];
    }
    /**
     * GoToAction
     */
    export interface GoToAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'goTo';
      /**
       * Page index to navigate to. 0 is the first page.
       */
      pageIndex: number;
    }
    /**
     * GoToEmbeddedAction
     */
    export interface GoToEmbeddedAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'goToEmbedded';
      /**
       * The relative path to the embedded file.
       * example:
       * /other_document.pdf
       */
      relativePath: string;
      /**
       * Whether to open the file in a new window.
       */
      newWindow?: boolean;
      targetType?: 'parent' | 'child';
    }
    /**
     * GoToRemoteAction
     */
    export interface GoToRemoteAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'goToRemote';
      /**
       * The relative path of the file to open.
       * example:
       * /other_document.pdf
       */
      relativePath: string;
      namedDestination?: string;
    }
    /**
     * Group
     * The resource group.
     *
     * Group allows to grant access to resources via Collaboration Permissions.
     */
    export type Group = string | null;
    export interface HTMLPart {
      html: FileHandle;
      /**
       * List of asset names imported in the HTML. References the name passed in the multipart request.
       */
      assets?: string[];
      layout?: /* Defines the layout of the generated pages. */ PageLayout;
      actions?: BuildAction[];
    }
    /**
     * HideAction
     */
    export interface HideAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'hide';
      hide: boolean;
      annotationReferences: /* AnnotationReference */ AnnotationReference[];
    }
    /**
     * A piece highlighted text along with corresponding markup annotation.
     */
    export interface HighlightedText {
      annotation: /**
       * AnnotationRecord
       * Represents a PDF annotation.
       */
      AnnotationRecord;
      /**
       * The highlighted text.
       * example:
       * a very important piece of content
       */
      text: string;
    }
    /**
     * HorizontalAlign
     * Alignment of the text along the horizontal axis.
     */
    export type HorizontalAlign = 'left' | 'center' | 'right';
    /**
     * ImageAnnotation
     * Image annotations are used to annotate a PDF with images.
     */
    export interface ImageAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/image';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A description of the image.
       * example:
       * PSPDFKit Logo
       */
      description?: string;
      /**
       * An optional file name for the image.
       */
      fileName?: string;
      /**
       * MIME type of the image.
       */
      contentType?: 'image/jpeg' | 'image/png' | 'application/pdf';
      /**
       * Either the SHA256 Hash of the attachment or the pdfObjectId of the attachment.
       */
      imageAttachmentId?: string;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      /**
       * True if the annotation should be considered a (soft) signature.
       */
      isSignature?: boolean;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * ImageAnnotation
     * Image annotations are used to annotate a PDF with images.
     */
    export interface ImageAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/image';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A description of the image.
       * example:
       * PSPDFKit Logo
       */
      description?: string;
      /**
       * An optional file name for the image.
       */
      fileName?: string;
      /**
       * MIME type of the image.
       */
      contentType?: 'image/jpeg' | 'image/png' | 'application/pdf';
      /**
       * Either the SHA256 Hash of the attachment or the pdfObjectId of the attachment.
       */
      imageAttachmentId?: string;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      /**
       * True if the annotation should be considered a (soft) signature.
       */
      isSignature?: boolean;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * ImageOutput
     * Render the document as an image.
     */
    export interface ImageOutput {
      type: 'image';
      /**
       * The format of the rendered image.
       */
      format?: 'png' | 'jpeg' | 'jpg' | 'webp';
      pages?: /**
       * Defines the range of pages in a document. The indexing starts from 0. It is possible
       * to use negative numbers to refer to pages from the last page. For example, `-1` refers to the last page.
       */
      PageRange;
      /**
       * The width of the rendered image in pixels. You must specify at least one of either width, height or dpi
       */
      width?: number;
      /**
       * The height of the rendered image in pixels. You must specify at least one of either width, height or dpi
       */
      height?: number;
      /**
       * The resolution of the rendered image in dots per inch. You must specify at least one of either width, height or dpi
       */
      dpi?: number;
    }
    /**
     * Image
     */
    export interface ImageWatermarkAction {
      /**
       * Watermark all pages with text watermark.
       */
      type: 'watermark';
      /**
       * Width of the watermark in PDF points.
       */
      width: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Height of the watermark in PDF points.
       */
      height: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the top edge of a page.
       */
      top?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the right edge of a page.
       */
      right?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the bottom edge of a page.
       */
      bottom?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the left edge of a page.
       */
      left?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Rotation of the watermark in counterclockwise degrees.
       */
      rotation?: number;
      /**
       * Watermark opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      image: FileHandle;
    }
    /**
     * InkAnnotation
     * Ink annotations are used for freehand drawings on a page. They can contain multiple line segments. Points within a segment are connected to a line.
     */
    export interface InkAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/ink';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      lines: /* Lines */ Lines;
      /**
       * The width of the line in PDF points (pt).
       */
      lineWidth: number;
      /**
       * Nutrient's natural drawing mode. This value is only used by Nutrient iOS SDK.
       */
      isDrawnNaturally?: boolean;
      /**
       * True if the annotation should be considered a (soft) ink signature.
       */
      isSignature?: boolean;
      /**
       * The color of the line.
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      backgroundColor?: /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      BackgroundColor /* ^#[0-9a-fA-F]{6}$ */;
      blendMode?: /* BlendMode */ BlendMode;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * InkAnnotation
     * Ink annotations are used for freehand drawings on a page. They can contain multiple line segments. Points within a segment are connected to a line.
     */
    export interface InkAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/ink';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      lines: /* Lines */ Lines;
      /**
       * The width of the line in PDF points (pt).
       */
      lineWidth: number;
      /**
       * Nutrient's natural drawing mode. This value is only used by Nutrient iOS SDK.
       */
      isDrawnNaturally?: boolean;
      /**
       * True if the annotation should be considered a (soft) ink signature.
       */
      isSignature?: boolean;
      /**
       * The color of the line.
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      backgroundColor?: /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      BackgroundColor /* ^#[0-9a-fA-F]{6}$ */;
      blendMode?: /* BlendMode */ BlendMode;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * Comment JSON v1
     */
    export interface InstantCommentV1 {
      type: 'pspdfkit/comment';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      /**
       * The ID of the root annotation of the comment thread.
       * example:
       * 01HBDGR9D5JTFERPSCEMNH5GPG
       */
      rootId: string;
      /**
       * The text of the comment
       * example:
       * A comment is made of words
       */
      text: string;
      /**
       * The instant JSON specification version that the record is compliant to.
       */
      v: 1;
      createdAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      /**
       * The name of the user who created the comment.
       * example:
       * John Doe
       */
      creatorName?: string;
      customData?: /**
       * CustomData
       * Object of arbitrary properties attached to an entity
       */
      CustomData;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      updatedAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
    }
    /**
     * Comment JSON v2
     */
    export interface InstantCommentV2 {
      type: 'pspdfkit/comment';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      /**
       * The ID of the root annotation of the comment thread.
       * example:
       * 01HBDGR9D5JTFERPSCEMNH5GPG
       */
      rootId: string;
      text: /* The text contents. */ AnnotationText;
      /**
       * The instant JSON specification version that the record is compliant to.
       */
      v: 2;
      createdAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
      /**
       * The name of the user who created the comment.
       * example:
       * John Doe
       */
      creatorName?: string;
      customData?: /**
       * CustomData
       * Object of arbitrary properties attached to an entity
       */
      CustomData;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      updatedAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      IsoDateTime;
    }
    /**
     * Instant JSON
     * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
     */
    export interface InstantJson {
      format: 'https://pspdfkit.com/instant-json/v1';
      annotations?: /**
       * Annotation JSON v2
       * JSON representation of an annotation.
       */
      (
        | Annotation /**
         * Annotation JSON v1
         * JSON representation of an annotation.
         */
        | AnnotationV1
      )[];
      attachments?: /**
       * Attachments
       * Attachments are defined as an associative array.
       * * Keys are SHA-256 hashes of the attachment contents or the `pdfObjectId`
       * of the attachment (in case it's part of the source PDF).
       * * Values are the actual `Attachment` objects with Base-64 encoded binary
       * contents of the attachment and its content type.
       * example:
       * {
       *   "388dd55f16b0b7ccdf7abdc7a0daea7872ef521de56ee820b4440e52c87d081b": {
       *     "binary": "YXR0YWNobWVudCBjb250ZW50cwo=",
       *     "contentType": "image/png"
       *   },
       *   "ccbb4499fa6d9f003545fa43ec19511fdb7227ca505bba9f74d787dff57af77b": {
       *     "binary": "YW5vdGhlciBhdHRhY2htZW50IGNvbnRlbnRzCg==",
       *     "contentType": "plain/text"
       *   }
       * }
       */
      Attachments;
      formFields?: /**
       * Form field JSON
       * JSON representation of a form field
       */
      FormField[];
      formFieldValues?: /**
       * FormFieldValue
       * A record representing a form field value.
       *
       * ## Choice Fields
       *
       * When creating form fields with multiple widgets like `CheckBoxFormField` or `RadioButtonFormField`, you need to ensure two things:
       * - The number of annotations in the `annotationIds` field must be equal to the number of elements in the `options` field.
       * - For each option in `options` you need to specify the `annotationId` that is mapped to this specific option on the PDF.
       *
       * The list of `options` in a `CheckBoxFormField` or `RadioButtonFormField` are the names of the `ON` state appearance
       * of each widget annotation that is a child of the form field. The `options` array and the `annotationWidgetIds`
       * array keep the same order, that is, the `ON` state appearance name for `annotationIds[0]` is in `options[0]`.
       * The value of the `OFF` state is customizable but always has the same name, "Off", so it's not included in the model.
       *
       * In order to check a checkbox or radio button, if the `options` list contains, for example, `["Checked"]`,
       * then you need to and pass the same list. The system will internally notice that you are setting the form
       * value of a checkbox or radio button and automatically interpret "Checked" not as text, but as the PDF name
       * that represents an appearance stream named "Checked", representing the ON state.
       *
       * The same applies to the OFF state, which by design always has the name "Off", as explained previously.
       */
      FormFieldValue[];
      bookmarks?: /**
       * Bookmark
       * A record representing a bookmark.
       */
      Bookmark[];
      comments?: /**
       * Comments JSON
       * JSON representation of a comment.
       */
      CommentContent[];
      /**
       * An array of PDF object IDs that should be skipped during the import process. Whenever an object ID is marked as skipped, it'll no longer be loaded from the original PDF. Instead, it could be defined inside the annotations array with the same pdfObjectId. If this is the case, the PDF viewer will display the new annotation, which signals an update to the original one. If an object ID is marked as skipped but the annotations array doesn't contain an annotation with the same pdfObjectId, it'll be interpreted as a deleted annotation. An annotation inside the annotations array without the pdfObjectId property is interpreted as a newly created annotation.
       */
      skippedPdfObjectIds?: number[];
      /**
       * PDF document identifiers, base64 encoded. This is used to track version of PDF document this JSON has been exported from.
       */
      pdfId?: {
        /**
         * Permanent document identifier based on the contents of the file at the time it was originally created. Does not change when the file is saved incrementally.
         * example:
         * 9C3nLxNzQBuBBzv96LbdMg==
         */
        permanent?: string;
        /**
         * Document identifier based on the file's contents at the time it was last updated.
         * example:
         * Oi+XccZpDHChV7I=
         */
        changing?: string;
      };
    }
    /**
     * Intensity
     */
    export type Intensity = number;
    /**
     * isCommentThreadRoot
     * Indicates whether the annotation is the root of a comment thread.
     */
    export type IsCommentThreadRoot = boolean;
    /**
     * IsoDateTime
     * Date and time in ISO8601 format with timezone.
     * example:
     * 2019-09-16T15:05:03.712909Z
     */
    export type IsoDateTime = string;
    /**
     * JSONContentOutput
     * JSON with document contents. Returned for `json-content` output type.
     */
    export interface JSONContentOutput {
      type: 'json-content';
      /**
       * When set to true, extracts document text. Text is extracted via OCR process.
       */
      plainText?: boolean;
      /**
       * When set to true, extracts structured document text. This includes text words, characters, lines and paragraphs.
       */
      structuredText?: boolean;
      /**
       * When set to true, extracts key-value pairs detected within the document contents. Example of detected values are phone numbers, email addresses, currencies, numbers, dates, etc.
       */
      keyValuePairs?: boolean;
      /**
       * When set to true, extracts tabular data from the document.
       */
      tables?: boolean;
      language?: /**
       * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
       * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
       * example:
       * english
       */
      | OcrLanguage /**
         * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
         * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
         * example:
         * english
         */
        | OcrLanguage[];
    }
    /**
     * A JSON Web Token.
     * example:
     * eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJyZWFkLWRvY3VtZW50Iiwid3JpdGUiLCJkb3dubG9hZCJdLCJkb2N1bWVudF9pZCI6IjdLUFNKTkZCVkpFNzlXR0IxM05DRzdTMlgzIiwibGF5ZXIiOiJwUUNHREVpVVFFWTdleEJfcW5zeC1BIiwiaWF0IjoxNjYwOTA4ODk0LCJleHAiOjE2NjExNjgwOTQsImp0aSI6IjU5OTAwZDVmLTIyMDgtNDNjMy1iYzk3LWMxMjgzNDI3NmM4YyJ9.BtBbivWY2cC3R_8tm1j_GxtcQFIvmGkTSsz78EXiJEsTUCkRcfZWN2lOsI0Dn2-M6sG21QSbToEhVMvL5r_4sg
     */
    export type JWT = string;
    /**
     * JavaScriptAction
     */
    export interface JavaScriptAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'javascript';
      script: string;
    }
    /**
     * Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page.
     */
    export interface JsonContentsBbox {
      /**
       * example:
       * 0
       */
      left: number;
      /**
       * example:
       * 0
       */
      top: number;
      /**
       * example:
       * 100
       */
      width: number;
      /**
       * example:
       * 100
       */
      height: number;
    }
    /**
     * Backend JWT Claims (V1)
     * Claims of the JWT token used for authentication Document Engine's public API.
     */
    export interface JwtBackendV1 {
      /**
       * The expiration time of the token. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token expires in 1 hour.
       * example:
       * 1743769299
       */
      exp: number;
      /**
       * The time before which the token is not valid. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token is valid immediately.
       * example:
       * 1743772925
       */
      nbf?: number;
      /**
       * The "jti" (JWT ID) claim provides a unique identifier for the JWT. Required for revokable JWTs.
       * example:
       * c7ece9fc-81cd-4c76-9c3f-e115701259fd
       */
      jti?: string;
      /**
       * List of document IDs that can be used with the token or `any` to allow access to all documents.
       *
       * If not specified, no documents are allowed.
       */
      allowed_document_ids?: /**
       * List of document IDs that can be used with the token or `any` to allow access to all documents.
       *
       * If not specified, no documents are allowed.
       */
      string[] | 'any';
      /**
       * List of origins that can be used with the token for requests originating from the Web browser.
       * If not specified, all origins are allowed. This claim also accepts a regular expression.
       */
      allowed_origins?: ('any' | string[])[];
      /**
       * List of operations that can be performed with the JWT. By default, allows all operations.
       */
      allowed_operations?: /* List of operations that can be performed with the JWT. By default, allows all operations. */
      'any' | Features;
      /**
       * Base URL of the Document Engine this JWT is valid for. This is a hint for the clients (e.g. Nutrient Web SDK).
       * If not provided clients need to configure the correct URL.
       * example:
       * https://example.com
       */
      server_url?: string;
    }
    export interface JwtBase {
      /**
       * The expiration time of the token. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token expires in 1 hour.
       * example:
       * 1743769299
       */
      exp: number;
      /**
       * The time before which the token is not valid. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token is valid immediately.
       * example:
       * 1743772925
       */
      nbf?: number;
      /**
       * The "jti" (JWT ID) claim provides a unique identifier for the JWT. Required for revokable JWTs.
       * example:
       * c7ece9fc-81cd-4c76-9c3f-e115701259fd
       */
      jti?: string;
    }
    /**
     * Frontend JWT Claims (v1)
     * Claims of the JWT token used for authorizing Document Engine's frontend clients (Nutrient Web, Android and iOS SDKs).
     */
    export interface JwtFrontendV1 {
      /**
       * The expiration time of the token. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token expires in 1 hour.
       * example:
       * 1743769299
       */
      exp: number;
      /**
       * The time before which the token is not valid. Unix time (seconds from 1970-01-01T00:00:00Z).
       * By default, the token is valid immediately.
       * example:
       * 1743772925
       */
      nbf?: number;
      /**
       * The "jti" (JWT ID) claim provides a unique identifier for the JWT. Required for revokable JWTs.
       * example:
       * c7ece9fc-81cd-4c76-9c3f-e115701259fd
       */
      jti?: string;
      /**
       * The ID of the document.
       * example:
       * 7KPSA689RP53HB64GKKZX64XFV
       */
      document_id: string;
      /**
       * The name of the layer all changes will be persisted to.
       * If not specified, the default layer will be used.
       * example:
       * layer_name
       */
      layer?: string;
      /**
       * The permission level for the document.
       * - `read-document` - Required for viewing a document and its annotations. Without this permission, it won’t be possible for the user to load the document and perform any operations on it.
       * - `write` - Required for creating, updating, and deleting annotations in a document.
       * - `download` - Required for downloading and printing a document’s PDF file
       * - `cover-image` - Required for accessing the /documents/cover endpoint.
       * example:
       * [
       *   "read-document",
       *   "write",
       *   "download"
       * ]
       */
      permissions: ('read-document' | 'write' | 'download' | 'cover-image')[];
      /**
       * Defines fine-grained permissions for actions allowed by individual users when multiple users are
       * working on the same document. See the [Collaboration Permissions](https://www.nutrient.io/guides/web/collaboration-permissions/introduction-to-collaboration-permissions/)
       * guide for more details.
       */
      collaboration_permissions?: any[];
      /**
       * The user ID associated with the token. By default, the token is not associated with any user.
       *
       * `user_id` is stored on any annotation created, updated, or deleted by the user.
       * example:
       * userId
       */
      user_id?: string;
      /**
       * Controls the [group](https://www.nutrient.io/guides/document-engine/viewer/permissions/) of created annotations, comments, and form fields.
       * example:
       * group_id
       */
      default_group?: string;
      /**
       * Ensures all annotations, comments and form fields are created with a specified creator name.
       * example:
       * creator
       */
      creator_name?: string;
    }
    /**
     * The key of the detected key-value pair.
     *
     */
    export interface KVPKey {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * The detected key text. `#` is the value does not have a key.
       *
       * example:
       * #
       */
      content: string;
    }
    /**
     * The value of the detected key-value pair.
     *
     */
    export interface KVPValue {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * The detected value text.
       * example:
       * €
       */
      content: string;
      /**
       * The value type. One of the following: `Unknown`, `PhoneNumber`, `EmailAddress`, `Currency`, `Number`, `DateTime`, `String`, `PostCode`, `URL`, `Percentage`, `Symbol`, `VatIDValue`, `TimePeriod`, `IBAN`, `BIC`, `CreditCard`, `UID`, `PostalAddress`, `VIN`, `SSN`
       *
       * example:
       * Currency
       */
      dataType: string;
    }
    export interface KeyValuePair {
      confidence: /**
       * Specifies the confidence score of pair, in the range [0 - 100].
       * example:
       * 95.4
       */
      Confidence;
      key: /**
       * The key of the detected key-value pair.
       *
       */
      KVPKey;
      value: /**
       * The value of the detected key-value pair.
       *
       */
      KVPValue;
    }
    export interface Label {
      pages: /**
       * Defines the range of pages in a document. The indexing starts from 0. It is possible
       * to use negative numbers to refer to pages from the last page. For example, `-1` refers to the last page.
       */
      PageRange;
      /**
       * The label to apply to specified pages.
       * example:
       * Page I-III
       */
      label: string;
    }
    /**
     * LaunchAction
     */
    export interface LaunchAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'launch';
      /**
       * The file path to launch.
       * example:
       * /other_document.pdf
       */
      filePath: string;
    }
    export interface LayerCreateWithSourceLayer {
      /**
       * The name of the new layer.
       * example:
       * my-layer
       */
      name: string;
      /**
       * The name of the layer the new one will be based on. If not provided or the layer with
       * the given name doesn't exist, the base layer is assumed instead.
       * example:
       * my-existing-layer
       */
      source_layer_name?: string;
    }
    export interface LayerCreateWithSourceLayerAndInstantJson {
      /**
       * The name of the new layer.
       * example:
       * my-layer
       */
      name: string;
      /**
       * The name of the layer the new one will be based on. If not provided or the layer with
       * the given name doesn't exist, the base layer is assumed instead.
       * example:
       * my-existing-layer
       */
      source_layer_name?: string;
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      InstantJson;
    }
    export interface LayerCreated {
      /**
       * The name of the newly created layer.
       * example:
       * my-layer
       */
      name: string;
      errors: /* An array of errors encountered during the operation. */ Errors;
    }
    export interface Line {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * The index of the first word of the line from the `characters`  array.
       * example:
       * 0
       */
      firstWordIndex: number;
      /**
       * Specifies if the line is written from right to left.
       * example:
       * false
       */
      isRTL: boolean;
      /**
       * Specifies if the line is vertically oriented.
       * example:
       * false
       */
      isVertical: boolean;
      /**
       * The number of words in the line.
       * example:
       * 5
       */
      wordCount: number;
    }
    /**
     * LineAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface LineAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/line';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      startPoint: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point;
      endPoint: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      lineCaps?: /* LineCaps */ LineCaps;
    }
    /**
     * LineAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface LineAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/line';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      startPoint: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point;
      endPoint: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      lineCaps?: /* LineCaps */ LineCaps;
    }
    /**
     * LineCap
     */
    export type LineCap =
      | 'square'
      | 'circle'
      | 'diamond'
      | 'openArrow'
      | 'closedArrow'
      | 'butt'
      | 'reverseOpenArrow'
      | 'reverseClosedArrow'
      | 'slash';
    /**
     * LineCaps
     */
    export interface LineCaps {
      start?: /* LineCap */ LineCap;
      end?: /* LineCap */ LineCap;
    }
    /**
     * Lines
     */
    export interface Lines {
      /**
       * Intensities are used to weigh the point during natural drawing. They are received by pressure-sensitive drawing or touch devices. The default value should be used if it's not possible to obtain the intensity.
       */
      intensities?: /* Intensity */ Intensity[][];
      /**
       * Points are grouped in segments. Points inside a segment are joined to a line. There must be at least one  segment with at least one point.
       */
      points?: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point[][];
    }
    /**
     * LinkAnnotation
     * A link can be used to trigger an action when clicked or pressed. The link will be drawn on the bounding box.
     */
    export interface LinkAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/link';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A color of the link border.
       * example:
       * #ffffff
       */
      borderColor?: string; // ^#[0-9a-fA-F]{6}$
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * LinkAnnotation
     * A link can be used to trigger an action when clicked or pressed. The link will be drawn on the bounding box.
     */
    export interface LinkAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/link';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A color of the link border.
       * example:
       * #ffffff
       */
      borderColor?: string; // ^#[0-9a-fA-F]{6}$
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * ListBoxFormField
     * A list box where multiple values can be selected.
     */
    export interface ListBoxFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/listbox';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      options: /**
       * The list of form field options.
       *
       * The index of the widget annotation ID in the `annotationIds`
       * property corresponds to an index in the  form field option array.
       * example:
       * [
       *   {
       *     "label": "MALE",
       *     "value": "MALE"
       *   },
       *   {
       *     "label": "FEMALE",
       *     "value": "FEMALE"
       *   }
       * ]
       */
      FormFieldOptions;
      /**
       * If true, more than one of the field's option items may be selected
       * simultaneously.
       */
      multiSelect?: boolean;
      /**
       * If true, the new value is committed as soon as a selection is made, without
       * requiring the user to blur the field.
       */
      commitOnChange?: boolean;
      defaultValues?: /* Default values corresponding to each option. */ FormFieldDefaultValues;
      additionalActions?: /* Additional actions that can be performed on the form field. */ FormFieldAdditionalActionsEvent;
    }
    /**
     * MarkupAnnotation
     * Markup annotations include highlight, squiggly, strikeout, and underline. All of these require a list of rectangles that they're drawn to. The highlight annotation will lay the color on top of the element and apply the multiply blend mode.
     */
    export interface MarkupAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type:
        | 'pspdfkit/markup/highlight'
        | 'pspdfkit/markup/squiggly'
        | 'pspdfkit/markup/strikeout'
        | 'pspdfkit/markup/underline';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * Bounding boxes of the marked text.
       */
      rects: /**
       * Rect
       * Rectangle in a form [left, top, width, height] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200,
       *   300,
       *   400
       * ]
       */
      Rect[];
      blendMode?: /* BlendMode */ BlendMode;
      /**
       * Foreground color
       * example:
       * #fcee7c
       */
      color: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      isCommentThreadRoot?: /**
       * isCommentThreadRoot
       * Indicates whether the annotation is the root of a comment thread.
       */
      IsCommentThreadRoot;
    }
    /**
     * MarkupAnnotation
     * Markup annotations include highlight, squiggly, strikeout, and underline. All of these require a list of rectangles that they're drawn to. The highlight annotation will lay the color on top of the element and apply the multiply blend mode.
     */
    export interface MarkupAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type:
        | 'pspdfkit/markup/highlight'
        | 'pspdfkit/markup/squiggly'
        | 'pspdfkit/markup/strikeout'
        | 'pspdfkit/markup/underline';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * Bounding boxes of the marked text.
       */
      rects: /**
       * Rect
       * Rectangle in a form [left, top, width, height] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200,
       *   300,
       *   400
       * ]
       */
      Rect[];
      blendMode?: /* BlendMode */ BlendMode;
      /**
       * Foreground color
       * example:
       * #fcee7c
       */
      color: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      isCommentThreadRoot?: /**
       * isCommentThreadRoot
       * Indicates whether the annotation is the root of a comment thread.
       */
      IsCommentThreadRoot;
    }
    /**
     * MeasurementPrecision
     */
    export type MeasurementPrecision = 'whole' | 'oneDp' | 'twoDp' | 'threeDp' | 'fourDp';
    /**
     * MeasurementScale
     */
    export interface MeasurementScale {
      unitFrom?: 'in' | 'mm' | 'cm' | 'pt';
      unitTo?: 'in' | 'mm' | 'cm' | 'pt' | 'ft' | 'm' | 'yd' | 'km' | 'mi';
      from?: number;
      to?: number;
    }
    export interface Metadata {
      title?: /**
       * The document title.
       * example:
       * Nutrient Document Engine API Specification
       */
      Title;
      /**
       * The document author.
       * example:
       * Document Author
       */
      author?: string;
    }
    export interface MigrateDocumentAssetsError {
      errors:
        | {
            [name: string]: any;
          }
        | (
            | {
                [name: string]: any;
              }
            | string
          )[];
    }
    export interface MigrateDocumentAssetsRequest {
      storage: /* DocumentStorageConfiguration */ StorageConfiguration;
      /**
       * If set to `true`, all remote files will be copied to the new storage backend.
       * If set to `false`, only assets that are already present in the old storage backend i.e non-remote assets
       * will be moved to the new storage.
       *
       * Regardless of if remote assets are copied to the storage or not,
       * The storage configuration in `storage` will be set as the default storage for any new assets
       * associated with the document (or layer) in the future.
       *
       * For example, any image annotation attachments uploaded and associated with the document after migrating the document to the new storage
       * will be stored in the new storage backend.
       */
      copy_remote_files_to_new_storage?: boolean;
    }
    export interface MigrateDocumentAssetsResponse {
      data: {
        /**
         * The ID of the job that is migrating the document assets.
         * Make a request to `/api/async/jobs/{jobId}` using the `jobId` to get the status of the job
         */
        jobId: string;
      };
    }
    /**
     * NamedAction
     */
    export interface NamedAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'named';
      action:
        | 'nextPage'
        | 'prevPage'
        | 'firstPage'
        | 'lastPage'
        | 'goBack'
        | 'goForward'
        | 'goToPage'
        | 'find'
        | 'print'
        | 'outline'
        | 'search'
        | 'brightness'
        | 'zoomIn'
        | 'zoomOut'
        | 'saveAs'
        | 'info';
    }
    export interface NewPagePart {
      page: 'new';
      /**
       * Number of pages to be added.
       */
      pageCount?: number;
      layout?: /* Defines the layout of the generated pages. */ PageLayout;
      actions?: BuildAction[];
    }
    /**
     * NoteAnnotation
     * Note annotations are “sticky notes” attached to a point in the PDF document. They're represented as markers, and each one has an icon associated with it. Its text content is revealed on selection.
     */
    export interface NoteAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: string;
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      text: /* The text contents. */ AnnotationText;
      icon: /* NoteIcon */ NoteIcon;
      /**
       * A color that fills the note shape and its icon.
       * example:
       * #ffd83f
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
    }
    /**
     * NoteAnnotation
     * Note annotations are “sticky notes” attached to a point in the PDF document. They're represented as markers, and each one has an icon associated with it. Its text content is revealed on selection.
     */
    export interface NoteAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: string;
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      text: /**
       * The text contents.
       * example:
       * Annotation text.
       */
      AnnotationPlainText;
      icon: /* NoteIcon */ NoteIcon;
      /**
       * A color that fills the note shape and its icon.
       * example:
       * #ffd83f
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
    }
    /**
     * NoteIcon
     */
    export type NoteIcon =
      | 'comment'
      | 'rightPointer'
      | 'rightArrow'
      | 'check'
      | 'circle'
      | 'cross'
      | 'insert'
      | 'newParagraph'
      | 'note'
      | 'paragraph'
      | 'help'
      | 'star'
      | 'key';
    /**
     * OCGCollectionObject
     * Collection object
     */
    export interface OCGCollectionObject {
      /**
       * The ID of the collection, if available. If not, the collection can't be toggled on/off.
       */
      ocgId?: number;
      /**
       * Name of the collection, may be null
       */
      name?: string;
      layers: /**
       * OCGLayerObject
       * Layer object
       */
      OCGLayerObject[];
    }
    /**
     * OCGLayerObject
     * Layer object
     */
    export interface OCGLayerObject {
      ocgId: number;
      /**
       * Name of the layer that can be displayed in the UI.
       */
      name: string;
      radioGroup?: number;
    }
    /**
     * OCGLayerResponse
     * Response for OCG Layer
     * example:
     * {
     *   "ocgs": [
     *     {
     *       "name": "Option 1",
     *       "ocgId": 118,
     *       "radioGroup": 0
     *     },
     *     {
     *       "name": "Option 2",
     *       "ocgId": 108,
     *       "radioGroup": 0
     *     },
     *     {
     *       "layers": [
     *         {
     *           "name": "Nested Layer 1",
     *           "ocgId": 86
     *         },
     *         {
     *           "name": "Nested Layer 2",
     *           "ocgId": 72
     *         }
     *       ],
     *       "name": "Nested Layers",
     *       "ocgId": 121
     *     },
     *     {
     *       "layers": [
     *         {
     *           "name": "Layer 1",
     *           "ocgId": 86
     *         },
     *         {
     *           "name": "Layer 2",
     *           "ocgId": 72
     *         }
     *       ],
     *       "name": "Grouped layers"
     *     }
     *   ]
     * }
     */
    export interface OCGLayerResponse {
      /**
       * Array may contain either Layer or Collection
       */
      ocgs: /**
       * OCGLayerObject
       * Layer object
       */
      (
        | OCGLayerObject /**
         * OCGCollectionObject
         * Collection object
         */
        | OCGCollectionObject
      )[];
    }
    export interface OcrAction {
      /**
       * Perform optical character recognition (OCR) in the document.
       */
      type: 'ocr';
      language: /**
       * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
       * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
       * example:
       * english
       */
      | OcrLanguage /**
         * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
         * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
         * example:
         * english
         */
        | OcrLanguage[];
    }
    /**
     * Language to be used for the OCR text extraction. You can find the list of supported languages in our [guides](https://www.nutrient.io/guides/document-engine/ocr/language-support/).
     * In addition to the languages outlined in the guides, we support the 3 letter ISO 639-2 code for some other languages.
     * example:
     * english
     */
    export type OcrLanguage =
      | 'afrikaans'
      | 'albanian'
      | 'arabic'
      | 'armenian'
      | 'azerbaijani'
      | 'basque'
      | 'belarusian'
      | 'bengali'
      | 'bosnian'
      | 'bulgarian'
      | 'catalan'
      | 'chinese'
      | 'croatian'
      | 'czech'
      | 'danish'
      | 'dutch'
      | 'english'
      | 'finnish'
      | 'french'
      | 'german'
      | 'indonesian'
      | 'italian'
      | 'malay'
      | 'norwegian'
      | 'polish'
      | 'portuguese'
      | 'serbian'
      | 'slovak'
      | 'slovenian'
      | 'spanish'
      | 'swedish'
      | 'turkish'
      | 'welsh'
      | 'afr'
      | 'amh'
      | 'ara'
      | 'asm'
      | 'aze'
      | 'bel'
      | 'ben'
      | 'bod'
      | 'bos'
      | 'bre'
      | 'bul'
      | 'cat'
      | 'ceb'
      | 'ces'
      | 'chr'
      | 'cos'
      | 'cym'
      | 'dan'
      | 'deu'
      | 'div'
      | 'dzo'
      | 'ell'
      | 'eng'
      | 'enm'
      | 'epo'
      | 'equ'
      | 'est'
      | 'eus'
      | 'fao'
      | 'fas'
      | 'fil'
      | 'fin'
      | 'fra'
      | 'frk'
      | 'frm'
      | 'fry'
      | 'gla'
      | 'gle'
      | 'glg'
      | 'grc'
      | 'guj'
      | 'hat'
      | 'heb'
      | 'hin'
      | 'hrv'
      | 'hun'
      | 'hye'
      | 'iku'
      | 'ind'
      | 'isl'
      | 'ita'
      | 'jav'
      | 'jpn'
      | 'kan'
      | 'kat'
      | 'kaz'
      | 'khm'
      | 'kir'
      | 'kmr'
      | 'kor'
      | 'kur'
      | 'lao'
      | 'lat'
      | 'lav'
      | 'lit'
      | 'ltz'
      | 'mal'
      | 'mar'
      | 'mkd'
      | 'mlt'
      | 'mon'
      | 'mri'
      | 'msa'
      | 'mya'
      | 'nep'
      | 'nld'
      | 'nor'
      | 'oci'
      | 'ori'
      | 'osd'
      | 'pan'
      | 'pol'
      | 'por'
      | 'pus'
      | 'que'
      | 'ron'
      | 'rus'
      | 'san'
      | 'sin'
      | 'slk'
      | 'slv'
      | 'snd'
      | 'sp1'
      | 'spa'
      | 'sqi'
      | 'srp'
      | 'sun'
      | 'swa'
      | 'swe'
      | 'syr'
      | 'tam'
      | 'tat'
      | 'tel'
      | 'tgk'
      | 'tgl'
      | 'tha'
      | 'tir'
      | 'ton'
      | 'tur'
      | 'uig'
      | 'ukr'
      | 'urd'
      | 'uzb'
      | 'vie'
      | 'yid'
      | 'yor';
    /**
     * OfficeOutput
     */
    export interface OfficeOutput {
      /**
       * The output office file type.
       */
      type: 'docx' | 'xlsx' | 'pptx';
    }
    export interface OfficeTemplateModel {
      /**
       * Configuration for the Office template processing.
       */
      config?: {
        /**
         * Pair of delimiters that encloses a template marker. The "model" object associates a
         * template marker with the corresponding substitution in the final, produced document.
         */
        delimiter?: {
          /**
           * example:
           * {{
           */
          start?: string;
          /**
           * example:
           * }}
           */
          end?: string;
        };
      };
      /**
       * The model object that contains the data to be substituted into the template.
       *
       * Right now, we support placeholders and loops.
       * example:
       * {
       *   "placeholder": "replacement value",
       *   "loop-name": [
       *     {
       *       "placeholder-within-loop": "replacement value",
       *       "another-placeholder-within-loop": "replacement value 2"
       *     },
       *     {
       *       "placeholder-within-loop": "another replacement value",
       *       "another-placeholder-within-loop": "another replacement value 2"
       *     }
       *   ]
       * }
       */
      model?: {
        [name: string]:
          | string
          | {
              [key: string]: any;
            };
      };
    }
    export interface OptimizePdf {
      grayscaleText?: boolean;
      grayscaleGraphics?: boolean;
      grayscaleImages?: boolean;
      grayscaleFormFields?: boolean;
      grayscaleAnnotations?: boolean;
      disableImages?: boolean;
      mrcCompression?: boolean;
      imageOptimizationQuality?: number;
      /**
       * If set to `true`, the resulting PDF file will be linearized.
       * This means that the document will be optimized in a special way that allows it to be loaded faster over the network.
       * You need the `Linearization` feature to be enabled in your Nutrient Document Engine license in order to use this option.
       */
      linearize?: boolean;
    }
    /**
     * OutlineElement
     */
    export interface OutlineElement {
      /**
       * example:
       * pspdfkit/outline-element
       */
      type: string;
      /**
       * Indicates whether the outline element is expanded.
       * example:
       * true
       */
      isExpanded?: boolean;
      /**
       * Indicates whether the outline element's title is italic.
       * example:
       * false
       */
      isItalic?: boolean;
      /**
       * Indicates whether the outline element's title is bold.
       * example:
       * false
       */
      isBold?: boolean;
      /**
       * The outline element's title.
       */
      title?: string;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Array of outline elements nested under the current outline element.
       * example:
       * []
       */
      children?: /* OutlineElement */ OutlineElement[];
    }
    /**
     * OutlineElements
     * An array of outline elements.
     */
    export type OutlineElements = /* OutlineElement */ OutlineElement[];
    /**
     * Object representing PDF output.
     */
    export interface PDFAOutput {
      metadata?: Metadata;
      labels?: Label[];
      /**
       * Defines the password which allows to open a file with defined
       * permissions
       */
      user_password?: string;
      /**
       * Defines the password which allows to manage the permissions for the file
       */
      owner_password?: string;
      /**
       * Defines the permissions which are granted when a file is opened with user password
       */
      user_permissions?: PDFUserPermission[];
      optimize?: OptimizePdf;
      type: 'pdfa';
      /**
       * Defines the conformance level of the output file.
       * The default value is `pdfa-1b`.
       *
       * These are the only supported conformance levels at this time.
       */
      conformance?:
        | 'pdfa-1a'
        | 'pdfa-1b'
        | 'pdfa-2a'
        | 'pdfa-2u'
        | 'pdfa-2b'
        | 'pdfa-3a'
        | 'pdfa-3u';
      /**
       * When set to true, produces vector based graphic elements where applicable. For example: fonts and paths.
       */
      vectorization?: boolean;
      /**
       * When set to true, produces raster based graphic elements where applicable. For example: images.
       */
      rasterization?: boolean;
    }
    /**
     * Object representing PDF output.
     */
    export interface PDFOutput {
      metadata?: Metadata;
      labels?: Label[];
      /**
       * Defines the password which allows to open a file with defined
       * permissions
       */
      user_password?: string;
      /**
       * Defines the password which allows to manage the permissions for the file
       */
      owner_password?: string;
      /**
       * Defines the permissions which are granted when a file is opened with user password
       */
      user_permissions?: PDFUserPermission[];
      optimize?: OptimizePdf;
      type?: 'pdf';
    }
    export type PDFUserPermission =
      | 'printing'
      | 'modification'
      | 'extract'
      | 'annotations_and_forms'
      | 'fill_forms'
      | 'extract_accessibility'
      | 'assemble'
      | 'print_high_quality';
    /**
     * Page
     */
    export interface Page {
      /**
       * Height of the page in points.
       * example:
       * 842
       */
      height?: number;
      matrix?: number[];
      rawPdfBoxes?: {
        cropBox?: number[];
        mediaBox?: number[];
        bleedBox?: number[];
        trimBox?: number[];
        artBox?: number[];
      };
      reverseMatrix?: number[];
      transformedBBox?: number[];
      untransformedBBox?: number[];
      pageIndex: /**
       * PageIndex
       * 0-based index of the page.
       * example:
       * 0
       */
      DocumentPageIndex;
      /**
       * Label of the page.
       * example:
       * 1
       */
      pageLabel?: string;
      /**
       * Clockwise rotation of the page.
       * example:
       * 0
       */
      rotation?: 0 | 90 | 180 | 270;
      /**
       * Width of the page in points.
       * example:
       * 595
       */
      width?: number;
    }
    export type PageIndex =
      /**
       * PageIndex
       * 0-based index of the page.
       * example:
       * 0
       */
      DocumentPageIndex;
    export interface PageJsonContents {
      /**
       * 0-based index of the page in the document.
       * example:
       * 0
       */
      pageIndex: number;
      plainText?: /**
       * Page text extracted via OCR process. This property is present only when `plainText` is set to `true`.
       *
       * example:
       * Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
       *
       */
      PlainText;
      structuredText?: StructuredText;
      /**
       * A list of detected key-value pairs on the page.
       *
       */
      keyValuePairs?: KeyValuePair[];
      /**
       * A list of detected tables on the page.
       *
       */
      tables?: Table[];
    }
    /**
     * Defines the layout of the generated pages.
     */
    export interface PageLayout {
      /**
       * The orientation of generated pages.
       */
      orientation?: 'portrait' | 'landscape';
      size?:
        | ('A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'Letter' | 'Legal')
        | {
            /**
             * The width of pages in mm.
             * example:
             * 210
             */
            width?: number;
            /**
             * The height of pages in mm.
             * example:
             * 297
             */
            height?: number;
          };
      /**
       * The margins of generated pages. All dimensions are in mm.
       */
      margin?: {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
      };
    }
    /**
     * Defines the range of pages in a document. The indexing starts from 0. It is possible
     * to use negative numbers to refer to pages from the last page. For example, `-1` refers to the last page.
     */
    export interface PageRange {
      start?: number;
      end?: number;
    }
    /**
     * Clockwise rotation of the page.
     * example:
     * 0
     */
    export type PageRotation = 0 | 90 | 180 | 270;
    /**
     * An object with text lines on the document's page.
     */
    export interface PageText {
      pageIndex: /**
       * PageIndex
       * 0-based index of the page.
       * example:
       * 0
       */
      DocumentPageIndex;
      textLines: /* A line of text on the document's page. */ TextLine[];
    }
    export interface Paragraph {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * The index of the first line of the paragraph from the `lines` array.
       * example:
       * 0
       */
      firstLineIndex: number;
      /**
       * The number of lines in the paragraph.
       * example:
       * 3
       */
      lineCount: number;
    }
    export type Part =
      /**
       * example:
       * {
       *   "file": "pdf-file-from-multipart"
       * }
       */
      | FilePart
      | HTMLPart
      | NewPagePart /**
       * This allows to reference a document stored on Document Engine.
       * It is also possible to refer to currently scoped file by using special ID:
       *   ```
       *   {"document": {"id": "#self"}}
       *   ```
       */
      | DocumentPart;
    /**
     * Indicates whether the document is password protected.
     * example:
     * true
     */
    export type PasswordProtected = boolean;
    /**
     * The PDF object ID of the annotation from the source PDF.
     */
    export type PdfObjectId = number;
    /**
     * Page text extracted via OCR process. This property is present only when `plainText` is set to `true`.
     *
     * example:
     * Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
     *
     */
    export type PlainText = string;
    /**
     * Point
     * Point coordinates in a form [x, y] in PDF points (pt).
     * example:
     * [
     *   100,
     *   200
     * ]
     */
    export type Point = number[];
    /**
     * PolygonAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface PolygonAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/polygon';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      points: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point[];
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
    }
    /**
     * PolygonAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface PolygonAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/polygon';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      points: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point[];
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
    }
    /**
     * PolylineAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface PolylineAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/polyline';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      points: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point[];
      lineCaps?: /* LineCaps */ LineCaps;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * PolylineAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface PolylineAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/polyline';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      points: /**
       * Point
       * Point coordinates in a form [x, y] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200
       * ]
       */
      Point[];
      lineCaps?: /* LineCaps */ LineCaps;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    export interface Prerender {
      /**
       * Allows to prerender multiple versions of the pages scaled by provided factors.
       * example:
       * [
       *   1,
       *   2,
       *   4
       * ]
       */
      scales?: (1 | 2 | 4 | 6 | 8 | 12 | 16)[];
      /**
       * 0-based index of the first of the prerendered pages.
       * example:
       * 0
       */
      start_page?: number;
      /**
       * 0-based index of the last of the prerendered pages. If this value
       * is higher than the number of pages in the document, it will be
       * automatically adjusted.
       * example:
       * 3
       */
      end_page?: number;
    }
    /**
     * RadioButtonFormField
     * A group of radio buttons. Similar to `CheckBoxFormField`, but there can only be one value set at the same time.
     */
    export interface RadioButtonFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/radio';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      options: /**
       * The list of form field options.
       *
       * The index of the widget annotation ID in the `annotationIds`
       * property corresponds to an index in the  form field option array.
       * example:
       * [
       *   {
       *     "label": "MALE",
       *     "value": "MALE"
       *   },
       *   {
       *     "label": "FEMALE",
       *     "value": "FEMALE"
       *   }
       * ]
       */
      FormFieldOptions;
      defaultValue?: /* Default value of the form field. */ FormFieldDefaultValue;
      /**
       * If true, exactly one radio button must be selected at all times.
       * Clicking the currently selected button has no effect. Otherwise,
       * clicking the selected button deselects it, leaving no button selected.
       */
      noToggleToOff?: boolean;
      /**
       * If true, a group of radio buttons within a radio button field that use
       * the same value for the on state will turn on and off in unions: If one is
       * checked, they are all checked (the same behavior as HTML radio buttons).
       * Otherwise, only the checked radio button will be marked checked.
       */
      radiosInUnison?: boolean;
    }
    /**
     * RecordId
     * An unique Instant JSON identifier of the record. Must be unique in a layer.
     * example:
     * 01DNEDPQQ22W49KDXRFPG4EPEQ
     */
    export type RecordId = string;
    /**
     * Rect
     * Rectangle in a form [left, top, width, height] in PDF points (pt).
     * example:
     * [
     *   100,
     *   200,
     *   300,
     *   400
     * ]
     */
    export type Rect = number[];
    /**
     * RectangleAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface RectangleAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/rectangle';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * RectangleAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface RectangleAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/shape/rectangle';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
      fillColor?: /**
       * FillColor
       * example:
       * #FF0000
       */
      FillColor /* ^#[0-9a-fA-F]{6}$ */;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * RedactionAnnotation
     * Redaction annotations determines the location of the area marked for redaction.
     */
    export interface RedactionAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/markup/redaction';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * Bounding boxes of the marked text.
       */
      rects?: /**
       * Rect
       * Rectangle in a form [left, top, width, height] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200,
       *   300,
       *   400
       * ]
       */
      Rect[];
      /**
       * Outline color is the border color of a redaction annotation when it hasn't yet been applied to the document
       * example:
       * #ffffff
       */
      outlineColor?: string; // ^#[0-9a-fA-F]{6}$
      /**
       * Fill color is the background color that a redaction will have when applied to the document.
       */
      fillColor?: string; // ^#[0-9a-fA-F]{6}$
      /**
       * The text that will be printed on top of an applied redaction annotation.
       * example:
       * CONFIDENTIAL
       */
      overlayText?: string;
      /**
       * Specifies whether or not the overlay text will be repeated multiple times to fill the boundaries of the redaction annotation.
       */
      repeatOverlayText?: boolean;
      /**
       * Color of the overlay text (if any).
       * example:
       * #ffffff
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * RedactionAnnotation
     * Redaction annotations determines the location of the area marked for redaction.
     */
    export interface RedactionAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/markup/redaction';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * Bounding boxes of the marked text.
       */
      rects?: /**
       * Rect
       * Rectangle in a form [left, top, width, height] in PDF points (pt).
       * example:
       * [
       *   100,
       *   200,
       *   300,
       *   400
       * ]
       */
      Rect[];
      /**
       * Outline color is the border color of a redaction annotation when it hasn't yet been applied to the document
       * example:
       * #ffffff
       */
      outlineColor?: string; // ^#[0-9a-fA-F]{6}$
      /**
       * Fill color is the background color that a redaction will have when applied to the document.
       */
      fillColor?: string; // ^#[0-9a-fA-F]{6}$
      /**
       * The text that will be printed on top of an applied redaction annotation.
       * example:
       * CONFIDENTIAL
       */
      overlayText?: string;
      /**
       * Specifies whether or not the overlay text will be repeated multiple times to fill the boundaries of the redaction annotation.
       */
      repeatOverlayText?: boolean;
      /**
       * Color of the overlay text (if any).
       * example:
       * #ffffff
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    export type RedactionsCreate = /* CreateRedactions */ CreateRedactions;
    export type RedactionsCreateErrors = /* CreateRedactionsErrors */ CreateRedactionsErrors;
    /**
     * RefreshDigitalSignatures
     */
    export interface RefreshDigitalSignatures {
      /**
       * An optional list of signature IDs to refresh.
       *
       * If this list is empty then all the signatures in the document will be refreshed.
       */
      signatureFQNs?: string[];
    }
    /**
     * ResetFormAction
     */
    export interface ResetFormAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'resetForm';
      flags?: 'includeExclude';
      fields?: /* AnnotationReference */ AnnotationReference[];
    }
    export interface RotateAction {
      /**
       * Rotate all pages by the angle specified.
       */
      type: 'rotate';
      /**
       * The angle by which the pages should be rotated, clockwise.
       */
      rotateBy: 90 | 180 | 270;
    }
    /**
     * Document ID
     * The ID of the document.
     * example:
     * 7KPZW8XFGM4F1C92KWBK1B748M
     */
    export type SchemasDocumentId = string;
    /**
     * Page index of the annotation. 0 is the first page.
     * example:
     * 0
     */
    export type SchemasPageIndex = number;
    /**
     * - `credit-card-number` — matches a number with 13 to 19 digits that begins with 1—6.
     * Spaces and `-` are allowed anywhere in the number.
     * - `date` — matches date formats such as `mm/dd/yyyy`, `mm/dd/yy`, `dd/mm/yyyy`, and `dd/mm/yy`.
     * It rejects any days greater than 31 or months greater than 12 and accepts a leading 0 in front of a single-digit day or month.
     * The delimiter can be `-`, `.`, or `/`.
     * - `email-address` — matches an email address. Expects the format of `*@*.*` with at least two levels of the domain name.
     * - `international-phone-number` — matches international phone numbers.
     * The number can have 7 to 15 digits with spaces or `-` occurring anywhere within the number, and it must have prefix of `+` or `00`.
     * - `ipv4` — matches an IPv4 address with an optional mask at the end.
     * - `ipv6` — matches a full and compressed IPv6 address as defined in [RFC 2373](http://www.faqs.org/rfcs/rfc2373.html).
     * - `mac-address` — matches a MAC address with either `-` or `:` as a delimiter.
     * - `north-american-phone-number` — matches North American-style phone numbers.
     * NANPA standardization is used with international support.
     * - `social-security-number` — matches a social security number.
     * Expects the format of `XXX-XX-XXXX` or `XXXXXXXXX`, with X denoting digits.
     * - `time` — matches time formats such as `00:00:00`, `00:00`, and `00:00 PM`. 12- and 24-hour formats are allowed.
     * Seconds and AM/PM denotation are both optional.
     * - `url` — matches a URL with a prefix of `http` or `https`, with an optional subdomain.
     * - `us-zip-code` — matches a USA-style zip code. The format expected is `XXXXX`, `XXXXX-XXXX` or `XXXXX/XXXX`.
     * - `vin` — matches US and ISO Standard 3779 Vehicle Identification Number.
     * The format expects 17 characters, with the last 5 characters being numeric. `I`, `i`, `O`, `o` ,`Q`, `q`, and `_` characters are not allowed.
     * example:
     * email-address
     */
    export type SearchPreset =
      | 'credit-card-number'
      | 'date'
      | 'email-address'
      | 'international-phone-number'
      | 'ipv4'
      | 'ipv6'
      | 'mac-address'
      | 'north-american-phone-number'
      | 'social-security-number'
      | 'time'
      | 'url'
      | 'us-zip-code'
      | 'vin';
    /**
     * SearchResult
     * A single search result.
     */
    export interface SearchResult {
      /**
       * Index of the page where the text was found.
       * example:
       * 0
       */
      pageIndex: number;
      /**
       * Sourrounding text of the search query.
       * example:
       * PSPDFKit supports almost all PDF annotation types
       */
      previewText?: string;
      /**
       * Location of the search query in the preview text. The first element of the array
       * is a 0-based position of its first character within the text, and the second
       * element is the query's length.
       * example:
       * [
       *   2,
       *   3
       * ]
       */
      rangeInPreview?: [number, number];
      /**
       * Bounding boxes of all occurences of the query within the text in page
       * coordinates.
       */
      rectsOnPage?: [number, number, number, number][];
      /**
       * Currently always `false` - searching in annotations is not yet supported.
       * example:
       * false
       */
      isAnnotation?: boolean;
    }
    /**
     * SearchResults
     * An array of search results.
     */
    export type SearchResults =
      /**
       * SearchResult
       * A single search result.
       */
      SearchResult[];
    /**
     * ShapeAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface ShapeAnnotation {
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
    }
    /**
     * ShapeAnnotation
     * Shape annotations are used to draw different shapes on a page.
     */
    export interface ShapeAnnotationV1 {
      strokeDashArray?: number[];
      strokeWidth?: number;
      /**
       * example:
       * #ffffff
       */
      strokeColor?: string; // ^#[0-9a-fA-F]{6}$
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
      measurementScale?: /* MeasurementScale */ MeasurementScale;
      measurementPrecision?: /* MeasurementPrecision */ MeasurementPrecision;
    }
    /**
     * SignatureFormField
     * A field that contains a digital signature.
     */
    export interface SignatureFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/signature';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
    }
    /**
     * The signature type that is being created.
     */
    export type SignatureType = 'cades' | 'cms';
    /**
     * Sign requests accept an optional `signingToken` string parameter, which is forwarded to the signing service in
     * the exact same shape. You can use it to pass a token that can be used to verify the authenticity of the signing
     * request or to provide identity information about the user applying the signature.
     * example:
     * custom_signing_token
     */
    export type SigningToken = string;
    /**
     * SHA256 hash of the PDF file underlying the document.
     * example:
     * 1defd934dbbf77587eb9b7f45d162d2a3aea16c840a9e7cfa190fb2ea1f40a76
     */
    export type SourcePdfSha256 = string;
    /**
     * StampAnnotation
     * A stamp annotation represents a stamp in a PDF.
     */
    export interface StampAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/stamp';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A type defining the appearance of the stamp annotation. Type 'Custom' displays arbitrary title and subtitle.
       */
      stampType:
        | 'Accepted'
        | 'Approved'
        | 'AsIs'
        | 'Completed'
        | 'Confidential'
        | 'Departmental'
        | 'Draft'
        | 'Experimental'
        | 'Expired'
        | 'Final'
        | 'ForComment'
        | 'ForPublicRelease'
        | 'InformationOnly'
        | 'InitialHere'
        | 'NotApproved'
        | 'NotForPublicRelease'
        | 'PreliminaryResults'
        | 'Rejected'
        | 'Revised'
        | 'SignHere'
        | 'Sold'
        | 'TopSecret'
        | 'Void'
        | 'Witness'
        | 'Custom';
      /**
       * Custom stamp's title.
       */
      title?: string;
      /**
       * Custom stamp's subtitle.
       */
      subtitle?: string;
      /**
       * Custom stamp's fill color.
       * example:
       * #ffffff
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * StampAnnotation
     * A stamp annotation represents a stamp in a PDF.
     */
    export interface StampAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/stamp';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * A type defining the appearance of the stamp annotation. Type 'Custom' displays arbitrary title and subtitle.
       */
      stampType:
        | 'Accepted'
        | 'Approved'
        | 'AsIs'
        | 'Completed'
        | 'Confidential'
        | 'Departmental'
        | 'Draft'
        | 'Experimental'
        | 'Expired'
        | 'Final'
        | 'ForComment'
        | 'ForPublicRelease'
        | 'InformationOnly'
        | 'InitialHere'
        | 'NotApproved'
        | 'NotForPublicRelease'
        | 'PreliminaryResults'
        | 'Rejected'
        | 'Revised'
        | 'SignHere'
        | 'Sold'
        | 'TopSecret'
        | 'Void'
        | 'Witness'
        | 'Custom';
      /**
       * Custom stamp's title.
       */
      title?: string;
      /**
       * Custom stamp's subtitle.
       */
      subtitle?: string;
      /**
       * Custom stamp's fill color.
       * example:
       * #ffffff
       */
      color?: string; // ^#[0-9a-fA-F]{6}$
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      note?: /**
       * Note
       * Text of an annotation note.
       * example:
       * This is a note.
       */
      AnnotationNote;
    }
    /**
     * DocumentStorageConfiguration
     */
    export type StorageConfiguration =
      /* DocumentStorageConfiguration */
      | {
          backend: 's3';
          bucketName?: string;
          bucketRegion?: string;
        }
      | {
          backend: 'azure';
        }
      | {
          backend: 'built_in';
        };
    export interface StructuredText {
      /**
       * A list of characters detected within the page.
       *
       */
      characters?: Character[];
      /**
       * A list of lines detected within the page.
       *
       */
      lines?: Line[];
      /**
       * A list of paragraphs detected within the page.
       *
       */
      paragraphs?: Paragraph[];
      /**
       * A list of words detected within the page.
       *
       */
      words?: Word[];
    }
    /**
     * SubmitFormAction
     */
    export interface SubmitFormAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'submitForm';
      uri: string;
      flags: (
        | 'includeExclude'
        | 'includeNoValueFields'
        | 'exportFormat'
        | 'getMethod'
        | 'submitCoordinated'
        | 'xfdf'
        | 'includeAppendSaves'
        | 'includeAnnotations'
        | 'submitPDF'
        | 'canonicalFormat'
        | 'excludeNonUserAnnotations'
        | 'excludeFKey'
        | 'embedForm'
      )[];
      fields?: /* AnnotationReference */ AnnotationReference[];
    }
    export interface Table {
      confidence: /**
       * Specifies the confidence score of pair, in the range [0 - 100].
       * example:
       * 95.4
       */
      Confidence;
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * A list of table cells.
       */
      cells: TableCell[];
      /**
       * A list of table columns.
       */
      columns: TableColumn[];
      /**
       * A list of physical lines in the table.
       */
      lines: TableLine[];
      /**
       * A list of table rows.
       */
      rows: TableRow[];
    }
    export interface TableCell {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * An index of a row the cell belongs to (0-based).
       * example:
       * 0
       */
      rowIndex: number;
      /**
       * An index of a column the cell belongs to (0-based).
       * example:
       * 0
       */
      columnIndex: number;
      /**
       * Specifies if the cell has been identified as a part of the table header.
       * example:
       * true
       */
      isHeader: boolean;
      /**
       * The content of the cell.
       * example:
       * Invoice number
       */
      text: string;
    }
    export interface TableColumn {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
    }
    export interface TableLine {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * Specifies if the line is oriented vertically.
       * example:
       * false
       */
      isVertical?: boolean;
      /**
       * The thickness of the line, in PDF points.
       */
      thickness?: number;
    }
    export interface TableRow {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
    }
    /**
     * TextAnnotation
     * A text box annotation that can be placed anywhere on the screen.
     */
    export interface TextAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/text';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      text: /* The text contents. */ AnnotationText;
      fontSize: /**
       * FontSizeInt
       * Size of the text in PDF points.
       * example:
       * 10
       */
      FontSizeInt;
      fontStyle?: /* Text style. Can be only italic, only bold, italic and bold, or none of these. */ FontStyle;
      fontColor?: /**
       * FontColor
       * A foreground color of the text.
       * example:
       * #ffffff
       */
      FontColor /* ^#[0-9a-fA-F]{6}$ */;
      font?: /**
       * Font
       * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
       * example:
       * Helvetica
       */
      Font;
      /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      backgroundColor?: string; // ^#[0-9a-fA-F]{6}$
      horizontalAlign: /**
       * HorizontalAlign
       * Alignment of the text along the horizontal axis.
       */
      HorizontalAlign;
      verticalAlign: /**
       * VerticalAlign
       * Alignment of the text along the vertical axis.
       *
       * Note that vertical align is a custom PSPDFKit extension that might not be honored by 3rd party readers.
       */
      VerticalAlign;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      /**
       * Specifies that the text is supposed to fit in the bounding box. This is only set on new annotations, as we can't easily figure out if an appearance stream contains all the text for existing annotations.
       */
      isFitting?: boolean;
      /**
       * Properties for callout version of text annotation.
       */
      callout?: {
        start: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
        end: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
        /**
         * Inset applied to the bounding box to size and position the rectangle for the text [left, top, right, bottom].
         */
        innerRectInset: number[];
        cap?: /* LineCap */ LineCap;
        knee?: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
      };
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * TextAnnotation
     * A text box annotation that can be placed anywhere on the screen.
     */
    export interface TextAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/text';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      text: /**
       * The text contents.
       * example:
       * Annotation text.
       */
      AnnotationPlainText;
      fontSize: /**
       * FontSizeInt
       * Size of the text in PDF points.
       * example:
       * 10
       */
      FontSizeInt;
      /**
       * Text style. Can be only italic, only bold, italic and bold, or none of these.
       */
      fontStyle?: ('bold' | 'italic')[];
      fontColor?: /**
       * FontColor
       * A foreground color of the text.
       * example:
       * #ffffff
       */
      FontColor /* ^#[0-9a-fA-F]{6}$ */;
      font?: /**
       * Font
       * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
       * example:
       * Helvetica
       */
      Font;
      /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      backgroundColor?: string; // ^#[0-9a-fA-F]{6}$
      horizontalAlign?: /**
       * HorizontalAlign
       * Alignment of the text along the horizontal axis.
       */
      HorizontalAlign;
      verticalAlign?: /**
       * VerticalAlign
       * Alignment of the text along the vertical axis.
       *
       * Note that vertical align is a custom PSPDFKit extension that might not be honored by 3rd party readers.
       */
      VerticalAlign;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      /**
       * Specifies that the text is supposed to fit in the bounding box. This is only set on new annotations, as we can't easily figure out if an appearance stream contains all the text for existing annotations.
       */
      isFitting?: boolean;
      /**
       * Properties for callout version of text annotation.
       */
      callout?: {
        start: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
        end: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
        /**
         * Inset applied to the bounding box to size and position the rectangle for the text [left, top, right, bottom].
         */
        innerRectInset: number[];
        cap?: /* LineCap */ LineCap;
        knee?: /**
         * Point
         * Point coordinates in a form [x, y] in PDF points (pt).
         * example:
         * [
         *   100,
         *   200
         * ]
         */
        Point;
      };
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      cloudyBorderIntensity?: /* CloudyBorderIntensity */ CloudyBorderIntensity;
      cloudyBorderInset?: /**
       * CloudyBorderInset
       * Inset used for drawing cloudy borders in a form [left, top, right, bottom].
       */
      CloudyBorderInset;
    }
    /**
     * TextFormField
     * A text input element, that can either span a single or multiple lines.
     */
    export interface TextFormField {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the form field.
       */
      type: 'pspdfkit/form-field/text';
      /**
       * The unique Instant JSON identifier of the form field.
       * example:
       * 7KPSXX1NMNJ2WFDKN7BKQK9KZ
       */
      id?: string;
      /**
       * A unique identifier for the form field. This is not visible in the PDF.
       * example:
       * Form-Field
       */
      name: string;
      /**
       * The visible name of the form field. It is used to identify the field in the UI for accessibility.
       * example:
       * Form Field
       */
      label: string;
      /**
       * The list of Instant JSON identifiers of widget annotations that are associated with this form field.
       *
       * The widget annotation is used to define the visual appearance of the form field and
       * to manage user interaction with the form field. Each interactive form control is
       * associated with separate widget annotation.
       * example:
       * [
       *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
       *   "7KPS6T4DKYN71VB7G5KBGB5R51"
       * ]
       */
      annotationIds: string[];
      /**
       * The PDF object ID of the form field from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * Array of form field flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | readOnly | Field can't be filled. |
       * | required | Field needs to have a value when exported by a submit-form action |
       * | _noExport_ | _(Not supported) Field shall not be exported by a submit-form action. PSPDFKit will read this flag from the PDF and write back changes to its state, but otherwise this flag has no effect._ |
       * example:
       * [
       *   "required"
       * ]
       */
      flags?: ('readOnly' | 'required' | 'noExport')[];
      /**
       * If true, the field is intended for entering a secure password that should not be echoed visibly
       *  to the screen. Characters typed from the keyboard should instead be echoed in some unreadable
       *  form, such as asterisks or bullet characters.
       */
      password?: boolean;
      /**
       * The maximum length of the field's text, in characters. If none is set, the size is not limited.
       */
      maxLength?: number;
      /**
       * If true, the text entered in the field is not spell-checked.
       */
      doNotSpellCheck: boolean;
      /**
       * If true, the field does not scroll (horizontally for single-line fields, vertically for multiple-line fields)
       * to accommodate more text than fits within its widget annotation's rectangle. Once the field is full, no further
       * text is accepted.
       */
      doNotScroll: boolean;
      /**
       * If true, the field can contain multiple lines of text. Otherwise, the field's text is restricted to a single line.
       */
      multiLine: boolean;
      /**
       * If true, every character will have an input element on their own which is evenly distributed inside
       * the bounding box of the widget annotation. When this is set, the form field must have a `maxLength``.
       */
      comb: boolean;
      defaultValue: /* Default value of the form field. */ FormFieldDefaultValue;
      /**
       * _(Not Supported) Rich text rendering is not supported right now. Any rich text value will be displayed as plain text in case the regular text value is missing._
       */
      richText?: boolean;
      /**
       * _(Not Supported) Rich text rendering is not supported right now. Any rich text value will be displayed as plain text in case the regular text value is missing._
       */
      richTextValue?: string;
      /**
       * Additional actions that can be performed on the form field.
       */
      additionalActions?: {
        /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        onChange?: /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        /* GoToAction */ | GoToAction
          | /* GoToRemoteAction */ GoToRemoteAction
          | /* GoToEmbeddedAction */ GoToEmbeddedAction
          | /* LaunchAction */ LaunchAction
          | /* URIAction */ URIAction
          | /* HideAction */ HideAction
          | /* JavaScriptAction */ JavaScriptAction
          | /* SubmitFormAction */ SubmitFormAction
          | /* ResetFormAction */ ResetFormAction
          | /* NamedAction */ NamedAction;
        /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        onCalculate?: /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        /* GoToAction */ | GoToAction
          | /* GoToRemoteAction */ GoToRemoteAction
          | /* GoToEmbeddedAction */ GoToEmbeddedAction
          | /* LaunchAction */ LaunchAction
          | /* URIAction */ URIAction
          | /* HideAction */ HideAction
          | /* JavaScriptAction */ JavaScriptAction
          | /* SubmitFormAction */ SubmitFormAction
          | /* ResetFormAction */ ResetFormAction
          | /* NamedAction */ NamedAction;
        /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        onInput?: /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        /* GoToAction */ | GoToAction
          | /* GoToRemoteAction */ GoToRemoteAction
          | /* GoToEmbeddedAction */ GoToEmbeddedAction
          | /* LaunchAction */ LaunchAction
          | /* URIAction */ URIAction
          | /* HideAction */ HideAction
          | /* JavaScriptAction */ JavaScriptAction
          | /* SubmitFormAction */ SubmitFormAction
          | /* ResetFormAction */ ResetFormAction
          | /* NamedAction */ NamedAction;
        /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        onFormat?: /**
         * Represents a PDF action.
         *
         * There are many different action types. You can learn more about their semantics
         * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
         *
         * All actions have a `type` property. Depending on the type, the action object
         * includes additional properties.
         * example:
         * {
         *   "type": "goTo",
         *   "pageIndex": 0
         * }
         */
        /* GoToAction */ | GoToAction
          | /* GoToRemoteAction */ GoToRemoteAction
          | /* GoToEmbeddedAction */ GoToEmbeddedAction
          | /* LaunchAction */ LaunchAction
          | /* URIAction */ URIAction
          | /* HideAction */ HideAction
          | /* JavaScriptAction */ JavaScriptAction
          | /* SubmitFormAction */ SubmitFormAction
          | /* ResetFormAction */ ResetFormAction
          | /* NamedAction */ NamedAction;
      };
    }
    /**
     * A line of text on the document's page.
     */
    export interface TextLine {
      /**
       * Contents of the line of text.
       * example:
       * PSPDKit is a leading PDF SDK for Mobile and Web
       */
      contents: string;
      /**
       * Height of the line of text in points.
       * example:
       * 14
       */
      height?: number;
      /**
       * Width of the line of text in points.
       * example:
       * 331.7496337890625
       */
      width?: number;
      /**
       * Distance from the left edge of the page in points.
       * example:
       * 79.02290344238281
       */
      left?: number;
      /**
       * Distance from the top edge of the page in points.
       * example:
       * 312.2259521484375
       */
      top?: number;
    }
    /**
     * Text
     */
    export interface TextWatermarkAction {
      /**
       * Watermark all pages with text watermark.
       */
      type: 'watermark';
      /**
       * Width of the watermark in PDF points.
       */
      width: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Height of the watermark in PDF points.
       */
      height: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the top edge of a page.
       */
      top?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the right edge of a page.
       */
      right?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the bottom edge of a page.
       */
      bottom?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Offset of the watermark from the left edge of a page.
       */
      left?: {
        /**
         * Dimension value
         * example:
         * 100
         */
        value: number;
        /**
         * Dimension unit
         */
        unit: 'pt' | '%';
      };
      /**
       * Rotation of the watermark in counterclockwise degrees.
       */
      rotation?: number;
      /**
       * Watermark opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * Text used for watermarking
       */
      text: string;
      /**
       * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
       * example:
       * Helvetica
       */
      fontFamily?: string;
      /**
       * Size of the text in points.
       * example:
       * 10
       */
      fontSize?: number;
      /**
       * A foreground color of the text.
       * example:
       * #ffffff
       */
      fontColor?: string; // ^#[0-9a-fA-F]{6}$
      /**
       * Text style. Can be only italic, only bold, italic and bold, or none of these.
       */
      fontStyle?: ('bold' | 'italic')[];
    }
    /**
     * The document title.
     * example:
     * Nutrient Document Engine API Specification
     */
    export type Title = string | null;
    /**
     * URIAction
     */
    export interface URIAction {
      /**
       * Sub-action to execute after the action has been executed.
       */
      subAction?: {
        [key: string]: any;
      };
      type: 'uri';
      /**
       * example:
       * https://www.nutrient.io
       */
      uri: string;
    }
    /**
     * User
     * The user identifier.
     *
     * Note that Nutrient Document Engine does not provide any kind of user management and accepts
     * any string (or `null`) as a valid user ID.
     *
     * For records created or updated in the browser, the `user_id `is extracted from the
     * JSON Web Token (JWT) used for authentication.
     */
    export type User = string | null;
    /**
     * ValidatePDFAResult
     * PDF/A Validation report
     */
    export interface ValidatePDFAResult {
      /**
       * The level of PDF/A conformance. `None` if PDF is non-conformant.
       */
      Conformance?: string;
      /**
       * true if PDF/A is conformant, false otherwise.
       */
      IsValid?: boolean;
      ValidationLog?: {
        ValidationReport?: {
          Details?: {
            FailedChecks?: {
              /**
               * Number of failed checks.
               */
              '@Count'?: string;
              Check?: {
                /**
                 * ID of the failing check.
                 */
                '@ID'?: string;
                /**
                 * Count of this failing check.
                 */
                '@OccurenceCount'?: string;
                Occurence?: {
                  '@Context'?: string;
                  '@ObjReference'?: string;
                  /**
                   * Description of the failure.
                   */
                  '@Statement'?: string;
                };
              }[];
            };
          };
          ValidationProfile?: {
            '@Conformance'?: string;
            '@Level'?: string;
            '@Part'?: string;
          };
          ValidationResult?: {
            '@IsCompliant'?: string;
            '@Statement'?: string;
          };
        };
      };
    }
    /**
     * VerticalAlign
     * Alignment of the text along the vertical axis.
     *
     * Note that vertical align is a custom PSPDFKit extension that might not be honored by 3rd party readers.
     */
    export type VerticalAlign = 'top' | 'center' | 'bottom';
    export type WatermarkAction = /* Text */ TextWatermarkAction | /* Image */ ImageWatermarkAction;
    export interface WatermarkDimension {
      /**
       * Dimension value
       * example:
       * 100
       */
      value: number;
      /**
       * Dimension unit
       */
      unit: 'pt' | '%';
    }
    /**
     * WidgetAnnotation
     * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
     */
    export interface WidgetAnnotation {
      /**
       * The specification version that the record is compliant to.
       */
      v: 2;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/widget';
      pageIndex: /**
       * Page index of the annotation. 0 is the first page.
       * example:
       * 0
       */
      SchemasPageIndex;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      opacity?: /* Annotation opacity. 0 is fully transparent, 1 is fully opaque. */ AnnotationOpacity;
      pdfObjectId?: /* The PDF object ID of the annotation from the source PDF. */ PdfObjectId;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * See name property of the FormField schema for more details
       * example:
       * First-Name
       */
      formFieldName?: string;
      /**
       * A color of the annotation border.
       * example:
       * #ffffff
       */
      borderColor?: string; // ^#[0-9a-fA-F]{6}$
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      font?: /**
       * Font
       * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
       * example:
       * Helvetica
       */
      Font;
      fontSize?: /**
       * FontSizeInt
       * Size of the text in PDF points.
       * example:
       * 10
       */
      | FontSizeInt /**
         * FontSizeAuto
         * Size of the text that automatically adjusts to fit the bounding box.
         * example:
         * auto
         */
        | FontSizeAuto;
      fontColor?: /**
       * FontColor
       * A foreground color of the text.
       * example:
       * #ffffff
       */
      FontColor /* ^#[0-9a-fA-F]{6}$ */;
      fontStyle?: /* Text style. Can be only italic, only bold, italic and bold, or none of these. */ FontStyle;
      horizontalAlign?: /**
       * HorizontalAlign
       * Alignment of the text along the horizontal axis.
       */
      HorizontalAlign;
      verticalAlign?: /**
       * VerticalAlign
       * Alignment of the text along the vertical axis.
       *
       * Note that vertical align is a custom PSPDFKit extension that might not be honored by 3rd party readers.
       */
      VerticalAlign;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      backgroundColor?: /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      BackgroundColor /* ^#[0-9a-fA-F]{6}$ */;
    }
    /**
     * WidgetAnnotation
     * JSON representation of the form field widget annotation. Widget annotations are a type of annotation with the type always being 'pspdfkit/widget'.
     */
    export interface WidgetAnnotationV1 {
      /**
       * The specification version that the record is compliant to.
       */
      v: 1;
      /**
       * The type of the annotation.
       */
      type: 'pspdfkit/widget';
      /**
       * Page index of the annotation. 0 is the first page.
       */
      pageIndex: number;
      bbox: /**
       * Bounding box of the annotation within the page in a form [left, top, width, height].
       * example:
       * [
       *   255.10077620466092,
       *   656.7566095695641,
       *   145.91672653256705,
       *   18.390804597701162
       * ]
       */
      AnnotationBbox;
      action?: /**
       * Represents a PDF action.
       *
       * There are many different action types. You can learn more about their semantics
       * [here](https://www.nutrient.io/guides/ios/annotations/pdf-actions/).
       *
       * All actions have a `type` property. Depending on the type, the action object
       * includes additional properties.
       * example:
       * {
       *   "type": "goTo",
       *   "pageIndex": 0
       * }
       */
      Action;
      /**
       * Annotation opacity. 0 is fully transparent, 1 is fully opaque.
       */
      opacity?: number;
      /**
       * The PDF object ID of the annotation from the source PDF.
       */
      pdfObjectId?: number;
      /**
       * The unique Instant JSON identifier of the annotation.
       * example:
       * 01DNEDPQQ22W49KDXRFPG4EPEQ
       */
      id?: string;
      /**
       * Array of annotation flags.
       *
       * | Flag | Description |
       * | ---- | ----------- |
       * | noPrint | Don't print. |
       * | noZoom | Don't zoom with page. |
       * | noRotate | Don't rotate. |
       * | noView | Don't display, can be still printed. |
       * | hidden | Don't display, don't print, disable any interaction with user. |
       * | invisible | Ignore annotation AP stream. |
       * | readOnly | Don't allow the annotation to be deleted or its properties modified. |
       * | locked | Same as `readOnly` but allows changing annotation contents. |
       * | lockedContents | Don't allow the contents of the annotation to be modified. |
       */
      flags?: (
        | 'noPrint'
        | 'noZoom'
        | 'noRotate'
        | 'noView'
        | 'hidden'
        | 'invisible'
        | 'readOnly'
        | 'locked'
        | 'toggleNoView'
        | 'lockedContents'
      )[];
      /**
       * The date of the annotation creation. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      createdAt?: string; // date-time
      /**
       * The date of the last annotation update. ISO 8601 with full date, time, and time zone information
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      updatedAt?: string; // date-time
      /**
       * The name of the annotation used to identify the annotation.
       */
      name?: string;
      /**
       * The name of the creator of the annotation.
       */
      creatorName?: string;
      customData?: /**
       * Object of arbitrary properties attached to the annotations. PSPDFKit won't modify this data when processing annotations.
       * example:
       * {
       *   "foo": "bar"
       * }
       */
      AnnotationCustomData;
      /**
       * See name property of the FormFieldContent schema for more details
       * example:
       * First-Name
       */
      formFieldName?: string;
      /**
       * A color of the annotation border.
       * example:
       * #ffffff
       */
      borderColor?: string; // ^#[0-9a-fA-F]{6}$
      borderStyle?: /* BorderStyle */ BorderStyle;
      borderWidth?: number;
      font?: /**
       * Font
       * The font to render the text. Fonts are client specific, so you should only use fonts you know are present in the browser where they should be displayed. If a font isn't found, PSPDFKit will automatically fall back to a sans-serif font.
       * example:
       * Helvetica
       */
      Font;
      fontSize?: /**
       * FontSizeInt
       * Size of the text in PDF points.
       * example:
       * 10
       */
      | FontSizeInt /**
         * FontSizeAuto
         * Size of the text that automatically adjusts to fit the bounding box.
         * example:
         * auto
         */
        | FontSizeAuto;
      fontColor?: /**
       * FontColor
       * A foreground color of the text.
       * example:
       * #ffffff
       */
      FontColor /* ^#[0-9a-fA-F]{6}$ */;
      horizontalAlign?: /**
       * HorizontalAlign
       * Alignment of the text along the horizontal axis.
       */
      HorizontalAlign;
      verticalAlign?: /**
       * VerticalAlign
       * Alignment of the text along the vertical axis.
       *
       * Note that vertical align is a custom PSPDFKit extension that might not be honored by 3rd party readers.
       */
      VerticalAlign;
      rotation?: /**
       * Rotation
       * Counterclockwise annotation rotation in degrees.
       */
      AnnotationRotation;
      backgroundColor?: /**
       * BackgroundColor
       * A background color that will fill the bounding box.
       * example:
       * #000000
       */
      BackgroundColor /* ^#[0-9a-fA-F]{6}$ */;
    }
    export interface Word {
      bbox: /* Represents a rectangular region on the page. Both coordinates and directions are in PDF points with the origin at the top-left corner of the page. */ JsonContentsBbox;
      /**
       * The number of characters in the word.
       * example:
       * 4
       */
      characterCount: number;
      /**
       * The index of the first character of the word from the `characters` array.
       * example:
       * 0
       */
      firstCharacterIndex: number;
      /**
       * Specifies if the word has been identified from the OCR dictionary.
       * example:
       * true
       */
      isFromDictionary: boolean;
      /**
       * The actual word text.
       * example:
       * word
       */
      value: string;
    }
  }
}
declare namespace Paths {
  namespace ApiValidatePdfa {
    namespace Parameters {
      export type $0 = Components.Parameters.Password;
    }
  }
  namespace ApplyDocumentLayerRedactions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export type $200 = /* DocumentProperties */ Components.Schemas.DocumentProperties;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace ApplyDocumentRedactions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export type $200 = /* DocumentProperties */ Components.Schemas.DocumentProperties;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace BuildDocument {
    export type RequestBody = Components.Schemas.BuildInstructions;
    namespace Responses {
      export type $200 = Components.Responses.BuildResponseOk;
      export interface $400 {
        /**
         * example:
         * The request is malformed
         */
        details?: string;
        status?: 400 | 500;
        /**
         * example:
         * xy123zzdafaf
         */
        requestId?: string;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
      }
      export interface $401 {}
      export interface $422 {
        /**
         * example:
         * The request is malformed
         */
        details?: string;
        status?: 422;
        /**
         * example:
         * xy123zzdafaf
         */
        requestId?: string;
      }
    }
  }
  namespace BulkDeleteDocuments {
    namespace Parameters {
      export type DocumentId = string;
      export type EndDate = string; // date-time
      export type StartDate = string; // date-time
      export type Title = string;
    }
    export interface QueryParameters {
      title?: Parameters.Title;
      document_id?: Parameters.DocumentId;
      start_date?: Parameters.StartDate /* date-time */;
      end_date?: Parameters.EndDate /* date-time */;
    }
    namespace Responses {
      export interface $200 {
        /**
         * Number of documents successfully deleted
         */
        deleted_count?: number;
        /**
         * Number of documents that were skipped due to access restrictions or other issues
         */
        skipped_count?: number;
        /**
         * Total number of documents that matched the filter criteria
         */
        total_matched?: number;
      }
      export interface $400 {
        error?: {
          reason?:
            | 'missing_filter_parameters'
            | 'invalid_start_date'
            | 'invalid_end_date'
            | 'failed_to_bulk_delete_documents';
          description?: string;
        };
      }
      export interface $401 {}
    }
  }
  namespace CopyDocument {
    export interface RequestBody {
      /**
       * The ID of the original document.
       * example:
       * 7KPSA689RP53HB64GKKZX64XFV
       */
      document_id?: string;
      /**
       * The ID of the copy.
       * example:
       * 7KPS5BP7NVPZPFTEMN2PB6D3XY
       */
      new_document_id?: string;
      storage?: /* DocumentStorageConfiguration */ Components.Schemas.StorageConfiguration;
    }
    namespace Responses {
      export interface $200 {
        data: {
          /**
           * The ID of the newly created document.
           * example:
           * 7KPS5BP7NVPZPFTEMN2PB6D3XY
           */
          document_id: string;
        };
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CopyDocumentLayerWithInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $200 {
        createdAt: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        Components.Schemas.IsoDateTime;
        documentId: /**
         * The ID of the document.
         * example:
         * 7KPZW8XFGM4F1C92KWBK1B748M
         */
        Components.Schemas.DocumentId;
        errors: /* An array of errors encountered during the operation. */ Components.Schemas.Errors;
        password_protected: /**
         * Indicates whether the document is password protected.
         * example:
         * true
         */
        Components.Schemas.PasswordProtected;
        sourcePdfSha256: /**
         * SHA256 hash of the PDF file underlying the document.
         * example:
         * 1defd934dbbf77587eb9b7f45d162d2a3aea16c840a9e7cfa190fb2ea1f40a76
         */
        Components.Schemas.SourcePdfSha256;
        title: /**
         * The document title.
         * example:
         * Nutrient Document Engine API Specification
         */
        Components.Schemas.Title;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CopyDocumentWithInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $200 {
        createdAt: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        Components.Schemas.IsoDateTime;
        documentId: /**
         * The ID of the document.
         * example:
         * 7KPZW8XFGM4F1C92KWBK1B748M
         */
        Components.Schemas.DocumentId;
        errors: /* An array of errors encountered during the operation. */ Components.Schemas.Errors;
        password_protected: /**
         * Indicates whether the document is password protected.
         * example:
         * true
         */
        Components.Schemas.PasswordProtected;
        sourcePdfSha256: /**
         * SHA256 hash of the PDF file underlying the document.
         * example:
         * 1defd934dbbf77587eb9b7f45d162d2a3aea16c840a9e7cfa190fb2ea1f40a76
         */
        Components.Schemas.SourcePdfSha256;
        title: /**
         * The document title.
         * example:
         * Nutrient Document Engine API Specification
         */
        Components.Schemas.Title;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateDocumentAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      /* Represents a single annotation to be created. */
      | Components.Schemas.AnnotationCreateSingle
      | /* Represents multiple annotations to be created. */ Components.Schemas.AnnotationCreateMultiple;
    namespace Responses {
      export type $200 =
        /**
         * MultipleAnnotationsResponse
         * Response when multiple annotations are created / updated.
         */
        | Components.Schemas.AnnotationMultipleResponse
        | {
            data?: {
              annotation_id?: /**
               * Annotation ID, unique in scope of a single Instant Layer.
               * example:
               * 01DNEDPQQ22W49KDXRFPG4EPEQ
               */
              Components.Schemas.AnnotationId;
            };
          };
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace CreateDocumentAnnotationComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      annotationId: Parameters.AnnotationId;
    }
    export type RequestBody = Components.Schemas.CommentsCreate;
    namespace Responses {
      export type $200 = Components.Schemas.CommentsCreated;
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
      export type $422 = Components.Schemas.CommentsCreateErrors;
    }
  }
  namespace CreateDocumentBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = /* BookmarkRecord */ Components.Schemas.BookmarkRecord;
    namespace Responses {
      export interface $200 {
        data?: {
          id: string;
        };
      }
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace CreateDocumentComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.CommentsCreateWithRoot;
    namespace Responses {
      export type $200 = Components.Schemas.CommentsCreatedWithRoot;
      export interface $401 {}
      export interface $404 {}
      export type $422 = Components.Schemas.CommentsCreateErrorsWithRoot;
    }
  }
  namespace CreateDocumentFormField {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      formFields: /**
       * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
       * with the form field you are creating.
       * Note that the form field's group will be inherited by any widgets and values associated with it
       */
      Components.Schemas.FormFieldCreate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of the IDs for the newly created form fields
         */
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateDocumentFormFieldWidget {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      formFieldWidgets: /* A single widget in a document layer */ Components.Schemas.FormFieldWidgetCreate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateDocumentLayerAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      /* Represents multiple annotations to be created. */
      | Components.Schemas.AnnotationCreateMultiple
      | /* Represents a single annotation to be created. */ Components.Schemas.AnnotationCreateSingle;
    namespace Responses {
      export type $200 =
        /**
         * MultipleAnnotationsResponse
         * Response when multiple annotations are created / updated.
         */
        | Components.Schemas.AnnotationMultipleResponse
        | {
            data?: {
              id?: /**
               * Annotation ID, unique in scope of a single Instant Layer.
               * example:
               * 01DNEDPQQ22W49KDXRFPG4EPEQ
               */
              Components.Schemas.AnnotationId;
            };
          };
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace CreateDocumentLayerAnnotationComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      annotationId: Parameters.AnnotationId;
    }
    export type RequestBody = Components.Schemas.CommentsCreate;
    namespace Responses {
      export type $200 = Components.Schemas.CommentsCreated;
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
      export type $422 = Components.Schemas.CommentsCreateErrors;
    }
  }
  namespace CreateDocumentLayerBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = /* BookmarkRecord */ Components.Schemas.BookmarkRecord;
    namespace Responses {
      export interface $200 {
        data?: {
          id: string;
        };
      }
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace CreateDocumentLayerComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = Components.Schemas.CommentsCreateWithRoot;
    namespace Responses {
      export type $200 = Components.Schemas.CommentsCreatedWithRoot;
      export interface $401 {}
      export interface $404 {}
      export type $422 = Components.Schemas.CommentsCreateErrorsWithRoot;
    }
  }
  namespace CreateDocumentLayerFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      formFields: /**
       * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
       * with the form field you are creating.
       * Note that the form field's group will be inherited by any widgets and values associated with it
       */
      Components.Schemas.FormFieldCreate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of the form field IDs for the form fields that were successfully created.
         */
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateDocumentLayerRedactions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = /* CreateRedactions */ Components.Schemas.CreateRedactions;
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
        };
      }
      export interface $401 {}
      export interface $404 {}
      export type $422 = /* CreateRedactionsErrors */ Components.Schemas.CreateRedactionsErrors;
    }
  }
  namespace CreateDocumentLayerWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      formFieldWidgets: /* A single widget in a document layer */ Components.Schemas.FormFieldWidgetCreate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * IDs of the widgets that were successfully created
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateDocumentRedactions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = /* CreateRedactions */ Components.Schemas.CreateRedactions;
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
        };
      }
      export interface $401 {}
      export interface $404 {}
      export type $422 = /* CreateRedactionsErrors */ Components.Schemas.CreateRedactionsErrors;
    }
  }
  namespace CreateNewLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.LayerCreateWithSourceLayer;
    namespace Responses {
      export interface $200 {
        data?: Components.Schemas.LayerCreated;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace CreateSecret {
    namespace Parameters {
      export type SecretType = 'jwt' | 'dashboard_password' | 'secret_key_base';
    }
    export interface PathParameters {
      secretType: Parameters.SecretType;
    }
    export interface RequestBody {
      /**
       * The secret value.
       * example:
       * Secret value
       */
      secret: string;
      expiresAt?: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      Components.Schemas.IsoDateTime;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace DeleteDocument {
    namespace Parameters {
      export type DocumentId = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DeleteDocumentAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DeleteDocumentBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type BookmarkId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      bookmarkId: Parameters.BookmarkId;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace DeleteDocumentLayerAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DeleteDocumentLayerBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type BookmarkId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      bookmarkId: Parameters.BookmarkId;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace DeleteFontSubstitutions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DeleteFontSubstitutionsInLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DeleteLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DocumentApplyInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DocumentApplyInstructions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.BuildInstructions;
    namespace Responses {
      export interface $200 {
        data?: /* DocumentProperties */ Components.Schemas.DocumentProperties;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DocumentLayerApplyInstructions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = Components.Schemas.BuildInstructions;
    namespace Responses {
      export interface $200 {
        data?: /* DocumentProperties */ Components.Schemas.DocumentProperties;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentLayerPdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type Annotations = boolean;
      export type Comments = boolean;
      export type Conformance =
        | 'pdfa-1a'
        | 'pdfa-1b'
        | 'pdfa-2a'
        | 'pdfa-2u'
        | 'pdfa-2b'
        | 'pdfa-3a'
        | 'pdfa-3u';
      export type DocumentId = string;
      export type Flatten = boolean;
      export type LayerName = string;
      export interface Optimize {
        grayscaleText?: boolean;
        grayscaleGraphics?: boolean;
        grayscaleImages?: boolean;
        grayscaleFormFields?: boolean;
        grayscaleAnnotations?: boolean;
        disableImages?: boolean;
        mrcCompression?: boolean;
        imageOptimizationQuality?: number;
        /**
         * If set to `true`, the resulting PDF file will be linearized.
         * This means that the document will be optimized in a special way that allows it to be loaded faster over the network.
         * You need the `Linearization` feature to be enabled in your Nutrient Document Engine license in order to use this option.
         */
        linearize?: boolean;
      }
      export type PspdfkitPdfPassword = string;
      export type RenderApStreams = boolean;
      export type Source = boolean;
      export type Type = 'pdf' | 'pdfa';
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface QueryParameters {
      type?: Parameters.Type;
      source?: Parameters.Source;
      flatten?: Parameters.Flatten;
      render_ap_streams?: Parameters.RenderApStreams;
      annotations?: Parameters.Annotations;
      comments?: Parameters.Comments;
      optimize?: Parameters.Optimize;
      conformance?: Parameters.Conformance;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentLayerPdfPost {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      /**
       * The type of output file. Can be pdfa or pdf.
       * example:
       * pdfa
       */
      type: 'pdf' | 'pdfa';
      /**
       * If set to `true`, the originally uploaded version of the PDF file will be fetched.
       * The remaining properties are mutually exclusive with this property.
       */
      source?: boolean;
      /**
       * Determines whether a flattened version of the PDF file will be downloaded. If set to `true`,
       * the resulting PDF file will have its annotations burned into the document and will have no annotations.
       */
      flatten?: boolean;
      /**
       * If set to `true`, the resulting PDF file will have its custom AP streams rendered into the document.
       */
      render_ap_streams?: boolean;
      /**
       * If set to `true`, annotations will be included in the downloaded file
       */
      annotations?: boolean;
      /**
       * If set to `true`, comments will be included in the downloaded file.
       */
      comments?: boolean;
      /**
       * The level of conformance of the pdfa file. Defaults to `pdfa-1b` if the type is set to `pdfa` and conformance is not explicitly specified.
       * example:
       * pdfa-1a
       */
      conformance?:
        | 'pdfa-1a'
        | 'pdfa-1b'
        | 'pdfa-2a'
        | 'pdfa-2u'
        | 'pdfa-2b'
        | 'pdfa-3a'
        | 'pdfa-3u';
      optimize?: Components.Schemas.OptimizePdf;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentLayerWithInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentPdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type Annotations = boolean;
      export type Comments = boolean;
      export type Conformance =
        | 'pdfa-1a'
        | 'pdfa-1b'
        | 'pdfa-2a'
        | 'pdfa-2u'
        | 'pdfa-2b'
        | 'pdfa-3a'
        | 'pdfa-3u';
      export type DocumentId = string;
      export type Flatten = boolean;
      export type KeepSignatures = boolean;
      export interface Optimize {
        grayscaleText?: boolean;
        grayscaleGraphics?: boolean;
        grayscaleImages?: boolean;
        grayscaleFormFields?: boolean;
        grayscaleAnnotations?: boolean;
        disableImages?: boolean;
        mrcCompression?: boolean;
        imageOptimizationQuality?: number;
        /**
         * If set to `true`, the resulting PDF file will be linearized.
         * This means that the document will be optimized in a special way that allows it to be loaded faster over the network.
         * You need the `Linearization` feature to be enabled in your Nutrient Document Engine license in order to use this option.
         */
        linearize?: boolean;
      }
      export type PspdfkitPdfPassword = string;
      export type RenderApStreams = boolean;
      export type Source = boolean;
      export type Type = 'pdf' | 'pdfa';
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface QueryParameters {
      type?: Parameters.Type;
      source?: Parameters.Source;
      flatten?: Parameters.Flatten;
      render_ap_streams?: Parameters.RenderApStreams;
      annotations?: Parameters.Annotations;
      comments?: Parameters.Comments;
      optimize?: Parameters.Optimize;
      conformance?: Parameters.Conformance;
      keep_signatures?: Parameters.KeepSignatures;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentPdfPost {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = /* Download PDF */ Components.Schemas.DownloadPDF;
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace DownloadDocumentWithInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace EditAndDownloadDocumentPdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      operations?: /* An array of operations which can be applied to the document. */ Components.Schemas.DocumentOperations;
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace EditAndPersistDocumentPdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      operations?: /* An array of operations which can be applied to the document. */ Components.Schemas.DocumentOperations;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DocumentProperties */ Components.Schemas.DocumentProperties;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace ExpireSecret {
    namespace Parameters {
      export type SecretId = number;
      export type SecretType = 'jwt' | 'dashboard_password' | 'secret_key_base';
    }
    export interface PathParameters {
      secretType: Parameters.SecretType;
      secretId: Parameters.SecretId;
    }
    export interface RequestBody {
      expiresAt: /**
       * IsoDateTime
       * Date and time in ISO8601 format with timezone.
       * example:
       * 2019-09-16T15:05:03.712909Z
       */
      Components.Schemas.IsoDateTime;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace FetchDocumentAnnotationComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.CommentsList;
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace FetchDocumentInfo {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DocumentInfo */ Components.Schemas.DocumentInfo;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace FetchDocumentLayerAnnotationComments {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.CommentsList;
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace FetchDocumentLayerInfo {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DocumentInfo */ Components.Schemas.DocumentInfo;
      }
    }
  }
  namespace FetchDocumentProperties {
    namespace Parameters {
      export type DocumentId = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DocumentProperties */ Components.Schemas.DocumentProperties;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetAsyncJobStatus {
    namespace Parameters {
      export type JobId = string;
    }
    export interface PathParameters {
      jobId: Parameters.JobId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AsyncJobStatus;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetConfiguredFontSubstitutions {
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export interface $401 {}
    }
  }
  namespace GetDocumentAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export type $200 =
        /**
         * AnnotationRecord
         * Represents a PDF annotation.
         */
        Components.Schemas.AnnotationRecord;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
          /**
           * Indicates whether the returned annotations are not all of the document's
           * annotations.
           */
          truncated?: boolean;
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentAttachment {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AttachmentId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      attachmentId: Parameters.AttachmentId;
    }
    namespace Responses {
      /**
       * The binary content of the image file.
       * example:
       * <PNG data>
       */
      export type $200 = string; // binary
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentBookmarks {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          bookmarks?: /* BookmarkRecord */ Components.Schemas.BookmarkRecord[];
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentDigitalSignatures {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DigitalSignatures */ Components.Schemas.DigitalSignatures;
      }
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentEmbeddedFiles {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          embeddedFiles?: /* EmbeddedFile */ Components.Schemas.EmbeddedFile[];
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentFormField {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type FormFieldId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      formFieldId: Parameters.FormFieldId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.FormFieldWithWidgets;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentFormFieldValues {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          formFieldValues?: Components.Schemas.FormFieldValuesRecords;
        };
      }
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentFormFieldWidget {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type FormFieldWidgetId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      formFieldWidgetId: Parameters.FormFieldWidgetId;
    }
    namespace Responses {
      export type $200 =
        /* A single form field widget in a document layer and the form field it's associated with */ Components.Schemas.FormFieldWidgetWithFormField;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentFormFieldWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /* A single form field widget in a document layer and the form field it's associated with */ Components.Schemas.FormFieldWidgetWithFormField[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: Components.Schemas.FormFieldWithWidgets[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationVersion = 1 | 2;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface QueryParameters {
      annotation_version?: Parameters.AnnotationVersion;
    }
    namespace Responses {
      export type $200 =
        /**
         * Instant JSON
         * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
         */
        Components.Schemas.InstantJson;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      annotationId: Parameters.AnnotationId;
    }
    namespace Responses {
      export type $200 =
        /**
         * AnnotationRecord
         * Represents a PDF annotation.
         */
        Components.Schemas.AnnotationRecord;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
          /**
           * Indicates whether the returned annotations are not all of the document's
           * annotations.
           */
          truncated?: boolean;
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerBookmarks {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          bookmarks?: /* BookmarkRecord */ Components.Schemas.BookmarkRecord[];
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerDigitalSignatures {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: /* DigitalSignatures */ Components.Schemas.DigitalSignatures;
      }
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerEmbeddedFiles {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          embeddedFiles?: /* EmbeddedFile */ Components.Schemas.EmbeddedFile[];
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerFormField {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type FormFieldId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      formFieldId: Parameters.FormFieldId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.FormFieldWithWidgets;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerFormFieldValues {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          formFieldValues?: Components.Schemas.FormFieldValuesRecords;
        };
      }
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: Components.Schemas.FormFieldWithWidgets[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export type $200 =
        /**
         * Instant JSON
         * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
         */
        Components.Schemas.InstantJson;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerPageAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
          /**
           * Indicates whether the returned annotations are not all of the document's
           * annotations.
           */
          truncated?: boolean;
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerPageHighlightedText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        /**
         * All highlighted text on the page.
         */
        data?: /* A piece highlighted text along with corresponding markup annotation. */ Components.Schemas.HighlightedText[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerPageText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        /**
         * All lines of text on the page.
         */
        textLines?: /* A line of text on the document's page. */ Components.Schemas.TextLine[];
      }
      export interface $401 {}
      /**
       * example:
       * Parameter 'page_index' is invalid or out of bounds.
       */
      export type $404 = string;
    }
  }
  namespace GetDocumentLayerText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      /**
       * Text contents for all pages in a layer.
       */
      export type $200 =
        /* An object with text lines on the document's page. */ Components.Schemas.PageText[];
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerWidget {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type FormFieldWidgetId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      formFieldWidgetId: Parameters.FormFieldWidgetId;
    }
    namespace Responses {
      export type $200 =
        /* A single form field widget in a document layer and the form field it's associated with */ Components.Schemas.FormFieldWidgetWithFormField;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: /* A single form field widget in a document layer and the form field it's associated with */ Components.Schemas.FormFieldWidgetWithFormField[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentLayerXfdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentOutline {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          outline?: /**
           * OutlineElements
           * An array of outline elements.
           */
          Components.Schemas.OutlineElements;
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentPageAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        data?: {
          annotations?: /**
           * AnnotationRecord
           * Represents a PDF annotation.
           */
          Components.Schemas.AnnotationRecord[];
          /**
           * Indicates whether the returned annotations are not all of the document's
           * annotations.
           */
          truncated?: boolean;
        };
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentPageHighlightedText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        /**
         * All highlighted text on the page.
         */
        data?: /* A piece highlighted text along with corresponding markup annotation. */ Components.Schemas.HighlightedText[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentPageText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      pageIndex: Parameters.PageIndex;
    }
    namespace Responses {
      export interface $200 {
        /**
         * All lines of text on the page.
         */
        textLines?: /* A line of text on the document's page. */ Components.Schemas.TextLine[];
      }
      export interface $401 {}
      /**
       * example:
       * Parameter 'page_index' is invalid or out of bounds.
       */
      export type $404 = string;
    }
  }
  namespace GetDocumentText {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      /**
       * Text contents for all pages in a document.
       */
      export type $200 =
        /* An object with text lines on the document's page. */ Components.Schemas.PageText[];
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetDocumentXfdf {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetFontSubstitutions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetFontSubstitutionsInLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetFonts {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontFile
         * A font used in the document.
         */
        Components.Schemas.FontFile[];
      }
      export interface $401 {}
    }
  }
  namespace GetFontsInLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontFile
         * A font used in the document.
         */
        Components.Schemas.FontFile[];
      }
      export interface $401 {}
    }
  }
  namespace GetGlobalFonts {
    namespace Responses {
      export interface $200 {
        data?: /**
         * FontFile
         * A font used in the document.
         */
        Components.Schemas.FontFile[];
      }
      export interface $401 {}
    }
  }
  namespace GetOcgLayers {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export type $200 =
        /**
         * OCGLayerResponse
         * Response for OCG Layer
         * example:
         * {
         *   "ocgs": [
         *     {
         *       "name": "Option 1",
         *       "ocgId": 118,
         *       "radioGroup": 0
         *     },
         *     {
         *       "name": "Option 2",
         *       "ocgId": 108,
         *       "radioGroup": 0
         *     },
         *     {
         *       "layers": [
         *         {
         *           "name": "Nested Layer 1",
         *           "ocgId": 86
         *         },
         *         {
         *           "name": "Nested Layer 2",
         *           "ocgId": 72
         *         }
         *       ],
         *       "name": "Nested Layers",
         *       "ocgId": 121
         *     },
         *     {
         *       "layers": [
         *         {
         *           "name": "Layer 1",
         *           "ocgId": 86
         *         },
         *         {
         *           "name": "Layer 2",
         *           "ocgId": 72
         *         }
         *       ],
         *       "name": "Grouped layers"
         *     }
         *   ]
         * }
         */
        Components.Schemas.OCGLayerResponse;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetOcgLayersInLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    namespace Responses {
      export type $200 =
        /**
         * OCGLayerResponse
         * Response for OCG Layer
         * example:
         * {
         *   "ocgs": [
         *     {
         *       "name": "Option 1",
         *       "ocgId": 118,
         *       "radioGroup": 0
         *     },
         *     {
         *       "name": "Option 2",
         *       "ocgId": 108,
         *       "radioGroup": 0
         *     },
         *     {
         *       "layers": [
         *         {
         *           "name": "Nested Layer 1",
         *           "ocgId": 86
         *         },
         *         {
         *           "name": "Nested Layer 2",
         *           "ocgId": 72
         *         }
         *       ],
         *       "name": "Nested Layers",
         *       "ocgId": 121
         *     },
         *     {
         *       "layers": [
         *         {
         *           "name": "Layer 1",
         *           "ocgId": 86
         *         },
         *         {
         *           "name": "Layer 2",
         *           "ocgId": 72
         *         }
         *       ],
         *       "name": "Grouped layers"
         *     }
         *   ]
         * }
         */
        Components.Schemas.OCGLayerResponse;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace GetSecrets {
    namespace Parameters {
      export type SecretType = 'jwt' | 'dashboard_password' | 'secret_key_base';
    }
    export interface PathParameters {
      secretType: Parameters.SecretType;
    }
    namespace Responses {
      export type $200 = {
        /**
         * Secret's ID, unique within the specified type.
         * example:
         * 1
         */
        id?: number;
        expiresAt?: /**
         * IsoDateTime
         * Date and time in ISO8601 format with timezone.
         * example:
         * 2019-09-16T15:05:03.712909Z
         */
        Components.Schemas.IsoDateTime;
      }[];
      export interface $401 {}
    }
  }
  namespace InspectDigitalSignatures {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type PspdfkitPdfPassword = string;
    }
    export interface RequestBody {
      /**
       * The binary content of a PDF file.
       * example:
       * <PDF data>
       */
      file?: string; // binary
    }
    namespace Responses {
      export interface $200 {
        data?: /* DigitalSignatures */ Components.Schemas.DigitalSignatures;
      }
      export interface $401 {}
      export interface $403 {}
    }
  }
  namespace LayerApplyInstantJson {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      'instant.json'?: /**
       * Instant JSON
       * Instant JSON is a format for bringing annotations and bookmarks into a modern format while keeping all important properties to make the Instant JSON spec work with PDF.
       */
      Components.Schemas.InstantJson;
    }
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace ListDocuments {
    namespace Parameters {
      export type CountRemaining = boolean;
      export type Cursor = string;
      export type OrderBy = 'title' | 'created_at';
      export type OrderDirection = 'asc' | 'desc';
      export type PageSize = number;
      export type Title = string;
    }
    export interface QueryParameters {
      page_size?: Parameters.PageSize;
      cursor?: Parameters.Cursor;
      title?: Parameters.Title;
      order_by?: Parameters.OrderBy;
      order_direction?: Parameters.OrderDirection;
      count_remaining?: Parameters.CountRemaining;
    }
    namespace Responses {
      export interface $200 {
        data: /* DocumentProperties */ Components.Schemas.DocumentProperties[];
        /**
         * Base64 URL encoded cursor for fetching next page
         */
        next_cursor?: /* Base64 URL encoded cursor for fetching next page */ string | null;
        /**
         * Base64 URL encoded cursor for fetching previous page
         */
        prev_cursor?: /* Base64 URL encoded cursor for fetching previous page */ string | null;
        /**
         * Total number of documents
         */
        document_count: number;
        /**
         * Number of documents before the current page. Only returned when `count_remaining` parameter is set to `true`.
         */
        prev_document_count?: number;
        /**
         * Number of documents after the current page. Only returned when `count_remaining` parameter is set to `true`.
         */
        next_document_count?: number;
      }
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace ListLayers {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    namespace Responses {
      export interface $200 {
        data?: string[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace MigrateDocumentAssets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.MigrateDocumentAssetsRequest;
    namespace Responses {
      export type $202 = Components.Schemas.MigrateDocumentAssetsResponse;
      export type $400 = Components.Schemas.MigrateDocumentAssetsError;
      export interface $401 {}
    }
  }
  namespace PrerenderDocument {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.Prerender;
    namespace Responses {
      export interface $202 {}
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace ProcessOfficeTemplate {
    export interface RequestBody {
      model?: Components.Schemas.OfficeTemplateModel;
      /**
       * The binary content of the document to process.
       * example:
       * <DOCX data>
       */
      document?: string; // binary
    }
    namespace Responses {
      export type $200 = Components.Responses.BuildResponseOk;
      export type $400 = Components.Schemas.ErrorResponse;
      export interface $401 {}
    }
  }
  namespace RefreshDocumentLayerSignatures {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      /* RefreshDigitalSignatures */ Components.Schemas.RefreshDigitalSignatures;
    namespace Responses {
      export interface $200 {
        data?: /**
         * DigitalSignature
         * Represents a digital signature associated with a portion of the document.
         * A signature's status is expressed via two properties:
         *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
         *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
         */
        Components.Schemas.DigitalSignature;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace RefreshDocumentSignatures {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      /* RefreshDigitalSignatures */ Components.Schemas.RefreshDigitalSignatures;
    namespace Responses {
      export interface $200 {
        data?: /**
         * DigitalSignature
         * Represents a digital signature associated with a portion of the document.
         * A signature's status is expressed via two properties:
         *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
         *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
         */
        Components.Schemas.DigitalSignature;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace RemoveDocumentAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.DeleteAnnotations;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RemoveDocumentFormFieldWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      | {
          /**
           * An array of widget IDs
           * example:
           * [
           *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
           *   "01DNEDPQQ22W49KDXRFPG4EPEM"
           * ]
           */
          formFieldWidgetIds: string[];
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        }
      | {
          formFieldWidgetIds: 'all';
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        };
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of IDs for the widgets that were successfully deleted
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RemoveDocumentFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      | {
          /**
           * An array of form field IDs
           * example:
           * [
           *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
           *   "01DNEDPQQ22W49KDXRFPG4EPEM"
           * ]
           */
          formFieldIds: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId[];
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        }
      | {
          formFieldIds: 'all';
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        };
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of IDs for the form fields that were successfully deleted
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RemoveDocumentLayerAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = Components.Schemas.DeleteAnnotations;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RemoveDocumentLayerFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      | {
          /**
           * An array of form field IDs
           * example:
           * [
           *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
           *   "01DNEDPQQ22W49KDXRFPG4EPEM"
           * ]
           */
          formFieldIds: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId[];
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        }
      | {
          formFieldIds: 'all';
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        };
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of IDs for the form fields that were successfully deleted
         * example:
         * [
         *   {
         *     "id": "01DNEDPQQ22W49KDXRFPG4EPEQ"
         *   },
         *   {
         *     "id": "01DNEDPQQ22W49KDXRFPG4EPEM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RemoveDocumentLayerWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      | {
          /**
           * An array of widget IDs
           * example:
           * [
           *   "01DNEDPQQ22W49KDXRFPG4EPEQ",
           *   "01DNEDPQQ22W49KDXRFPG4EPEM"
           * ]
           */
          formFieldWidgetIds: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId[];
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        }
      | {
          formFieldWidgetIds: 'all';
          user_id?: /**
           * User
           * The user identifier.
           *
           * Note that Nutrient Document Engine does not provide any kind of user management and accepts
           * any string (or `null`) as a valid user ID.
           *
           * For records created or updated in the browser, the `user_id `is extracted from the
           * JSON Web Token (JWT) used for authentication.
           */
          Components.Schemas.User;
        };
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of IDs for the widgets that were successfully deleted
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace RenderDocumentLayerPage {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type Height = number;
      export type LayerName = string;
      export type OcgLayers = number[];
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
      export type RenderApStreams = boolean;
      export type Width = number;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      pageIndex: Parameters.PageIndex;
    }
    export interface QueryParameters {
      width?: Parameters.Width;
      height?: Parameters.Height;
      render_ap_streams?: Parameters.RenderApStreams;
      ocg_layers?: Parameters.OcgLayers;
    }
    namespace Responses {
      /**
       * example:
       * <image file>
       */
      export type $200 = string; // binary
      export interface $400 {}
      export interface $401 {}
      /**
       * example:
       * Parameter 'page_index' is invalid or out of bounds.
       */
      export type $404 = string;
    }
  }
  namespace RenderDocumentPage {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type Height = number;
      export type OcgLayers = number[];
      export type PageIndex = number;
      export type PspdfkitPdfPassword = string;
      export type RenderApStreams = boolean;
      export type Width = number;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      pageIndex: Parameters.PageIndex;
    }
    export interface QueryParameters {
      width?: Parameters.Width;
      height?: Parameters.Height;
      render_ap_streams?: Parameters.RenderApStreams;
      ocg_layers?: Parameters.OcgLayers;
    }
    namespace Responses {
      /**
       * example:
       * <image file>
       */
      export type $200 = string; // binary
      export interface $400 {}
      export interface $401 {}
      /**
       * example:
       * Parameter 'page_index' is invalid or out of bounds.
       */
      export type $404 = string;
    }
  }
  namespace RevokeJwt {
    export interface RequestBody {
      jwts?: /**
       * A JSON Web Token.
       * example:
       * eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJyZWFkLWRvY3VtZW50Iiwid3JpdGUiLCJkb3dubG9hZCJdLCJkb2N1bWVudF9pZCI6IjdLUFNKTkZCVkpFNzlXR0IxM05DRzdTMlgzIiwibGF5ZXIiOiJwUUNHREVpVVFFWTdleEJfcW5zeC1BIiwiaWF0IjoxNjYwOTA4ODk0LCJleHAiOjE2NjExNjgwOTQsImp0aSI6IjU5OTAwZDVmLTIyMDgtNDNjMy1iYzk3LWMxMjgzNDI3NmM4YyJ9.BtBbivWY2cC3R_8tm1j_GxtcQFIvmGkTSsz78EXiJEsTUCkRcfZWN2lOsI0Dn2-M6sG21QSbToEhVMvL5r_4sg
       */
      Components.Schemas.JWT[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * List of successfully revoked JWTs.
         */
        data?: /**
         * A JSON Web Token.
         * example:
         * eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJyZWFkLWRvY3VtZW50Iiwid3JpdGUiLCJkb3dubG9hZCJdLCJkb2N1bWVudF9pZCI6IjdLUFNKTkZCVkpFNzlXR0IxM05DRzdTMlgzIiwibGF5ZXIiOiJwUUNHREVpVVFFWTdleEJfcW5zeC1BIiwiaWF0IjoxNjYwOTA4ODk0LCJleHAiOjE2NjExNjgwOTQsImp0aSI6IjU5OTAwZDVmLTIyMDgtNDNjMy1iYzk3LWMxMjgzNDI3NmM4YyJ9.BtBbivWY2cC3R_8tm1j_GxtcQFIvmGkTSsz78EXiJEsTUCkRcfZWN2lOsI0Dn2-M6sG21QSbToEhVMvL5r_4sg
         */
        Components.Schemas.JWT[];
      }
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace RotateSecret {
    namespace Parameters {
      export type SecretType = 'jwt' | 'dashboard_password' | 'secret_key_base';
    }
    export interface PathParameters {
      secretType: Parameters.SecretType;
    }
    export interface RequestBody {
      /**
       * New secret value
       * example:
       * New secret value
       */
      secret: string;
    }
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace SearchDocument {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type CaseSensitive = boolean;
      export type DocumentId = string;
      export type IncludeAnnotations = boolean;
      export type Limit = number;
      export type PspdfkitPdfPassword = string;
      export type Q =
        | string
        | string /**
         * - `credit-card-number` — matches a number with 13 to 19 digits that begins with 1—6.
         * Spaces and `-` are allowed anywhere in the number.
         * - `date` — matches date formats such as `mm/dd/yyyy`, `mm/dd/yy`, `dd/mm/yyyy`, and `dd/mm/yy`.
         * It rejects any days greater than 31 or months greater than 12 and accepts a leading 0 in front of a single-digit day or month.
         * The delimiter can be `-`, `.`, or `/`.
         * - `email-address` — matches an email address. Expects the format of `*@*.*` with at least two levels of the domain name.
         * - `international-phone-number` — matches international phone numbers.
         * The number can have 7 to 15 digits with spaces or `-` occurring anywhere within the number, and it must have prefix of `+` or `00`.
         * - `ipv4` — matches an IPv4 address with an optional mask at the end.
         * - `ipv6` — matches a full and compressed IPv6 address as defined in [RFC 2373](http://www.faqs.org/rfcs/rfc2373.html).
         * - `mac-address` — matches a MAC address with either `-` or `:` as a delimiter.
         * - `north-american-phone-number` — matches North American-style phone numbers.
         * NANPA standardization is used with international support.
         * - `social-security-number` — matches a social security number.
         * Expects the format of `XXX-XX-XXXX` or `XXXXXXXXX`, with X denoting digits.
         * - `time` — matches time formats such as `00:00:00`, `00:00`, and `00:00 PM`. 12- and 24-hour formats are allowed.
         * Seconds and AM/PM denotation are both optional.
         * - `url` — matches a URL with a prefix of `http` or `https`, with an optional subdomain.
         * - `us-zip-code` — matches a USA-style zip code. The format expected is `XXXXX`, `XXXXX-XXXX` or `XXXXX/XXXX`.
         * - `vin` — matches US and ISO Standard 3779 Vehicle Identification Number.
         * The format expects 17 characters, with the last 5 characters being numeric. `I`, `i`, `O`, `o` ,`Q`, `q`, and `_` characters are not allowed.
         * example:
         * email-address
         */
        | Components.Schemas.SearchPreset;
      export type Start = number;
      export type Type = 'text' | 'regex' | 'preset';
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface QueryParameters {
      q: Parameters.Q;
      type?: Parameters.Type;
      start?: Parameters.Start;
      limit?: Parameters.Limit;
      include_annotations?: Parameters.IncludeAnnotations;
      case_sensitive?: Parameters.CaseSensitive;
    }
    namespace Responses {
      export interface $200 {
        data?: /**
         * SearchResults
         * An array of search results.
         */
        Components.Schemas.SearchResults;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace SignDocument {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      /**
       * CreateDigitalSignature
       * example:
       * {
       *   "signatureType": "cades",
       *   "flatten": false,
       *   "appearance": {
       *     "mode": "signatureOnly",
       *     "contentType": "image/png",
       *     "showWatermark": true,
       *     "showSignDate": true,
       *     "showSigner": true,
       *     "showReason": true,
       *     "showLocation": true
       *   },
       *   "position": {
       *     "pageIndex": 0,
       *     "rect": [
       *       0,
       *       0,
       *       100,
       *       100
       *     ]
       *   },
       *   "cadesLevel": "b-lt",
       *   "signatureContainer": "raw",
       *   "signingToken": "user-1-with-rights",
       *   "signatureMetadata": {
       *     "signerName": "John Appleseed",
       *     "signatureReason": "accepted",
       *     "signatureLocation": "Vienna"
       *   }
       * }
       */
      Components.Schemas.DigitalSignatureCreate;
    namespace Responses {
      export interface $200 {
        data?: {
          signature?: /**
           * DigitalSignature
           * Represents a digital signature associated with a portion of the document.
           * A signature's status is expressed via two properties:
           *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
           *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
           */
          Components.Schemas.DigitalSignature;
        };
      }
      export interface $400 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace SignDocumentLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      /**
       * CreateDigitalSignature
       * example:
       * {
       *   "signatureType": "cades",
       *   "flatten": false,
       *   "appearance": {
       *     "mode": "signatureOnly",
       *     "contentType": "image/png",
       *     "showWatermark": true,
       *     "showSignDate": true,
       *     "showSigner": true,
       *     "showReason": true,
       *     "showLocation": true
       *   },
       *   "position": {
       *     "pageIndex": 0,
       *     "rect": [
       *       0,
       *       0,
       *       100,
       *       100
       *     ]
       *   },
       *   "cadesLevel": "b-lt",
       *   "signatureContainer": "raw",
       *   "signingToken": "user-1-with-rights",
       *   "signatureMetadata": {
       *     "signerName": "John Appleseed",
       *     "signatureReason": "accepted",
       *     "signatureLocation": "Vienna"
       *   }
       * }
       */
      Components.Schemas.DigitalSignatureCreate;
    namespace Responses {
      export interface $200 {
        data?: /**
         * DigitalSignature
         * Represents a digital signature associated with a portion of the document.
         * A signature's status is expressed via two properties:
         *   - **integrity**, which guarantees that the content covered by the signature byte-range hasn't changed since the signature has been applied.
         *   - **validity**, which guarantees that the entity who applied the signature is who they claim to be.
         */
        Components.Schemas.DigitalSignature;
      }
      export interface $400 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace SignFile {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type PspdfkitPdfPassword = string;
    }
    export interface RequestBody {
      /**
       * The binary content of a PDF file.
       * example:
       * <PDF data>
       */
      file?: string; // binary
      data?: /**
       * CreateDigitalSignature
       * example:
       * {
       *   "signatureType": "cades",
       *   "flatten": false,
       *   "appearance": {
       *     "mode": "signatureOnly",
       *     "contentType": "image/png",
       *     "showWatermark": true,
       *     "showSignDate": true,
       *     "showSigner": true,
       *     "showReason": true,
       *     "showLocation": true
       *   },
       *   "position": {
       *     "pageIndex": 0,
       *     "rect": [
       *       0,
       *       0,
       *       100,
       *       100
       *     ]
       *   },
       *   "cadesLevel": "b-lt",
       *   "signatureContainer": "raw",
       *   "signingToken": "user-1-with-rights",
       *   "signatureMetadata": {
       *     "signerName": "John Appleseed",
       *     "signatureReason": "accepted",
       *     "signatureLocation": "Vienna"
       *   }
       * }
       */
      Components.Schemas.DigitalSignatureCreate;
      /**
       * The watermark image to be used as part of the signature's appearance
       * example:
       * <Image data>
       */
      image?: string; // binary
      /**
       * The graphic image to be used as part of the signature's appearance
       * example:
       * <Image data>
       */
      graphicImage?: string; // binary
    }
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
    }
  }
  namespace UpdateDocumentAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      annotationId: Parameters.AnnotationId;
    }
    export type RequestBody =
      /* Represents a single annotation to be updated. */ Components.Schemas.AnnotationUpdate;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody =
      /* Represents multiple annotations to be updated. */ Components.Schemas.AnnotationUpdateMultiple;
    namespace Responses {
      export type $200 =
        /**
         * MultipleAnnotationsResponse
         * Response when multiple annotations are created / updated.
         */
        Components.Schemas.AnnotationMultipleResponse;
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type BookmarkId = string;
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      bookmarkId: Parameters.BookmarkId;
    }
    export type RequestBody = /* BookmarkRecord */ Components.Schemas.BookmarkRecord;
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace UpdateDocumentFormField {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      formFields: /**
       * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
       * with the form field you are updating while dropping previously associated widgets.
       * Note that the form field's group will be inherited by any widgets and values associated with it
       */
      Components.Schemas.FormFieldUpdate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * An array of IDs for the form fields that were updated successfully.
         */
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UpdateDocumentFormFieldValues {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export type RequestBody = Components.Schemas.FormFieldValueUpdate;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentFormFieldWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      formFieldWidgets: /**
       * Note that you cannot set the group for a widget.
       * The widget will inherit the group of the form field it is associated with.
       */
      Components.Schemas.FormFieldWidgetUpdate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UpdateDocumentLayerAnnotation {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type AnnotationId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      annotationId: Parameters.AnnotationId;
    }
    export type RequestBody =
      /* Represents a single annotation to be updated. */ Components.Schemas.AnnotationUpdate;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentLayerAnnotations {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody =
      /* Represents multiple annotations to be updated. */ Components.Schemas.AnnotationUpdateMultiple;
    namespace Responses {
      export type $200 =
        /**
         * MultipleAnnotationsResponse
         * Response when multiple annotations are created / updated.
         */
        Components.Schemas.AnnotationMultipleResponse;
      export interface $401 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentLayerBookmark {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type BookmarkId = string;
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
      bookmarkId: Parameters.BookmarkId;
    }
    export type RequestBody = /* BookmarkRecord */ Components.Schemas.BookmarkRecord;
    namespace Responses {
      export interface $200 {}
      export interface $400 {}
      export interface $401 {}
    }
  }
  namespace UpdateDocumentLayerFormFieldValues {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export type RequestBody = Components.Schemas.FormFieldValueUpdate;
    namespace Responses {
      export interface $200 {}
      export interface $401 {}
      export interface $403 {}
      export interface $404 {}
      export interface $422 {}
    }
  }
  namespace UpdateDocumentLayerFormFields {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      formFields: /**
       * Any widget IDs you set in the `content.annotationIds` field will automatically associate those widgets
       * with the form field you are updating while dropping previously associated widgets.
       * Note that the form field's group will be inherited by any widgets and values associated with it
       */
      Components.Schemas.FormFieldUpdate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        data?: {
          id?: /**
           * RecordId
           * An unique Instant JSON identifier of the record. Must be unique in a layer.
           * example:
           * 01DNEDPQQ22W49KDXRFPG4EPEQ
           */
          Components.Schemas.RecordId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UpdateDocumentLayerWidgets {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      formFieldWidgets: /**
       * Note that you cannot set the group for a widget.
       * The widget will inherit the group of the form field it is associated with.
       */
      Components.Schemas.FormFieldWidgetUpdate[];
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        /**
         * IDs of the widgets that were successfully updated
         * example:
         * [
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQK9KZ"
         *   },
         *   {
         *     "id": "7KPSXX1NMNJ2WFDKN7BKQKMM"
         *   }
         * ]
         */
        data?: {
          id?: /**
           * A unique identifier for the form field widget. It is unique in a layer
           * example:
           * 7KPSXX1NMNJ2WFDKN7BKQK9KZE
           */
          Components.Schemas.FormFieldWidgetId;
        }[];
      }
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UpdateFontSubstitutions {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
    }
    export interface RequestBody {
      fontSubstitutions: /**
       * FontSubstitutionList
       * A list of font substitutions.
       *
       * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
       */
      Components.Schemas.FontSubstitutionList;
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export type $400 =
        /**
         * BatchOperationResult
         * This is the response of a batch operation.
         *
         * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
         * - The request succeeds
         * - The request fails completely
         * - The request fails partially
         * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
         * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
         * for the 2 form fields that were created successfully
         *
         * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
         *
         * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
         * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
         * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
         * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
         *
         * The status field of this response will be the same as the HTTP status code is returned along with the response.
         *
         * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
         * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
         * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
         * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
         * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
         * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
         */
        Components.Schemas.BatchOperationResult;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UpdateFontSubstitutionsInLayer {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type DocumentId = string;
      export type LayerName = string;
      export type PspdfkitPdfPassword = string;
    }
    export interface PathParameters {
      documentId: Parameters.DocumentId;
      layerName: Parameters.LayerName;
    }
    export interface RequestBody {
      fontSubstitutions: /**
       * FontSubstitutionList
       * A list of font substitutions.
       *
       * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
       */
      Components.Schemas.FontSubstitutionList;
    }
    namespace Responses {
      /**
       * BatchOperationResult
       * This is the response of a batch operation.
       *
       * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
       * - The request succeeds
       * - The request fails completely
       * - The request fails partially
       * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
       * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
       * for the 2 form fields that were created successfully
       *
       * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
       *
       * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
       * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
       * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
       * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
       *
       * The status field of this response will be the same as the HTTP status code is returned along with the response.
       *
       * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
       * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
       * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
       * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
       * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
       * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
       */
      export interface $200 {
        /**
         * A text summary of the status of the request
         * example:
         * Operation was partially successful
         */
        details?: string;
        request_id?: string;
        /**
         * If all the items in the batch request were successful, then the status will be a success.
         * A partial_failure will occur if only a few of the items in the batch request succeeded.
         * Failure is when none of the items in the batch succeed.
         */
        result?: 'partial_failure' | 'success' | 'failure';
        /**
         * HTTP status code for the request. The status code is 200 if the request was processed.
         * This does not have anything to do with the result - the status code will be 200 even if part of the
         * request failed. In the case of total failures such as malformed JSON, or document not found,
         * this status will be other than 200.
         */
        status?: 200 | 400 | 500;
        /**
         * List of failing paths.
         */
        failingPaths?: {
          /**
           * The index for array items will point to the item in the array Document Engine received in your request as opposed to the data array we are sending in this response.
           * example:
           * $.property[0]
           */
          path?: string;
          /**
           * example:
           * Missing required property
           */
          details?: string;
        }[];
        data?: /**
         * FontSubstitutionList
         * A list of font substitutions.
         *
         * Ordering matters -  As names could match multiple patterns, we have to stress that order matters when creating or replacing font substitutions.
         */
        Components.Schemas.FontSubstitutionList;
      }
      export type $400 =
        /**
         * BatchOperationResult
         * This is the response of a batch operation.
         *
         * An example of a batch operation is a POST request to `{base_url}/form-fields`. For any request to a batch endpoint, one of three things can happen:
         * - The request succeeds
         * - The request fails completely
         * - The request fails partially
         * For example, if you attempt to create 3 form fields in one request and the creation of 1 of those fields is unsuccessful,
         * the `failingPaths` attribute in this response will contain details of the failure, while the `data` attribute will contain the IDs
         * for the 2 form fields that were created successfully
         *
         * The `path` in `failingPaths[index].path` corresponds to the request JSON you sent to Document Engine.
         *
         * For example, when you send a DELETE request to `/api/documents/:documentId/form-field-widgets` with body
         * `{ formFieldWidgetIds: ["widgetId1", "widgetId2", "widgetId3"]}`,
         * If Document Engine ran into a problem deleting "widgetId2", say, the record didn't exist, the path in `failingPaths` would be `$.formFieldWidgetIds[1]`
         * where `[1]` is the index of the failing item in the request's `formFieldWidgetIds` array.
         *
         * The status field of this response will be the same as the HTTP status code is returned along with the response.
         *
         * These are the HTTP status codes you can expect to receive along with this response from Document Engine for different scenarios of your request:
         * - `success`: Document Engine successfully created/updated/deleted all of the items in the batch (Status code: 200)
         * - `partial_failure:` Document Engine successfully created/updated/deleted some, not all of the items in the batch (Status code: 200)
         * - `failure`: Document Engine was able to parse the request, but could not successfully create/update/delete any of the items in the batch (Status code: 200)
         * - `failure`: The request is badly formed, e.g. Document Engine was unable to parse the JSON (Status code: 400)
         * - `failure`: Document Engine doesn't know what went wrong (Status code: 500)
         */
        Components.Schemas.BatchOperationResult;
      export interface $401 {}
      export interface $404 {}
    }
  }
  namespace UploadDocument {
    export interface HeaderParameters {
      'pspdfkit-pdf-password'?: Parameters.PspdfkitPdfPassword;
    }
    namespace Parameters {
      export type PspdfkitPdfPassword = string;
    }
    export type RequestBody =
      /* Add Document from Upload */
      | Components.Schemas.CreateDocumentUpload
      | /* Add Document with Instructions */ Components.Schemas.CreateDocumentInstructions
      | /* Add Document from URL */ Components.Schemas.CreateDocumentUrl;
    namespace Responses {
      export interface $200 {
        data?: Components.Schemas.DocumentCreated;
      }
      export interface $401 {}
    }
  }
  namespace ValidatePdfa {
    export interface RequestBody {
      /**
       * PDF/A file on which to perform validation.
       */
      file?: string; // binary
    }
    namespace Responses {
      export type $200 =
        /**
         * ValidatePDFAResult
         * PDF/A Validation report
         */
        Components.Schemas.ValidatePDFAResult;
      export interface $400 {}
      export interface $401 {}
    }
  }
}

export interface OperationMethods {
  /**
   * list-documents - List Documents
   *
   * Lists documents with cursor-based pagination support. Documents can be sorted and filtered.
   *
   * The response includes a list of documents along with pagination metadata (next_cursor and prev_cursor)
   * and total document count. The cursors are Base64 URL encoded JSON arrays containing direction and
   * cursor information used for pagination.
   */
  'list-documents'(
    parameters?: Parameters<Paths.ListDocuments.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListDocuments.Responses.$200>;
  /**
   * upload-document - Create a Document
   *
   * ## Basic Usage
   * To create a new document from a file, `POST` its contents to
   * `/api/documents`, specifying the correct content type.
   *
   * You can create a document in any of the supported file formats and then use the functionality of both the Web API and Document Engine-Server API.
   *
   * Document Engine will extract the title of the document from the file metadata if
   * it is present.
   *
   * ## Advanced Usage
   *
   * Document Engine also supports uploading files as `multipart/form-data`. When
   * using this method, Document Engine will try reading the title from the file metadata
   * and fall back to the filename if the metadata is not available.
   *
   * When using `multipart/form-data` you can also attach an XFDF or Instant JSON file to be
   * applied to the imported document. This feature is available both for direct file upload
   * and importing from remote URL, however, note that you should specify either `url` (and
   * optionally `sha256`) or `file`, not both at the same time.
   *
   * While using this request format you can also specify a custom `title` or `document_id`.
   *
   * ## Adding a Document from a URL
   *
   * You can also add a document to Document Engine by specifying the URL
   * the document can be fetched from. By default, a document added by a URL is not
   * persistently stored in Document Engine and will be fetched from the URL
   * when necessary. This is useful when you already have a document storage
   * solution and you want Document Engine to fetch the documents from your
   * document storage. You can override this default storage behavior to store
   * the document persistently by setting a `copy_asset_to_storage_backend` option to `true`.
   *
   * To add a document from a URL, `POST` its URL — and optionally, its
   * SHA256 hash, your `document_id`, and your `title` — using the
   * `application/json` content type.
   *
   * ## Processing Document on Upload
   *
   * Document Engine supports processing documents via Build API. This allows you to
   * assemble a PDF from multiple parts, such as an existing document in supported content type, a blank page,
   * or an HTML page. You can apply one or more actions, such as watermarking, rotating pages, or importing
   * annotations. Once the entire PDF is generated from its parts, you can also apply additional actions,
   * such as optical character recognition (OCR), to the assembled PDF itself.
   *
   * To Process the document using The Build API, you'll need to provide all inputs and the [Build instructions](#tag/Build-API):
   * * Use `multipart/form-data` with special `instructions` part with the processing instructions. You can pass any options allowed
   * by the other document creation methods - `document_id`, `title`, etc. - as parts in the multipart request.
   * * If all inputs are provided as remote URLs, the multipart request isn't necessary and can be simplified to a simple
   * non-multipart request with the `application/json` body with the processing instructions provided as `instructions` key.
   *
   * ## Configuring Storage
   * By default, Document Engine will store all assets associated with the document - images, PDF, source files that were converted, etc. in the built-in storage.
   * If the `ASSET_STORAGE_BACKEND` is configured, then Document Engine will use that instead of `built_in`.
   *
   * That said, when uploading a document you can optionally pass in some storage configuration options
   * to control where the document's assets are stored by setting the `storage` field.
   * For example, you can specify the exact s3 bucket for storage of the document's assets.
   * You can also specify that a given document should be stored in Azure Blob Storage or with the `built_in` storage.
   *
   * This configuration will override any default storage backends set in Document Engine's `ASSET_STORAGE_BACKEND` configuration.
   * and it will be used to store all assets associated with the document - images, PDF, source files that were converted, etc.
   *
   * > ⚠️ NOTE: The `backend` configured in `storage` must be enabled as either the main storage backend or as a fallback otherwise the upload will be done using the default enabled storage after logging a warning.
   * > Learn more about configuring Asset Storage for Document Engine [here](https://www.nutrient.io/guides/document-engine/configuration/asset-storage/#migration-between-asset-storage-options)
   */
  'upload-document'(
    parameters?: Parameters<Paths.UploadDocument.HeaderParameters> | null,
    data?: Paths.UploadDocument.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UploadDocument.Responses.$200>;
  /**
   * bulk-delete-documents - Bulk Delete Documents
   *
   * Deletes multiple documents based on the provided filter criteria. This endpoint allows for efficient batch
   * deletion of documents matching specified parameters.
   *
   * At least one filter parameter must be provided (`title`, `document_id`, `start_date`, or `end_date`).
   *
   * When successful, the endpoint returns a summary of the deletion operation, including count of successfully
   * deleted documents and any skipped documents.
   */
  'bulk-delete-documents'(
    parameters?: Parameters<Paths.BulkDeleteDocuments.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.BulkDeleteDocuments.Responses.$200>;
  /**
   * get-async-job-status - Get the status of an async job
   *
   * Get the status of a previously scheduled asynchronous job
   *
   * If a job is `cancelled`, simply retrying the request won't help.
   * You might need to make changes to Document Engine's configuration and restart your Document Engine instances.
   * For example, a cancellation could occur if you attempted an asset migration job to a storage backend that's not enabled in your Document Engine configuration.
   *
   * If a job is `expired`, then the job as well as its output assets (PDFs, images etc.) - if any,
   * will have been deleted and thus be unavailable for download. Attempts to check the status of that job return a `404` not found error.
   * You need to redo an expired job to regenerate those assets.
   * You can configure the expiration time for jobs by setting the `ASYNC_JOBS_TTL` option in the Document Engine configuration.
   * The default value is 2 days.
   */
  'get-async-job-status'(
    parameters?: Parameters<Paths.GetAsyncJobStatus.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetAsyncJobStatus.Responses.$200>;
  /**
   * get-global-fonts - Get global fonts
   */
  'get-global-fonts'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetGlobalFonts.Responses.$200>;
  /**
   * get-configured-font-substitutions - Get the list of font substitutions in the configured `font-substitutions.json` file, if any.
   *
   * If a `font-substitutions.json` file has been mounted on Document Engine's container,
   * use this endpoint to get a list of the font substitutions defined in that file,
   *
   * Note that the font substitutions returned by this endpoint will be used by Document Engine
   * when processing all documents.
   */
  'get-configured-font-substitutions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetConfiguredFontSubstitutions.Responses.$200>;
  /**
   * delete-document - Delete a Document
   *
   * Deletes a document with all of its annotation, underlying PDF file and attachments
   * not referenced by other documents.
   */
  'delete-document'(
    parameters?: Parameters<Paths.DeleteDocument.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDocument.Responses.$200>;
  /**
   * get-document-outline - Get a Document Outline
   *
   * This endpoint allows you to fetch the outline of a document.
   */
  'get-document-outline'(
    parameters?: Parameters<
      Paths.GetDocumentOutline.HeaderParameters & Paths.GetDocumentOutline.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentOutline.Responses.$200>;
  /**
   * fetch-document-info - Fetch Document Information
   *
   * This endpoint allows you to fetch the document's page count,
   * the dimensions of each page, and the document's permissions.
   */
  'fetch-document-info'(
    parameters?: Parameters<
      Paths.FetchDocumentInfo.HeaderParameters & Paths.FetchDocumentInfo.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.FetchDocumentInfo.Responses.$200>;
  /**
   * fetch-document-properties - Fetch Document Properties
   *
   * This endpoint allows you to fetch properties of a document
   * including its title, information about password-protection,
   * SHA256 hash of the content, and the storage mechanism used
   * for the underlying PDF file. All of them are set by Document Engine
   * when a document is uploaded.
   */
  'fetch-document-properties'(
    parameters?: Parameters<Paths.FetchDocumentProperties.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.FetchDocumentProperties.Responses.$200>;
  /**
   * search-document - Search for Text
   *
   * Use this endpoint to search in a whole document or a continuous range of pages.
   *
   * This API offers three different types of search, controlled via `type` query parameter:
   * - `text` (default) - simple, text search. By default, the search query is case insensitive,
   *    but you can change this by setting `case_sensitive` to `true`.
   * - `preset` - search using one of the predefined patterns. For the full list of presets,
   *    see the request parameters schema.
   * - `regex` - search using a regular expression. The regular expressions needs to comply
   *    with the [ICU regex standard](http://userguide.icu-project.org/strings/regexp). By
   *    default, the regular expression is case sensitive, but you can change that by setting the
   *    `case_sensitive` parameter to `false`.
   *
   * When using `text` search, the search query needs to be at least three characters long.
   *
   * By default, search results do not include annotations. If you want to
   * search inside annotations in the document, you can include a
   * `include_annotations` parameter set to `true`.
   */
  'search-document'(
    parameters?: Parameters<
      Paths.SearchDocument.QueryParameters &
        Paths.SearchDocument.HeaderParameters &
        Paths.SearchDocument.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.SearchDocument.Responses.$200>;
  /**
   * get-document-text - Fetch Document Text
   *
   * This endpoint allows you to fetch the text of all pages in a document.
   */
  'get-document-text'(
    parameters?: Parameters<
      Paths.GetDocumentText.HeaderParameters & Paths.GetDocumentText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentText.Responses.$200>;
  /**
   * get-document-page-text - Fetch Page Text
   *
   * This endpoint allows you to fetch the text of a specific page in a document.
   */
  'get-document-page-text'(
    parameters?: Parameters<
      Paths.GetDocumentPageText.HeaderParameters & Paths.GetDocumentPageText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentPageText.Responses.$200>;
  /**
   * get-document-page-highlighted-text - Fetch Highlighted Text on a Page
   *
   * Highlighted text in the document refers to any text that is highlighted with any of the
   * markup annotations, like underline, strikeout, or highlight.
   *
   * Note that the data returned by this endpoint is just an approximation and might not always
   * exactly reflect the text highlighted in the PDF file.
   */
  'get-document-page-highlighted-text'(
    parameters?: Parameters<
      Paths.GetDocumentPageHighlightedText.HeaderParameters &
        Paths.GetDocumentPageHighlightedText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentPageHighlightedText.Responses.$200>;
  /**
   * render-document-page - Render a Page
   *
   * Returns an image with the rendered page from a document. Requires exactly one of
   * `width` and `height` query parameters to set the required dimensions of the rendered image.
   *
   * Annotation AP streams are not rendered by default, use `render_ap_streams` query parameter
   * to enable AP streams rendering.
   *
   * Rendered image format depends on the value of the `Accept` header. Supported content types
   * are `image/png` (default) and `image/webp`.
   */
  'render-document-page'(
    parameters?: Parameters<
      Paths.RenderDocumentPage.QueryParameters &
        Paths.RenderDocumentPage.HeaderParameters &
        Paths.RenderDocumentPage.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RenderDocumentPage.Responses.$200>;
  /**
   * prerender-document - Prerender a Document
   *
   * This endpoint allows you to pre-render documents in background so that they
   * are cached ahead of time by Document Engine.
   *
   * This speeds up loading times when opening documents via Nutrient Web SDK.
   * The rendering is done asynchronously, and future clients asking for the
   * document will receive the already cached, rendered pages. For more details
   * about how Document Engine caches work, please check out our
   * [Cache](https://www.nutrient.io/guides/document-engine/configuration/cache/) guide.
   *
   * You can customize prerendering by providing a range of pages to prerender
   * and an array of scale factors for prerendered images.
   *
   * > ⚠️ Note: Prerendering feature requires setting up the Redis cache.
   * > All Redis cache keys are set to expire after the configured `REDIS_TTL`. To opt out of using the `REDIS_TTL`
   * > for prerendered cache keys, set `USE_REDIS_TTL_FOR_PRERENDERING` to `false` in your configuration.
   */
  'prerender-document'(
    parameters?: Parameters<
      Paths.PrerenderDocument.HeaderParameters & Paths.PrerenderDocument.PathParameters
    > | null,
    data?: Paths.PrerenderDocument.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.PrerenderDocument.Responses.$202>;
  /**
   * build-document - Process Documents And Download the Result
   *
   * This endpoint allows to use [Build instructions](#tag/Build-API) to process a document. This allows to
   * assemble a PDF from multiple parts, such as an existing document in supported content type, a blank page,
   * or an HTML page. You can apply one or more actions, such as watermarking, rotating pages, or importing
   * annotations. Once the entire PDF is generated from its parts, you can also apply additional actions,
   * such as optical character recognition (OCR), to the assembled PDF itself.
   */
  'build-document'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.BuildDocument.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.BuildDocument.Responses.$200>;
  /**
   * migrate-document-assets - Migrate a Document's Assets to the Storage in the Configuration
   *
   * This endpoint allows you to migrate all the assets that are associated with a document to a new storage backend.
   *
   * With this endpoint, you can migrate assets from one s3 compatible storage bucket, to another s3 compatible storage bucket.
   * You can also use this endpoint to migrate assets from the built_in storage to s3 or Azure and vice versa.
   *
   * This endpoint triggers an asynchronous migration operation.
   * If the request parameters are valid will return immediately with a `202 Accepted` response with a `jobId`
   * that you can use to track the status of the migration operation.
   *
   * You can track the status of the migration operation at `/api/async/jobs/{jobId}`
   *
   * > ⚠️ NOTE: The `backend` set in `storage` must be enabled as either the main storage backend or as a fallback otherwise migration will fail
   * > Learn more about configuring Asset Storage backends for Document Engine [here](https://www.nutrient.io/guides/document-engine/configuration/asset-storage/#migration-between-asset-storage-options)
   */
  'migrate-document-assets'(
    parameters?: Parameters<
      Paths.MigrateDocumentAssets.HeaderParameters & Paths.MigrateDocumentAssets.PathParameters
    > | null,
    data?: Paths.MigrateDocumentAssets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.MigrateDocumentAssets.Responses.$202>;
  /**
   * process-office-template - Process Office Template And Download the Result
   *
   * This endpoint allows to populate the document template (in DOCX format) with corresponding data.
   */
  'process-office-template'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ProcessOfficeTemplate.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ProcessOfficeTemplate.Responses.$200>;
  /**
   * document-apply-instructions - Process Documents And Persist the Result
   *
   * This endpoint allows to use [Build instructions](#tag/Build-API) to process a document.
   *
   * The current document can be referred to by using `#self` anchor.
   * ```
   * {
   *   "document": { "id": "#self" }
   * }
   * ```
   *
   * The result of the processing will replace the document's base layer after successful completion.
   */
  'document-apply-instructions'(
    parameters?: Parameters<
      Paths.DocumentApplyInstructions.HeaderParameters &
        Paths.DocumentApplyInstructions.PathParameters
    > | null,
    data?: Paths.DocumentApplyInstructions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DocumentApplyInstructions.Responses.$200>;
  /**
   * edit-and-persist-document-pdf - Edit the Document and Persist the Result
   *
   * > ⚠️ This endpoint is deprecated. Please use `/api/documents/{documentId}/apply_instructions` instead.
   *
   * This endpoint allows you to edit the document, performing transformations like
   * rotating, adding or deleting pages, and store the resulting PDF file at the
   * document's base layer.
   *
   * Editing the document affects the responses returned by other endpoints. For
   * example, removing a page also deletes all the annotations on that page. Similarly,
   * other functionality, like searching in a document will return different results.
   *
   * If you need to preserve the original document, PDF file, and related data,
   * we recommend leveraging Instant Layers and always using named layers.
   *
   * Note that in order to use this endpoint you need to have a document editing feature
   * enabled in your license.
   */
  'edit-and-persist-document-pdf'(
    parameters?: Parameters<
      Paths.EditAndPersistDocumentPdf.HeaderParameters &
        Paths.EditAndPersistDocumentPdf.PathParameters
    > | null,
    data?: Paths.EditAndPersistDocumentPdf.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.EditAndPersistDocumentPdf.Responses.$200>;
  /**
   * edit-and-download-document-pdf - Edit the Document and Download it
   *
   * > ⚠️ This endpoint is deprecated. Please use `/api/build` instead.
   *
   * This endpoint allows you to edit the document, performing transformations like
   * rotating, adding or deleting pages. After these operations are applied, the
   * Document Engine will return the result as a PDF file.
   *
   * Note that in order to use this endpoint you need to have a document editing feature
   * enabled in your license.
   *
   * ### Operations with external files
   *
   * In order to use `importDocument`, `applyInstantJson`, or `applyXfdf` operations, you need to use
   * `multipart/form-data` content type.
   */
  'edit-and-download-document-pdf'(
    parameters?: Parameters<
      Paths.EditAndDownloadDocumentPdf.HeaderParameters &
        Paths.EditAndDownloadDocumentPdf.PathParameters
    > | null,
    data?: Paths.EditAndDownloadDocumentPdf.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * download-document-pdf - Download the Document as a PDF
   *
   * This operation downloads the latest version of the document with annotations
   * as a PDF file.
   *
   * If the query parameter `source=true` is included in the request, the originally
   * uploaded version will be fetched instead.
   *
   * Additionally, you can download the flattened version of the file by providing
   * `flatten=true` query parameter. Note, however, that `source` and `flatten`
   * can't be used at the same time.
   *
   * To download a PDF/A conformant document, include the `type=pdfa` query parameter.
   * You can also specify the conformance of the PDF/A file by specifying the
   * `conformance=pdfa-1a` query parameter.
   */
  'download-document-pdf'(
    parameters?: Parameters<
      Paths.DownloadDocumentPdf.QueryParameters &
        Paths.DownloadDocumentPdf.HeaderParameters &
        Paths.DownloadDocumentPdf.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * download-document-pdf-post - Download the Document as a PDF
   *
   * This operation downloads the latest version of the document as a PDF file.
   */
  'download-document-pdf-post'(
    parameters?: Parameters<
      Paths.DownloadDocumentPdfPost.HeaderParameters & Paths.DownloadDocumentPdfPost.PathParameters
    > | null,
    data?: Paths.DownloadDocumentPdfPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * get-document-xfdf - Export Annotations as an XFDF
   */
  'get-document-xfdf'(
    parameters?: Parameters<
      Paths.GetDocumentXfdf.HeaderParameters & Paths.GetDocumentXfdf.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * get-document-instant-json - Export Records as an Instant JSON
   *
   * Use this endpoint to export a document's records as an Instant JSON file. This includes annotations,
   * form field, form field values and bookmarks.
   *
   * This API allows to optionally specify the Instant JSON schema version for the annotations, controlled
   * via `annotation_version` query parameter. The value of `annotation_version` can be any valid
   * positive integer version. If the `annotation_version` parameter is not mentioned, or is
   * invalid, the latest version of Instant JSON schema will be exported.
   */
  'get-document-instant-json'(
    parameters?: Parameters<
      Paths.GetDocumentInstantJson.QueryParameters &
        Paths.GetDocumentInstantJson.HeaderParameters &
        Paths.GetDocumentInstantJson.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentInstantJson.Responses.$200>;
  /**
   * document-apply-instant-json - Apply an Instant JSON to Document
   *
   * To import an Instant JSON file and apply it to an existing document, you can POST a `multipart/form`
   * request including an `instant.json` file. This will modify the default layer of the document in place.
   * In case of success, the endpoint will respond with an empty JSON object.
   */
  'document-apply-instant-json'(
    parameters?: Parameters<
      Paths.DocumentApplyInstantJson.HeaderParameters &
        Paths.DocumentApplyInstantJson.PathParameters
    > | null,
    data?: Paths.DocumentApplyInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DocumentApplyInstantJson.Responses.$200>;
  /**
   * download-document-with-instant-json - Download a Document with Instant JSON
   *
   * To import an Instant JSON file and download the resulting PDF, you can
   * `POST` a `multipart/form` request including an `instant.json` file.
   *
   * This will create a new PDF containing the latest annotations of the
   * chosen layer, import the uploaded Instant JSON, and respond with the
   * resulting PDF. Please note that this action will not modify the
   * existing document, but rather only import the Instant JSON on a
   * temporary file that will be downloaded in the process.
   */
  'download-document-with-instant-json'(
    parameters?: Parameters<
      Paths.DownloadDocumentWithInstantJson.HeaderParameters &
        Paths.DownloadDocumentWithInstantJson.PathParameters
    > | null,
    data?: Paths.DownloadDocumentWithInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * copy-document-with-instant-json - Copy a Default Layer With Instant JSON
   *
   * This will create a new PDF containing the latest annotations of the default/base layer, optionally
   * import the uploaded Instant JSON, and persist the resulting PDF as a new document.
   *
   * If the content type of the request is `multipart/form-data`, the document with its default layer
   * will be copied, and uploaded `instant.json` file will be imported into the default layer.
   *
   * If the content type is `application/json`, the request body is ignored and the document is copied
   * as-is, without any modifications to the default layer.
   */
  'copy-document-with-instant-json'(
    parameters?: Parameters<
      Paths.CopyDocumentWithInstantJson.HeaderParameters &
        Paths.CopyDocumentWithInstantJson.PathParameters
    > | null,
    data?: Paths.CopyDocumentWithInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CopyDocumentWithInstantJson.Responses.$200>;
  /**
   * get-document-bookmarks - Fetch Bookmarks
   *
   * Fetches all bookmarks in a given document.
   */
  'get-document-bookmarks'(
    parameters?: Parameters<
      Paths.GetDocumentBookmarks.HeaderParameters & Paths.GetDocumentBookmarks.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentBookmarks.Responses.$200>;
  /**
   * create-document-bookmark - Create a Bookmark
   *
   * Bookmarks can be created with and without specifying the ID for the bookmark. When no ID is specified,
   * Document Engine will assign a random ID to the bookmark. If you want to rely on a specific ID being the
   * ID of the created bookmark, the ID can be set with the `id` property in the JSON payload.
   * This is useful if you, for example, want a bookmark with the same ID in multiple documents.
   */
  'create-document-bookmark'(
    parameters?: Parameters<
      Paths.CreateDocumentBookmark.HeaderParameters & Paths.CreateDocumentBookmark.PathParameters
    > | null,
    data?: Paths.CreateDocumentBookmark.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentBookmark.Responses.$200>;
  /**
   * update-document-bookmark - Update a Bookmark
   */
  'update-document-bookmark'(
    parameters?: Parameters<
      Paths.UpdateDocumentBookmark.HeaderParameters & Paths.UpdateDocumentBookmark.PathParameters
    > | null,
    data?: Paths.UpdateDocumentBookmark.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentBookmark.Responses.$200>;
  /**
   * delete-document-bookmark - Delete a Bookmark
   */
  'delete-document-bookmark'(
    parameters?: Parameters<
      Paths.DeleteDocumentBookmark.HeaderParameters & Paths.DeleteDocumentBookmark.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDocumentBookmark.Responses.$200>;
  /**
   * get-document-embedded-files - Fetch Embedded Files
   *
   * Returned records describe files that are attached to a document.
   *
   * Use attachments API to retrieve the actual file contents.
   */
  'get-document-embedded-files'(
    parameters?: Parameters<
      Paths.GetDocumentEmbeddedFiles.HeaderParameters &
        Paths.GetDocumentEmbeddedFiles.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentEmbeddedFiles.Responses.$200>;
  /**
   * get-document-annotations - Get Annotations
   *
   * You can use this endpoint to fetch all annotations from the document's default layer.
   *
   * If `Accept: application/json` header is used, only the first 1000 annotations
   * from the page will be returned. If the page has more than 1000 annotations,
   * the `truncated` property in the response is set to `true`.
   *
   * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
   * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
   * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
   * individually or in batches before the complete response body has been received.
   */
  'get-document-annotations'(
    parameters?: Parameters<
      Paths.GetDocumentAnnotations.HeaderParameters & Paths.GetDocumentAnnotations.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentAnnotations.Responses.$200>;
  /**
   * update-document-annotations - Update Annotations
   *
   * This endpoint allows you to update multiple annotations in the document's default layer.
   *
   * The annotation's content will be completely replaced with the `content` provided in
   * the request, and its `updatedBy` field will be set to `user_id`.
   *
   * The endpoint accepts two content types:
   * - `application/json` - in this case, the request body is a JSON representation of
   *   one or more annotation; you can check the schema for more details.
   * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
   *   with a new attachment. Annotations are one part of the request, followed by
   *   attachments.
   *
   * The annotation `id` is required, and it should correspond to an already existing annotation
   * in the document. The `user_id` is set as the creator of the annotation.
   */
  'update-document-annotations'(
    parameters?: Parameters<
      Paths.UpdateDocumentAnnotations.HeaderParameters &
        Paths.UpdateDocumentAnnotations.PathParameters
    > | null,
    data?: Paths.UpdateDocumentAnnotations.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentAnnotations.Responses.$200>;
  /**
   * create-document-annotation - Create Annotations
   *
   * This endpoint allows you to add one or more new annotations to a document's default layer.
   *
   * The endpoint accepts two content types:
   * - `application/json` - in this case, the request body is a JSON representation of
   *   one or more annotation; you can check the schema for more details.
   * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
   *   with a new attachment. Annotations are one part of the request, followed by
   *   attachments.
   *
   * The annotation `id` is optional, and will be generated by Document Engine if not provided.
   * The `user_id` is set as the creator of the annotation.
   */
  'create-document-annotation'(
    parameters?: Parameters<
      Paths.CreateDocumentAnnotation.HeaderParameters &
        Paths.CreateDocumentAnnotation.PathParameters
    > | null,
    data?: Paths.CreateDocumentAnnotation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentAnnotation.Responses.$200>;
  /**
   * remove-document-annotations - Delete Annotations
   *
   * This endpoint allows you to remove multiple annotations from the document's default layer.
   *
   * The endpoint accepts one content type `application/json`. The request body is either a JSON
   * array of annotations ids, or "all" in order to remove all annotations in one go.
   */
  'remove-document-annotations'(
    parameters?: Parameters<
      Paths.RemoveDocumentAnnotations.HeaderParameters &
        Paths.RemoveDocumentAnnotations.PathParameters
    > | null,
    data?: Paths.RemoveDocumentAnnotations.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentAnnotations.Responses.$200>;
  /**
   * get-document-page-annotations - Fetch Annotations on a Page
   *
   * You can use this endpoint to fetch annotations on the given page from the document's
   * default layer.
   *
   * If `Accept: application/json` header is used, only the first 1000 annotations
   * from the page will be returned. If the page has more than 1000 annotations,
   * the `truncated` property in the response is set to `true`.
   *
   * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
   * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
   * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
   * individually or in batches before the complete response body has been received.
   */
  'get-document-page-annotations'(
    parameters?: Parameters<
      Paths.GetDocumentPageAnnotations.HeaderParameters &
        Paths.GetDocumentPageAnnotations.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentPageAnnotations.Responses.$200>;
  /**
   * get-document-annotation - Get Annotation
   *
   * Use this endpoint to get the annotation from the document's default layer.
   */
  'get-document-annotation'(
    parameters?: Parameters<
      Paths.GetDocumentAnnotation.HeaderParameters & Paths.GetDocumentAnnotation.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentAnnotation.Responses.$200>;
  /**
   * update-document-annotation - Update an Annotation
   *
   * This endpoint allows you to update an annotation in the document's default layer.
   *
   * The annotation's content will be completely replaced with the `content` provided in
   * the request, and its `updatedBy` field will be set to `user_id`.
   */
  'update-document-annotation'(
    parameters?: Parameters<
      Paths.UpdateDocumentAnnotation.HeaderParameters &
        Paths.UpdateDocumentAnnotation.PathParameters
    > | null,
    data?: Paths.UpdateDocumentAnnotation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentAnnotation.Responses.$200>;
  /**
   * delete-document-annotation - Delete an Annotation
   *
   * This endpoint allows you to delete an annotation in the document's default layer.
   */
  'delete-document-annotation'(
    parameters?: Parameters<
      Paths.DeleteDocumentAnnotation.HeaderParameters &
        Paths.DeleteDocumentAnnotation.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDocumentAnnotation.Responses.$200>;
  /**
   * get-document-form-field-values - Get Form Field Values
   */
  'get-document-form-field-values'(
    parameters?: Parameters<
      Paths.GetDocumentFormFieldValues.HeaderParameters &
        Paths.GetDocumentFormFieldValues.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentFormFieldValues.Responses.$200>;
  /**
   * update-document-form-field-values - Update Form Field Values
   *
   * To update existing form field values, send a POST request with a JSON body containing the list of form fields and their values.
   */
  'update-document-form-field-values'(
    parameters?: Parameters<
      Paths.UpdateDocumentFormFieldValues.HeaderParameters &
        Paths.UpdateDocumentFormFieldValues.PathParameters
    > | null,
    data?: Paths.UpdateDocumentFormFieldValues.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentFormFieldValues.Responses.$200>;
  /**
   * sign-file - Digitally Sign a PDF File
   *
   * Use this endpoint to digitally sign a PDF file.
   *
   * ### Signing Service
   *
   * The actual signing of the file is performed by a signing service callback that needs to be maintained
   * and operated separately. It needs to expose a single HTTP endpoint that receives all callbacks required
   * during the document signing flow differentiated by an `action` property in the request's JSON.
   *
   * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
   */
  'sign-file'(
    parameters?: Parameters<Paths.SignFile.HeaderParameters> | null,
    data?: Paths.SignFile.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * inspect-digital-signatures - Inspect Digital Signatures in a PDF file
   *
   * Returns PDF file's digital signatures.
   *
   * A document's digital signature status is computed by looking at all the digital signatures
   * included in the document
   *
   * The validity of a signature is determined by the signing certificate used to create it: If you're using a
   * custom certificate, you need to set up Document Engine to use a corresponding certificate store in order to
   * identify the signature as valid. Please check our
   * [guide article](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates)
   * on how to set up custom certificates for digital signature validation.
   */
  'inspect-digital-signatures'(
    parameters?: Parameters<Paths.InspectDigitalSignatures.HeaderParameters> | null,
    data?: Paths.InspectDigitalSignatures.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.InspectDigitalSignatures.Responses.$200>;
  /**
   * sign-document - Digitally Sign a Document
   *
   * Use this endpoint to digitally sign a document.
   *
   * ### Signing Service
   *
   * The actual signing of the current state of the document is performed by a signing service callback
   * that needs to be maintained and operated separately. It needs to expose a single HTTP endpoint
   * that receives all callbacks required during the document signing flow differentiated by an `action`
   * property in the request's JSON.
   *
   * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
   *
   * ### Watermark and Graphic
   *
   * The appearance of a digital signature can include a watermark, which is an image typically depicting a company logo or stamp placed in the center, and a graphic, which is an image usually containing the signer's name in the form of a handwritten signature image positioned on the left side of the signature. You can find more information about these different signature appearance options at https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/configure-digital-signature-appearance/.
   *
   * To specify the image to be used as the watermark or graphic in the digital signature, send a multipart request
   * with the `application/json` part containing the sign request options and the `image` part containing the watermark image, and the `graphicImage` part containing the graphic.
   */
  'sign-document'(
    parameters?: Parameters<
      Paths.SignDocument.HeaderParameters & Paths.SignDocument.PathParameters
    > | null,
    data?: Paths.SignDocument.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.SignDocument.Responses.$200>;
  /**
   * refresh-document-signatures - Refresh signatures on a document
   *
   * Use this endpoint to refresh LTV signatures for the given document.
   *
   * Learn more about CAdES and LTV signatures here:
   * https://www.nutrient.io/guides/web/signatures/digital-signatures/standards/#understanding-ltv-pades-b-lt
   *
   * It will refresh the signatures with IDs provided in the `signatureFQNs` field.
   * If `signatureFQNs` is not set, or empty, then all the signatures in the document will be refreshed.
   */
  'refresh-document-signatures'(
    parameters?: Parameters<
      Paths.RefreshDocumentSignatures.HeaderParameters &
        Paths.RefreshDocumentSignatures.PathParameters
    > | null,
    data?: Paths.RefreshDocumentSignatures.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RefreshDocumentSignatures.Responses.$200>;
  /**
   * get-document-digital-signatures - Get Digital Signatures
   *
   * Returns a document's digital signatures.
   *
   * A document's digital signature status is computed by looking at all the digital signatures
   * included in the document. Digital signature status is automatically updated after each change
   * (e.g. adding a new annotation).
   *
   * The validity of a signature is determined by the signing certificate used to create it: If you're using a
   * custom certificate, you need to set up Document Engine to use a corresponding certificate store in order to
   * identify the signature as valid. Please check our
   * [guide article](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates)
   * on how to set up custom certificates for digital signature validation.
   *
   * By default, the signature certificates are validated against the current time. This means that valid signatures
   * with expired certificates validate as expired. You can modify the `DIGITAL_SIGNATURE_CERTIFICATE_CHECK_TIME`
   * configuration option to `signing_time` if you wish to instead validate certificates against the signing time.
   *
   * > ⚠ Warning: If you're validating digital signature certificates against the signing time, special care should be
   * taken: By default, there's no way of knowing whether the creation time stored with the signature itself can be trusted.
   * To solve this issue, digital signatures need to use a Time Stamping Authority to provide a signed timestamp to embed.
   * Note that we don't validate the timestamp token's certificates — we always assume a valid proof of existence if it's present.
   * Thus, it's expected that the timestamps will be validated independently by your client code.
   */
  'get-document-digital-signatures'(
    parameters?: Parameters<
      Paths.GetDocumentDigitalSignatures.HeaderParameters &
        Paths.GetDocumentDigitalSignatures.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentDigitalSignatures.Responses.$200>;
  /**
   * fetch-document-annotation-comments - Get Comments For a Root Annotation
   *
   * Use this endpoint to list all the annotation attached to the given annotation in the document's default layer.
   */
  'fetch-document-annotation-comments'(
    parameters?: Parameters<
      Paths.FetchDocumentAnnotationComments.HeaderParameters &
        Paths.FetchDocumentAnnotationComments.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.FetchDocumentAnnotationComments.Responses.$200>;
  /**
   * create-document-annotation-comments - Add Comments to a Root Annotation
   *
   * Use this endpoint to add new comments to an existing annotation in the document's default layer.
   * Note that the annotation needs to be either a markup annotation or a comment marker.
   * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine if they are not provided.
   */
  'create-document-annotation-comments'(
    parameters?: Parameters<
      Paths.CreateDocumentAnnotationComments.HeaderParameters &
        Paths.CreateDocumentAnnotationComments.PathParameters
    > | null,
    data?: Paths.CreateDocumentAnnotationComments.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentAnnotationComments.Responses.$200>;
  /**
   * create-document-comments - Adds Comments
   *
   * Use this endpoint to add comments and their root annotation at the same time.
   *
   * Note that the annotation needs to be either a markup annotation or a comment marker.
   *
   * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine
   * if they are not provided.
   */
  'create-document-comments'(
    parameters?: Parameters<
      Paths.CreateDocumentComments.HeaderParameters & Paths.CreateDocumentComments.PathParameters
    > | null,
    data?: Paths.CreateDocumentComments.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentComments.Responses.$200>;
  /**
   * create-document-redactions - Create Redactions
   *
   * Use this endpoint to add multiple redaction annotations in a single request.
   *
   * Available strategies are:
   *
   * - `preset` - creates redactions on top of text and annotations matching the predefined
   *   pattern. For the full list of presets, see the request schema.
   * - `regex` - creates redactions on top of text and annotations matching the provided
   *   regular expression. The regular expressions needs to comply with the
   *   [ICU regex standard](http://userguide.icu-project.org/strings/regexp).
   * - `text` - creates redactions on top of text and annotations matching the provided string
   *   search term. Note that the search is case-insensitive.
   *
   * The shape of the `strategyOptions` depends on the chosen strategy. Currently each
   * strategy supports the `includeAnnotations` options (`true` by default), which controls
   * whether redactions should also cover annotations whose content match the search query.
   *
   * The `user_id` key allows to specify the owner of the newly created annotations,
   * and `content` allows to override their visual properties.
   *
   * On success, an array of created redaction annotations is returned.
   */
  'create-document-redactions'(
    parameters?: Parameters<
      Paths.CreateDocumentRedactions.HeaderParameters &
        Paths.CreateDocumentRedactions.PathParameters
    > | null,
    data?: Paths.CreateDocumentRedactions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentRedactions.Responses.$200>;
  /**
   * apply-document-redactions - Apply Redactions
   *
   * Use this endpoint to apply existing redaction annotation to the default layer, erasing
   * any content and annotations below them.
   *
   * Applying redactions removes the existing redaction annotations and rewrites the underlying
   * PDF file.
   *
   * Note that regardless of applied redactions, the content and annotations from the originally
   * uploaded file are always stored at the document's immutable base layer.
   * In some circumstances, e.g. due to legal requirements, this may be undesirable.
   * In these cases, you can delete the document after applying redactions, which will erase
   * all of the document's data.
   */
  'apply-document-redactions'(
    parameters?: Parameters<
      Paths.ApplyDocumentRedactions.HeaderParameters & Paths.ApplyDocumentRedactions.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApplyDocumentRedactions.Responses.$200>;
  /**
   * get-document-attachment - Get Attachment
   *
   * Attachments are files that are attached to a document.
   *
   * This endpoint provides a way to fetch an attachment's contents.
   */
  'get-document-attachment'(
    parameters?: Parameters<
      Paths.GetDocumentAttachment.HeaderParameters & Paths.GetDocumentAttachment.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentAttachment.Responses.$200>;
  /**
   * get-document-form-fields - Get Form Fields
   *
   * You can use this endpoint to fetch all form fields from the document's default layer.
   */
  'get-document-form-fields'(
    parameters?: Parameters<
      Paths.GetDocumentFormFields.HeaderParameters & Paths.GetDocumentFormFields.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentFormFields.Responses.$200>;
  /**
   * update-document-form-field - Update Form Fields
   *
   * This endpoint allows you to update an existing form field in the document's default layer
   *
   * The `id` is required. If you provide the `group` in this operation
   * then the new group will cascade to all the widgets and values associated with this field.
   */
  'update-document-form-field'(
    parameters?: Parameters<
      Paths.UpdateDocumentFormField.HeaderParameters & Paths.UpdateDocumentFormField.PathParameters
    > | null,
    data?: Paths.UpdateDocumentFormField.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentFormField.Responses.$200>;
  /**
   * create-document-form-field - Create Form Fields
   *
   * This endpoint allows you to add a new form field to the document's default layer.
   *
   * The `id` of each form field is optional, and will be generated by Document Engine if not provided.
   * The `user_id` is set as the creator of the form field. The `group` of the form field will be inherited by the widgets and values associated with it.
   */
  'create-document-form-field'(
    parameters?: Parameters<
      Paths.CreateDocumentFormField.HeaderParameters & Paths.CreateDocumentFormField.PathParameters
    > | null,
    data?: Paths.CreateDocumentFormField.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentFormField.Responses.$200>;
  /**
   * remove-document-form-fields - Delete Form Fields
   *
   * This endpoint allows you to remove multiple form fields from the document's default layer.
   *
   * Deleting a form field will cascade delete all its associated widgets and values.
   *
   * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldIds`
   * that is set to either a JSON array of IDs, or "all" in order to remove all form fields in one request.
   */
  'remove-document-form-fields'(
    parameters?: Parameters<
      Paths.RemoveDocumentFormFields.HeaderParameters &
        Paths.RemoveDocumentFormFields.PathParameters
    > | null,
    data?: Paths.RemoveDocumentFormFields.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentFormFields.Responses.$200>;
  /**
   * get-document-form-field - Get a Form Field
   *
   * Use this endpoint to get the form field with the specified ID from the document's default layer.
   */
  'get-document-form-field'(
    parameters?: Parameters<
      Paths.GetDocumentFormField.HeaderParameters & Paths.GetDocumentFormField.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentFormField.Responses.$200>;
  /**
   * get-document-form-field-widgets - Get Widgets
   *
   * You can use this endpoint to fetch all widgets from the document's default layer.
   */
  'get-document-form-field-widgets'(
    parameters?: Parameters<
      Paths.GetDocumentFormFieldWidgets.HeaderParameters &
        Paths.GetDocumentFormFieldWidgets.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentFormFieldWidgets.Responses.$200>;
  /**
   * update-document-form-field-widgets - Update Widgets
   *
   * This endpoint allows you to update an existing widget in the document's default layer
   */
  'update-document-form-field-widgets'(
    parameters?: Parameters<
      Paths.UpdateDocumentFormFieldWidgets.HeaderParameters &
        Paths.UpdateDocumentFormFieldWidgets.PathParameters
    > | null,
    data?: Paths.UpdateDocumentFormFieldWidgets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentFormFieldWidgets.Responses.$200>;
  /**
   * create-document-form-field-widget - Create Widgets
   *
   * This endpoint allows you to add a new widget to the document's default layer.
   *
   * The `id` is optional, and will be generated by Document Engine if not provided.
   */
  'create-document-form-field-widget'(
    parameters?: Parameters<
      Paths.CreateDocumentFormFieldWidget.HeaderParameters &
        Paths.CreateDocumentFormFieldWidget.PathParameters
    > | null,
    data?: Paths.CreateDocumentFormFieldWidget.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentFormFieldWidget.Responses.$200>;
  /**
   * remove-document-form-field-widgets - Delete Widgets
   *
   * This endpoint allows you to remove multiple widgets from the document's default layer.
   *
   * The endpoint accepts content type `application/json`. The request body is an object that is set to either
   * a JSON array of widget ids, or "all" in order to remove all widgets in one go.
   */
  'remove-document-form-field-widgets'(
    parameters?: Parameters<
      Paths.RemoveDocumentFormFieldWidgets.HeaderParameters &
        Paths.RemoveDocumentFormFieldWidgets.PathParameters
    > | null,
    data?: Paths.RemoveDocumentFormFieldWidgets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentFormFieldWidgets.Responses.$200>;
  /**
   * get-fonts - Get fonts
   */
  'get-fonts'(
    parameters?: Parameters<Paths.GetFonts.HeaderParameters & Paths.GetFonts.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFonts.Responses.$200>;
  /**
   * get-font-substitutions - Get font substitutions
   *
   * This endpoint allows you to get font substitutions that were set for the specific document.
   *
   * Note that font substitutions returned by this endpoint will include the font substitutions defined for the specified document,
   * as well as any font substitutions defined in the `font-substitutions.json` configuration file, if a `font-substitutions.json` file is mounted on Document Engine.
   *
   * The font substitutions for the document will be merged with the font substitutions in `font-substitutions.json` if any,
   * with the substitutions in the document having priority over any substitutions `font-substitutions.json` may define.
   * It is this combination of font substitutions that will be applied by Document Engine
   * when performing operations on the document where a font is unavailable and needs to be substituted.
   *
   * Learn more about the `font-substitutions.json` file from the documentation available here:
   * https://www.nutrient.io/guides/document-engine/configuration/custom-fonts/#font-substitutions
   */
  'get-font-substitutions'(
    parameters?: Parameters<
      Paths.GetFontSubstitutions.HeaderParameters & Paths.GetFontSubstitutions.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFontSubstitutions.Responses.$200>;
  /**
   * update-font-substitutions - Replaces font substitutions in the document
   *
   * This endpoint allows you to replace font substitutions in the document.
   * It will delete any existing font substitutions defined for the document and replace them with these new ones
   *
   * If no font substitutions existed for the document prior, it will create them.
   *
   * **Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.**
   */
  'update-font-substitutions'(
    parameters?: Parameters<
      Paths.UpdateFontSubstitutions.HeaderParameters & Paths.UpdateFontSubstitutions.PathParameters
    > | null,
    data?: Paths.UpdateFontSubstitutions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateFontSubstitutions.Responses.$200>;
  /**
   * delete-font-substitutions - Deletes all font substitutions in the document
   *
   * This endpoint allows you to delete all font substitutions in the document.
   * Note that it won't delete other font substitutions that are associated with a different layer.
   * To delete the font substitutions in a specific layer, make a request to the specified layer
   *
   * Also note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
   */
  'delete-font-substitutions'(
    parameters?: Parameters<
      Paths.DeleteFontSubstitutions.HeaderParameters & Paths.DeleteFontSubstitutions.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteFontSubstitutions.Responses.$200>;
  /**
   * get-document-form-field-widget - Get a Widget
   *
   * Use this endpoint to get the widget with the specified ID from the document's default layer.
   */
  'get-document-form-field-widget'(
    parameters?: Parameters<
      Paths.GetDocumentFormFieldWidget.HeaderParameters &
        Paths.GetDocumentFormFieldWidget.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentFormFieldWidget.Responses.$200>;
  /**
   * get-ocg-layers - Get available OCG layers for the document
   */
  'get-ocg-layers'(
    parameters?: Parameters<
      Paths.GetOcgLayers.HeaderParameters & Paths.GetOcgLayers.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetOcgLayers.Responses.$200>;
  /**
   * list-layers - Get Document's Layers
   *
   * Fetches a list of document's layers.
   */
  'list-layers'(
    parameters?: Parameters<
      Paths.ListLayers.HeaderParameters & Paths.ListLayers.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListLayers.Responses.$200>;
  /**
   * create-new-layer - Create a New Layer
   *
   * This endpoint allows you to create a new layer for a document. It supports three modes
   * of operation:
   * - *create a new layer based on a source layer*: this essentially copies a layer in a document
   *   to a new layer in the same document
   * - *create a new layer based on an Instant JSON file*: this creates a new layer by copying document's
   *   base layer and applying the provided Instant JSON payload
   * - *create a new layer based on a source layer and an Instant JSON file*: the same as above, but instead
   *   of copying the base layer, the source layer is used
   *
   * **NOTE**: When the provided source layer name doesn't exist, the base layer is used instead.
   *
   * In case of success, the new layer name is returned along with a list of errors from importing the Instant
   * JSON file into the layer.
   */
  'create-new-layer'(
    parameters?: Parameters<
      Paths.CreateNewLayer.HeaderParameters & Paths.CreateNewLayer.PathParameters
    > | null,
    data?: Paths.CreateNewLayer.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateNewLayer.Responses.$200>;
  /**
   * delete-layer - Delete a Layer
   *
   * This endpoint allows you to delete a layer along with all of its contents.
   */
  'delete-layer'(
    parameters?: Parameters<
      Paths.DeleteLayer.HeaderParameters & Paths.DeleteLayer.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteLayer.Responses.$200>;
  /**
   * download-document-layer-pdf - Download the Layer as a PDF
   *
   * This operation downloads the latest version of the document with
   * annotations for the specified layer as a PDF file.
   *
   * For example, you can use this endpoint to download the PDF file generated
   * after applying a series of document operations on a given layer.
   */
  'download-document-layer-pdf'(
    parameters?: Parameters<
      Paths.DownloadDocumentLayerPdf.QueryParameters &
        Paths.DownloadDocumentLayerPdf.HeaderParameters &
        Paths.DownloadDocumentLayerPdf.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * download-document-layer-pdf-post - Download the Layer as a PDF
   *
   * This operation downloads the latest version of the document with annotations
   * as a PDF file.
   */
  'download-document-layer-pdf-post'(
    parameters?: Parameters<
      Paths.DownloadDocumentLayerPdfPost.HeaderParameters &
        Paths.DownloadDocumentLayerPdfPost.PathParameters
    > | null,
    data?: Paths.DownloadDocumentLayerPdfPost.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * get-document-layer-annotations - Get Annotations in a Layer
   *
   * You can use this endpoint to fetch all annotations from the given layer.
   *
   * If `Accept: application/json` header is used, only the first 1000 annotations
   * from the page will be returned. If the page has more than 1000 annotations,
   * the `truncated` property in the response is set to `true`.
   *
   * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
   * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
   * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
   * individually or in batches before the complete response body has been received.
   */
  'get-document-layer-annotations'(
    parameters?: Parameters<
      Paths.GetDocumentLayerAnnotations.HeaderParameters &
        Paths.GetDocumentLayerAnnotations.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerAnnotations.Responses.$200>;
  /**
   * update-document-layer-annotations - Update Annotations in a Layer
   *
   * This endpoint allows you to update multiple annotations in the document's specified layer.
   *
   * The annotation's content will be completely replaced with the `content` provided in
   * the request, and its `updatedBy` field will be set to `user_id`.
   *
   * The endpoint accepts two content types:
   * - `application/json` - in this case, the request body is a JSON representation of
   *   one or more annotation; you can check the schema for more details.
   * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
   *   with a new attachment. Annotations are one part of the request, followed by
   *   attachments.
   *
   * The annotation `id` is required, and it should correspond to an already existing annotation
   * in the document. The `user_id` is set as the creator of the annotation.
   */
  'update-document-layer-annotations'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerAnnotations.HeaderParameters &
        Paths.UpdateDocumentLayerAnnotations.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerAnnotations.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerAnnotations.Responses.$200>;
  /**
   * create-document-layer-annotation - Create Annotations in a Layer
   *
   * This endpoint allows you to add one or more new annotations to a specific layer in the document.
   *
   * The endpoint accepts two content types:
   * - `application/json` - in this case, the request body is a JSON representation of
   *   one or more annotation; you can check the schema for more details.
   * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
   *   with a new attachment. Annotations are one part of the request, followed by
   *   attachments.
   *
   * The annotation `id` is optional, and will be generated by Document Engine if not provided.
   * The `user_id` is set as the creator of the annotation.
   */
  'create-document-layer-annotation'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerAnnotation.HeaderParameters &
        Paths.CreateDocumentLayerAnnotation.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerAnnotation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerAnnotation.Responses.$200>;
  /**
   * remove-document-layer-annotations - Delete Annotations in a Layer.
   *
   * This endpoint allows you to remove multiple annotations from the given layer.
   *
   * The endpoint accepts one content type `application/json`. The request body is either a JSON
   * array of annotations ids, or "all" in order to remove all annotations in one go.
   */
  'remove-document-layer-annotations'(
    parameters?: Parameters<
      Paths.RemoveDocumentLayerAnnotations.HeaderParameters &
        Paths.RemoveDocumentLayerAnnotations.PathParameters
    > | null,
    data?: Paths.RemoveDocumentLayerAnnotations.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentLayerAnnotations.Responses.$200>;
  /**
   * get-document-layer-page-annotations - Get Annotations on a Page in a Layer
   *
   * You can use this endpoint to fetch annotations on the given page from the given layer.
   *
   * If `Accept: application/json` header is used, only the first 1000 annotations
   * from the page will be returned. If the page has more than 1000 annotations,
   * the `truncated` property in the response is set to `true`.
   *
   * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
   * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
   * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
   * individually or in batches before the complete response body has been received.
   */
  'get-document-layer-page-annotations'(
    parameters?: Parameters<
      Paths.GetDocumentLayerPageAnnotations.HeaderParameters &
        Paths.GetDocumentLayerPageAnnotations.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerPageAnnotations.Responses.$200>;
  /**
   * get-document-layer-annotation - Get an Annotation From a Layer
   */
  'get-document-layer-annotation'(
    parameters?: Parameters<
      Paths.GetDocumentLayerAnnotation.HeaderParameters &
        Paths.GetDocumentLayerAnnotation.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerAnnotation.Responses.$200>;
  /**
   * update-document-layer-annotation - Update an Annotation in a Layer
   *
   * This endpoint allows you to update an annotation in the given layer.
   *
   * The annotation's content will be completely replaced with the `content` provided in
   * the request, and its `updatedBy` field will be set to `user_id`.
   */
  'update-document-layer-annotation'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerAnnotation.HeaderParameters &
        Paths.UpdateDocumentLayerAnnotation.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerAnnotation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerAnnotation.Responses.$200>;
  /**
   * delete-document-layer-annotation - Delete an Annotation in a Layer.
   *
   * This endpoint allows you to delete an annotation in the given layer.
   */
  'delete-document-layer-annotation'(
    parameters?: Parameters<
      Paths.DeleteDocumentLayerAnnotation.HeaderParameters &
        Paths.DeleteDocumentLayerAnnotation.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDocumentLayerAnnotation.Responses.$200>;
  /**
   * fetch-document-layer-annotation-comments - Get Comments For a Root Annotation in a Layer
   *
   * Use this endpoint to list all the comments attached to the given annotation in the document's layer with the specified name.
   */
  'fetch-document-layer-annotation-comments'(
    parameters?: Parameters<
      Paths.FetchDocumentLayerAnnotationComments.HeaderParameters &
        Paths.FetchDocumentLayerAnnotationComments.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.FetchDocumentLayerAnnotationComments.Responses.$200>;
  /**
   * create-document-layer-annotation-comments - Add Comments to a Root Annotation in a Layer
   *
   * Use this endpoint to add new comments to the existing annotation in the given layer.
   * Note that the annotation needs to be either a markup annotation or a comment marker.
   * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine if they are not provided.
   */
  'create-document-layer-annotation-comments'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerAnnotationComments.HeaderParameters &
        Paths.CreateDocumentLayerAnnotationComments.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerAnnotationComments.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerAnnotationComments.Responses.$200>;
  /**
   * create-document-layer-comments - Add Comments in a Layer
   *
   * Use this endpoint to add comments and their root annotation at the same time.
   *
   * Note that the annotation needs to be either a markup annotation or a comment marker.
   *
   * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine
   * if they are not provided.
   */
  'create-document-layer-comments'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerComments.HeaderParameters &
        Paths.CreateDocumentLayerComments.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerComments.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerComments.Responses.$200>;
  /**
   * create-document-layer-redactions - Create Redactions in a Layer
   *
   * Use this endpoint to add multiple redaction annotations in a single request.
   *
   * Available strategies are:
   *
   * - `preset` - creates redactions on top of text and annotations matching the predefined
   *   pattern. For the full list of presets, see the request schema.
   * - `regex` - creates redactions on top of text and annotations matching the provided
   *   regular expression. The regular expressions needs to comply with the
   *   [ICU regex standard](http://userguide.icu-project.org/strings/regexp).
   * - `text` - creates redactions on top of text and annotations matching the provided string
   *   search term. Note that the search is case-insensitive.
   *
   * The shape of the `strategyOptions` depends on the chosen strategy. Currently each
   * strategy supports the `includeAnnotations` options (`true` by default), which controls
   * whether redactions should also cover annotations whose content match the search query.
   *
   * The `user_id` key allows to specify the owner of the newly created annotations,
   * and `content` allows to override their visual properties.
   *
   * On success, an array of created redaction annotations is returned.
   */
  'create-document-layer-redactions'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerRedactions.HeaderParameters &
        Paths.CreateDocumentLayerRedactions.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerRedactions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerRedactions.Responses.$200>;
  /**
   * apply-document-layer-redactions - Apply Redactions to a Layer
   *
   * Use this endpoint to apply existing redaction annotation to the default layer, erasing
   * any content and annotations below them.
   *
   * Applying redactions removes the existing redaction annotations and rewrites the underlying
   * PDF file.
   *
   * Note that regardless of applied redactions, the content and annotations from the originally
   * uploaded file are always stored at the document's immutable base layer.
   * In some circumstances, e.g. due to legal requirements, this may be undesirable.
   * In these cases, you can delete the document after applying redactions, which will erase
   * all of the document's data.
   */
  'apply-document-layer-redactions'(
    parameters?: Parameters<
      Paths.ApplyDocumentLayerRedactions.HeaderParameters &
        Paths.ApplyDocumentLayerRedactions.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApplyDocumentLayerRedactions.Responses.$200>;
  /**
   * get-document-layer-form-field-values - Gets Layer's Form Field Values
   */
  'get-document-layer-form-field-values'(
    parameters?: Parameters<
      Paths.GetDocumentLayerFormFieldValues.HeaderParameters &
        Paths.GetDocumentLayerFormFieldValues.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerFormFieldValues.Responses.$200>;
  /**
   * update-document-layer-form-field-values - Update Layer's Form Field Values
   *
   * To update existing form field values, send a POST request with a JSON body containing the list of form fields and their values.
   */
  'update-document-layer-form-field-values'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerFormFieldValues.HeaderParameters &
        Paths.UpdateDocumentLayerFormFieldValues.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerFormFieldValues.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerFormFieldValues.Responses.$200>;
  /**
   * sign-document-layer - Digitally Sign a Layer
   *
   * Use this endpoint to digitally sign a document's layer.
   *
   * You can apply a signature to a specific Instant layer. This lets you maintain independent
   * versions of the same document with separate signatures. For example, if you're working on
   * a contract, you can maintain two layers: one for the original document, and one for a copy
   * that will be digitally signed.
   *
   * You can sign an Instant layer using the parent document ID and the layer name. If you use a
   * layer name that maps to a non-existing layer, it will be copied automatically from the document
   * base layer and then signed.
   *
   * ### Signing Service
   *
   * The actual signing of the current state of the document is performed by a signing service callback
   * that needs to be maintained and operated separately. It needs to expose a single HTTP endpoint
   * that receives all callbacks required during the document signing flow differentiated by an `action`
   * property in the request's JSON.
   *
   * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
   *
   * ### Watermark and Graphic
   *
   * The appearance of a digital signature can include a watermark, which is an image typically depicting a company logo or stamp placed in the center, and a graphic, which is an image usually containing the signer's name in the form of a handwritten signature image positioned on the left side of the signature. You can find more information about these different signature appearance options at https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/configure-digital-signature-appearance/.
   *
   * To specify the image to be used as the watermark or graphic in the digital signature, send a multipart request
   * with the `application/json` part containing the sign request options and the `image` part containing the watermark image, and the `graphicImage` part containing the graphic.
   */
  'sign-document-layer'(
    parameters?: Parameters<
      Paths.SignDocumentLayer.HeaderParameters & Paths.SignDocumentLayer.PathParameters
    > | null,
    data?: Paths.SignDocumentLayer.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.SignDocumentLayer.Responses.$200>;
  /**
   * refresh-document-layer-signatures - Refresh signatures on a document's layer
   *
   * Use this endpoint to refresh LTV signatures for the given document layer.
   *
   * Learn more about CAdES and LTV signatures here:
   * https://www.nutrient.io/guides/web/signatures/digital-signatures/standards/#understanding-ltv-pades-b-lt
   *
   * It will refresh the signatures with IDs provided in the `signatureFQNs` field.
   * If `signatureFQNs` is not set, or empty, then all the signatures in the document layer will be refreshed.
   */
  'refresh-document-layer-signatures'(
    parameters?: Parameters<
      Paths.RefreshDocumentLayerSignatures.HeaderParameters &
        Paths.RefreshDocumentLayerSignatures.PathParameters
    > | null,
    data?: Paths.RefreshDocumentLayerSignatures.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RefreshDocumentLayerSignatures.Responses.$200>;
  /**
   * get-document-layer-digital-signatures - Get Digital Signatures in a Layer
   *
   * Returns a layer's digital signatures.
   *
   * You can fetch the digital signature status of an individual layer using the parent
   * document ID and the layer name.
   *
   * If you use a layer name that maps to a non-existing layer, Document Engine will report
   * the status of the document base layer without creating a new one:
   */
  'get-document-layer-digital-signatures'(
    parameters?: Parameters<
      Paths.GetDocumentLayerDigitalSignatures.HeaderParameters &
        Paths.GetDocumentLayerDigitalSignatures.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerDigitalSignatures.Responses.$200>;
  /**
   * get-document-layer-xfdf - Export Layer's Annotations as an XFDF
   */
  'get-document-layer-xfdf'(
    parameters?: Parameters<
      Paths.GetDocumentLayerXfdf.HeaderParameters & Paths.GetDocumentLayerXfdf.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * get-document-layer-instant-json - Export Layer's Records as an Instant JSON
   */
  'get-document-layer-instant-json'(
    parameters?: Parameters<
      Paths.GetDocumentLayerInstantJson.HeaderParameters &
        Paths.GetDocumentLayerInstantJson.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerInstantJson.Responses.$200>;
  /**
   * fetch-document-layer-info - Fetch Document Layer Information
   *
   * This endpoint allows you to fetch the page count,
   * the dimensions of each page, and the document's permissions.
   */
  'fetch-document-layer-info'(
    parameters?: Parameters<
      Paths.FetchDocumentLayerInfo.HeaderParameters & Paths.FetchDocumentLayerInfo.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.FetchDocumentLayerInfo.Responses.$200>;
  /**
   * layer-apply-instant-json - Apply an Instant JSON to a Layer
   */
  'layer-apply-instant-json'(
    parameters?: Parameters<
      Paths.LayerApplyInstantJson.HeaderParameters & Paths.LayerApplyInstantJson.PathParameters
    > | null,
    data?: Paths.LayerApplyInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.LayerApplyInstantJson.Responses.$200>;
  /**
   * download-document-layer-with-instant-json - Download a PDF, Applying the Instant JSON to a Layer
   *
   * To import an Instant JSON file and download the resulting PDF, you can
   * `POST` a `multipart/form` request including an `instant.json` file.
   *
   * This will create a new PDF containing the latest annotations of the
   * default layer, import the uploaded Instant JSON, and respond with the
   * resulting PDF. Please note that this action will not modify the
   * existing document, but rather only import the Instant JSON on a
   * temporary file that will be downloaded in the process.
   */
  'download-document-layer-with-instant-json'(
    parameters?: Parameters<
      Paths.DownloadDocumentLayerWithInstantJson.HeaderParameters &
        Paths.DownloadDocumentLayerWithInstantJson.PathParameters
    > | null,
    data?: Paths.DownloadDocumentLayerWithInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * copy-document-layer-with-instant-json - Copy the Layer Into a New Document, Applying the Instant JSON
   *
   * If the content type of the request is `multipart/form-data`, the document with the chosen layer
   * will be copied, and the uploaded `instant.json` file will be imported into the default layer.
   *
   * If the content type is `application/json`, the request body is ignored and the layer is copied
   * as-is, without any modifications to the default layer.
   */
  'copy-document-layer-with-instant-json'(
    parameters?: Parameters<
      Paths.CopyDocumentLayerWithInstantJson.HeaderParameters &
        Paths.CopyDocumentLayerWithInstantJson.PathParameters
    > | null,
    data?: Paths.CopyDocumentLayerWithInstantJson.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CopyDocumentLayerWithInstantJson.Responses.$200>;
  /**
   * get-document-layer-text - Fetch Document Text
   *
   * This endpoint allows you to fetch the text of all pages in a document.
   */
  'get-document-layer-text'(
    parameters?: Parameters<
      Paths.GetDocumentLayerText.HeaderParameters & Paths.GetDocumentLayerText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerText.Responses.$200>;
  /**
   * get-document-layer-page-text - Get Text of a Page in a Layer
   */
  'get-document-layer-page-text'(
    parameters?: Parameters<
      Paths.GetDocumentLayerPageText.HeaderParameters &
        Paths.GetDocumentLayerPageText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerPageText.Responses.$200>;
  /**
   * get-document-layer-page-highlighted-text - Get Highlighted Text on a Page in a Layer
   *
   * Highlighted text in the document refers to any text that is highlighted with any of the
   * markup annotations like underline, strikeout, or highlight.
   *
   * Note that the data returned by this endpoint is just an approximation and might not always
   * exactly reflect the text highlighted in the PDF file.
   */
  'get-document-layer-page-highlighted-text'(
    parameters?: Parameters<
      Paths.GetDocumentLayerPageHighlightedText.HeaderParameters &
        Paths.GetDocumentLayerPageHighlightedText.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerPageHighlightedText.Responses.$200>;
  /**
   * render-document-layer-page - Renders a Page in a Layer
   *
   * Returns an image with the rendered page from a document. Requires exactly one of
   * `width` and `height` query parameters to set the required dimensions of the rendered image.
   *
   * Annotation AP streams are not rendered by default, use `render_ap_streams` query parameter
   * to enable AP streams rendering.
   *
   * Rendered image format depends on the value of the `Accept` header. Supported content types
   * are `image/png` (default) and `image/webp`.
   */
  'render-document-layer-page'(
    parameters?: Parameters<
      Paths.RenderDocumentLayerPage.QueryParameters &
        Paths.RenderDocumentLayerPage.HeaderParameters &
        Paths.RenderDocumentLayerPage.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RenderDocumentLayerPage.Responses.$200>;
  /**
   * document-layer-apply-instructions - Edit the Layer and Persist the Result
   *
   * This endpoints allows to use instructions pipeline for document modification.
   *
   * The current document's layer can be referred to by using `#self` anchor.
   * ```
   * {
   *   "document": { "id": "#self" }
   * }
   * ```
   *
   * The result of the processing will replace the layer after successful completion.
   *
   * Please refer to [Build Instructions](#tag/Build-API) schema for all options.
   */
  'document-layer-apply-instructions'(
    parameters?: Parameters<
      Paths.DocumentLayerApplyInstructions.HeaderParameters &
        Paths.DocumentLayerApplyInstructions.PathParameters
    > | null,
    data?: Paths.DocumentLayerApplyInstructions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DocumentLayerApplyInstructions.Responses.$200>;
  /**
   * get-document-layer-bookmarks - Gets Layer's Bookmarks
   */
  'get-document-layer-bookmarks'(
    parameters?: Parameters<
      Paths.GetDocumentLayerBookmarks.HeaderParameters &
        Paths.GetDocumentLayerBookmarks.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerBookmarks.Responses.$200>;
  /**
   * create-document-layer-bookmark - Create a Bookmark in a Layer
   *
   * Bookmarks can be created with and without specifying the ID for the bookmark. When no ID is specified,
   * Document Engine will assign a random ID to the bookmark. If you want to rely on a specific ID being the
   * ID of the created bookmark, the ID can be set with the `id` property in the JSON payload.
   * This is useful if you, for example, want a bookmark with the same ID in multiple documents.
   */
  'create-document-layer-bookmark'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerBookmark.HeaderParameters &
        Paths.CreateDocumentLayerBookmark.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerBookmark.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerBookmark.Responses.$200>;
  /**
   * update-document-layer-bookmark - Update a Bookmark in a Layer
   */
  'update-document-layer-bookmark'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerBookmark.HeaderParameters &
        Paths.UpdateDocumentLayerBookmark.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerBookmark.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerBookmark.Responses.$200>;
  /**
   * delete-document-layer-bookmark - Delete a Bookmark in a Layer
   */
  'delete-document-layer-bookmark'(
    parameters?: Parameters<
      Paths.DeleteDocumentLayerBookmark.HeaderParameters &
        Paths.DeleteDocumentLayerBookmark.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteDocumentLayerBookmark.Responses.$200>;
  /**
   * get-document-layer-embedded-files - Get Layers's Embedded Files
   *
   * Returned records describe files that are attached to a layer.
   *
   * Use attachments API to retrieve the actual file contents.
   */
  'get-document-layer-embedded-files'(
    parameters?: Parameters<
      Paths.GetDocumentLayerEmbeddedFiles.HeaderParameters &
        Paths.GetDocumentLayerEmbeddedFiles.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerEmbeddedFiles.Responses.$200>;
  /**
   * get-document-layer-form-fields - Get Form Fields in a Layer
   *
   * You can use this endpoint to fetch all form fields from a document's layer.
   */
  'get-document-layer-form-fields'(
    parameters?: Parameters<
      Paths.GetDocumentLayerFormFields.HeaderParameters &
        Paths.GetDocumentLayerFormFields.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerFormFields.Responses.$200>;
  /**
   * update-document-layer-form-fields - Update Form Fields in a Layer
   *
   * This endpoint allows you to update an existing form field in a document's layer.
   *
   * The `id` is required. If you provide the `group` in this operation then the new group
   * will cascade to all the widgets and form field values associated  with this field in this layer.
   */
  'update-document-layer-form-fields'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerFormFields.HeaderParameters &
        Paths.UpdateDocumentLayerFormFields.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerFormFields.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerFormFields.Responses.$200>;
  /**
   * create-document-layer-form-fields - Create Form Fields in a Layer
   *
   * This endpoint allows you to add a new form field to a layer of the document.
   *
   * The `id` is optional, and will be generated by Document Engine if not provided. The `group` of the form field
   * will be inherited by the widgets and form field values associated with it.
   * The `user_id` is set as the creator of the form field.
   */
  'create-document-layer-form-fields'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerFormFields.HeaderParameters &
        Paths.CreateDocumentLayerFormFields.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerFormFields.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerFormFields.Responses.$200>;
  /**
   * remove-document-layer-form-fields - Delete Form Fields in a Layer
   *
   * This endpoint allows you to remove multiple form fields from a document's layer.
   *
   * Deleting a form field will cascade delete all its associated widgets and values in the specified layer.
   *
   * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldIds`
   * that is set to either a JSON array of IDs, or "all" in order to remove all form fields in one request.
   */
  'remove-document-layer-form-fields'(
    parameters?: Parameters<
      Paths.RemoveDocumentLayerFormFields.HeaderParameters &
        Paths.RemoveDocumentLayerFormFields.PathParameters
    > | null,
    data?: Paths.RemoveDocumentLayerFormFields.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentLayerFormFields.Responses.$200>;
  /**
   * get-document-layer-form-field - Get a Form Field in a Layer
   *
   * Use this endpoint to get the form field with a specified ID from a layer of the document
   */
  'get-document-layer-form-field'(
    parameters?: Parameters<
      Paths.GetDocumentLayerFormField.HeaderParameters &
        Paths.GetDocumentLayerFormField.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerFormField.Responses.$200>;
  /**
   * get-document-layer-widgets - Get Widgets in a Layer
   *
   * You can use this endpoint to fetch all widgets from a layer of the documents.
   * The response will also contain details of the formField each widget is associated with,
   * if it is associated with a form field.
   */
  'get-document-layer-widgets'(
    parameters?: Parameters<
      Paths.GetDocumentLayerWidgets.HeaderParameters & Paths.GetDocumentLayerWidgets.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerWidgets.Responses.$200>;
  /**
   * update-document-layer-widgets - Update Widgets in a Layer
   *
   * This endpoint allows you to update an existing widget in a layer of the document
   */
  'update-document-layer-widgets'(
    parameters?: Parameters<
      Paths.UpdateDocumentLayerWidgets.HeaderParameters &
        Paths.UpdateDocumentLayerWidgets.PathParameters
    > | null,
    data?: Paths.UpdateDocumentLayerWidgets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateDocumentLayerWidgets.Responses.$200>;
  /**
   * create-document-layer-widgets - Create Widgets in a Layer
   *
   * This endpoint allows you to add a new widget to a layer of the document
   *
   * The `id` is optional, and will be generated by Document Engine if not provided.
   */
  'create-document-layer-widgets'(
    parameters?: Parameters<
      Paths.CreateDocumentLayerWidgets.HeaderParameters &
        Paths.CreateDocumentLayerWidgets.PathParameters
    > | null,
    data?: Paths.CreateDocumentLayerWidgets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateDocumentLayerWidgets.Responses.$200>;
  /**
   * remove-document-layer-widgets - Delete Widgets in a Layer
   *
   * This endpoint allows you to remove multiple widgets from a layer of the document.
   *
   * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldWidgetIds`
   * that is set to either a JSON array of IDs, or "all" in order to remove all widgets in one request.
   */
  'remove-document-layer-widgets'(
    parameters?: Parameters<
      Paths.RemoveDocumentLayerWidgets.HeaderParameters &
        Paths.RemoveDocumentLayerWidgets.PathParameters
    > | null,
    data?: Paths.RemoveDocumentLayerWidgets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RemoveDocumentLayerWidgets.Responses.$200>;
  /**
   * get-document-layer-widget - Get a Widget in a Layer
   *
   * Use this endpoint to get the widget with the specified ID from a layer of the document
   */
  'get-document-layer-widget'(
    parameters?: Parameters<
      Paths.GetDocumentLayerWidget.HeaderParameters & Paths.GetDocumentLayerWidget.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDocumentLayerWidget.Responses.$200>;
  /**
   * get-fonts-in-layer - Get fonts
   */
  'get-fonts-in-layer'(
    parameters?: Parameters<
      Paths.GetFontsInLayer.HeaderParameters & Paths.GetFontsInLayer.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFontsInLayer.Responses.$200>;
  /**
   * get-font-substitutions-in-layer - Get font substitutions
   *
   * This endpoint allows you to get font substitutions that were set for the specific document layer.
   *
   * Note that font substitutions returned by this endpoint will include the font substitutions defined for the specified document layer,
   * as well as any font substitutions defined in the `font-substitutions.json` configuration file, if a `font-substitutions.json` file is mounted on Document Engine.
   *
   * The font substitutions for the document layer will be merged with the font substitutions in `font-substitutions.json` if any,
   * with the substitutions in the document layer having priority over any substitutions `font-substitutions.json` may define.
   * It is this combination of font substitutions that will be applied by Document Engine
   * when performing operations on the document layer where a font is unavailable and needs to be substituted.
   *
   * Learn more about the `font-substitutions.json` file from the documentation available here:
   * https://www.nutrient.io/guides/document-engine/configuration/custom-fonts/#font-substitutions
   */
  'get-font-substitutions-in-layer'(
    parameters?: Parameters<
      Paths.GetFontSubstitutionsInLayer.HeaderParameters &
        Paths.GetFontSubstitutionsInLayer.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFontSubstitutionsInLayer.Responses.$200>;
  /**
   * update-font-substitutions-in-layer - Replaces font substitutions in the document layer
   *
   * This endpoint allows you to replace font substitutions in the specified document layer.
   * It will delete any existing font substitutions for the document layer and replace them with these new ones
   *
   * If no font substitutions existed for the document layer prior, it will create them.
   * Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
   */
  'update-font-substitutions-in-layer'(
    parameters?: Parameters<
      Paths.UpdateFontSubstitutionsInLayer.HeaderParameters &
        Paths.UpdateFontSubstitutionsInLayer.PathParameters
    > | null,
    data?: Paths.UpdateFontSubstitutionsInLayer.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateFontSubstitutionsInLayer.Responses.$200>;
  /**
   * delete-font-substitutions-in-layer - Deletes all font substitutions in the document layer
   *
   * This endpoint allows you to delete all font substitutions in the document layer.
   *
   * Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
   */
  'delete-font-substitutions-in-layer'(
    parameters?: Parameters<
      Paths.DeleteFontSubstitutionsInLayer.HeaderParameters &
        Paths.DeleteFontSubstitutionsInLayer.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteFontSubstitutionsInLayer.Responses.$200>;
  /**
   * get-ocg-layers-in-layer - Get available OCG layers for layer
   */
  'get-ocg-layers-in-layer'(
    parameters?: Parameters<
      Paths.GetOcgLayersInLayer.HeaderParameters & Paths.GetOcgLayersInLayer.PathParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetOcgLayersInLayer.Responses.$200>;
  /**
   * copy-document - Copy a Document
   *
   * You can use this endpoint to copy the document, without having to reupload
   * it to Document Engine
   *
   * The copy includes the latest version of all layers and their annotations
   * from the original document.
   *
   * A common use case for copying a document is to create an individual document
   * for each user, allowing different users work on the same file without seeing
   * each other's annotations. However, we recommend leveraging named Instant Layers
   * for such scenarios as they provide more efficient API to manage different document versions.
   */
  'copy-document'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CopyDocument.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CopyDocument.Responses.$200>;
  /**
   * validate-pdfa - Validate PDF/A Compliance
   *
   * This endpoint allows you to validate the PDF/A compliance of a PDF file and returns a validation report.
   */
  'validate-pdfa'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ValidatePdfa.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ValidatePdfa.Responses.$200>;
  /**
   * revoke-jwt - Revoke JWT
   *
   * This endpoint allows you to revoke JSON Web Tokens created by your service. Revoked tokens are invalided before they would normally expire. On top of preventing any future authentications with revoked JWTs, any active authenticated session is also destroyed immediately.
   *
   * It's only possible to revoke JWTs with an ID that needs to be specified in their `jti` claim. Note that revoking a particular JWTs will revoke all JWTs with the same ID as well.
   */
  'revoke-jwt'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.RevokeJwt.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RevokeJwt.Responses.$200>;
  /**
   * get-secrets - List Secrets
   *
   * Gets all non-expired secret of the specified type.
   */
  'get-secrets'(
    parameters?: Parameters<Paths.GetSecrets.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetSecrets.Responses.$200>;
  /**
   * create-secret - Add a Secret
   *
   * Creates a new secret. This does not replace previous secrets of this type.
   */
  'create-secret'(
    parameters?: Parameters<Paths.CreateSecret.PathParameters> | null,
    data?: Paths.CreateSecret.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateSecret.Responses.$200>;
  /**
   * rotate-secret - Rotate a Secret
   *
   * Current secrets don't expire. To change current secrets, you'll need to rotate them.
   */
  'rotate-secret'(
    parameters?: Parameters<Paths.RotateSecret.PathParameters> | null,
    data?: Paths.RotateSecret.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.RotateSecret.Responses.$200>;
  /**
   * expire-secret - Update a Secret
   *
   * Updates existing secret. This is usually done to update the expiration date of existing secrets.
   */
  'expire-secret'(
    parameters?: Parameters<Paths.ExpireSecret.PathParameters> | null,
    data?: Paths.ExpireSecret.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ExpireSecret.Responses.$200>;
}

export interface PathsDictionary {
  ['/api/documents']: {
    /**
     * list-documents - List Documents
     *
     * Lists documents with cursor-based pagination support. Documents can be sorted and filtered.
     *
     * The response includes a list of documents along with pagination metadata (next_cursor and prev_cursor)
     * and total document count. The cursors are Base64 URL encoded JSON arrays containing direction and
     * cursor information used for pagination.
     */
    'get'(
      parameters?: Parameters<Paths.ListDocuments.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListDocuments.Responses.$200>;
    /**
     * upload-document - Create a Document
     *
     * ## Basic Usage
     * To create a new document from a file, `POST` its contents to
     * `/api/documents`, specifying the correct content type.
     *
     * You can create a document in any of the supported file formats and then use the functionality of both the Web API and Document Engine-Server API.
     *
     * Document Engine will extract the title of the document from the file metadata if
     * it is present.
     *
     * ## Advanced Usage
     *
     * Document Engine also supports uploading files as `multipart/form-data`. When
     * using this method, Document Engine will try reading the title from the file metadata
     * and fall back to the filename if the metadata is not available.
     *
     * When using `multipart/form-data` you can also attach an XFDF or Instant JSON file to be
     * applied to the imported document. This feature is available both for direct file upload
     * and importing from remote URL, however, note that you should specify either `url` (and
     * optionally `sha256`) or `file`, not both at the same time.
     *
     * While using this request format you can also specify a custom `title` or `document_id`.
     *
     * ## Adding a Document from a URL
     *
     * You can also add a document to Document Engine by specifying the URL
     * the document can be fetched from. By default, a document added by a URL is not
     * persistently stored in Document Engine and will be fetched from the URL
     * when necessary. This is useful when you already have a document storage
     * solution and you want Document Engine to fetch the documents from your
     * document storage. You can override this default storage behavior to store
     * the document persistently by setting a `copy_asset_to_storage_backend` option to `true`.
     *
     * To add a document from a URL, `POST` its URL — and optionally, its
     * SHA256 hash, your `document_id`, and your `title` — using the
     * `application/json` content type.
     *
     * ## Processing Document on Upload
     *
     * Document Engine supports processing documents via Build API. This allows you to
     * assemble a PDF from multiple parts, such as an existing document in supported content type, a blank page,
     * or an HTML page. You can apply one or more actions, such as watermarking, rotating pages, or importing
     * annotations. Once the entire PDF is generated from its parts, you can also apply additional actions,
     * such as optical character recognition (OCR), to the assembled PDF itself.
     *
     * To Process the document using The Build API, you'll need to provide all inputs and the [Build instructions](#tag/Build-API):
     * * Use `multipart/form-data` with special `instructions` part with the processing instructions. You can pass any options allowed
     * by the other document creation methods - `document_id`, `title`, etc. - as parts in the multipart request.
     * * If all inputs are provided as remote URLs, the multipart request isn't necessary and can be simplified to a simple
     * non-multipart request with the `application/json` body with the processing instructions provided as `instructions` key.
     *
     * ## Configuring Storage
     * By default, Document Engine will store all assets associated with the document - images, PDF, source files that were converted, etc. in the built-in storage.
     * If the `ASSET_STORAGE_BACKEND` is configured, then Document Engine will use that instead of `built_in`.
     *
     * That said, when uploading a document you can optionally pass in some storage configuration options
     * to control where the document's assets are stored by setting the `storage` field.
     * For example, you can specify the exact s3 bucket for storage of the document's assets.
     * You can also specify that a given document should be stored in Azure Blob Storage or with the `built_in` storage.
     *
     * This configuration will override any default storage backends set in Document Engine's `ASSET_STORAGE_BACKEND` configuration.
     * and it will be used to store all assets associated with the document - images, PDF, source files that were converted, etc.
     *
     * > ⚠️ NOTE: The `backend` configured in `storage` must be enabled as either the main storage backend or as a fallback otherwise the upload will be done using the default enabled storage after logging a warning.
     * > Learn more about configuring Asset Storage for Document Engine [here](https://www.nutrient.io/guides/document-engine/configuration/asset-storage/#migration-between-asset-storage-options)
     */
    'post'(
      parameters?: Parameters<Paths.UploadDocument.HeaderParameters> | null,
      data?: Paths.UploadDocument.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UploadDocument.Responses.$200>;
    /**
     * bulk-delete-documents - Bulk Delete Documents
     *
     * Deletes multiple documents based on the provided filter criteria. This endpoint allows for efficient batch
     * deletion of documents matching specified parameters.
     *
     * At least one filter parameter must be provided (`title`, `document_id`, `start_date`, or `end_date`).
     *
     * When successful, the endpoint returns a summary of the deletion operation, including count of successfully
     * deleted documents and any skipped documents.
     */
    'delete'(
      parameters?: Parameters<Paths.BulkDeleteDocuments.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.BulkDeleteDocuments.Responses.$200>;
  };
  ['/api/async/jobs/{jobId}']: {
    /**
     * get-async-job-status - Get the status of an async job
     *
     * Get the status of a previously scheduled asynchronous job
     *
     * If a job is `cancelled`, simply retrying the request won't help.
     * You might need to make changes to Document Engine's configuration and restart your Document Engine instances.
     * For example, a cancellation could occur if you attempted an asset migration job to a storage backend that's not enabled in your Document Engine configuration.
     *
     * If a job is `expired`, then the job as well as its output assets (PDFs, images etc.) - if any,
     * will have been deleted and thus be unavailable for download. Attempts to check the status of that job return a `404` not found error.
     * You need to redo an expired job to regenerate those assets.
     * You can configure the expiration time for jobs by setting the `ASYNC_JOBS_TTL` option in the Document Engine configuration.
     * The default value is 2 days.
     */
    'get'(
      parameters?: Parameters<Paths.GetAsyncJobStatus.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetAsyncJobStatus.Responses.$200>;
  };
  ['/api/fonts']: {
    /**
     * get-global-fonts - Get global fonts
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetGlobalFonts.Responses.$200>;
  };
  ['/api/font_substitutions']: {
    /**
     * get-configured-font-substitutions - Get the list of font substitutions in the configured `font-substitutions.json` file, if any.
     *
     * If a `font-substitutions.json` file has been mounted on Document Engine's container,
     * use this endpoint to get a list of the font substitutions defined in that file,
     *
     * Note that the font substitutions returned by this endpoint will be used by Document Engine
     * when processing all documents.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetConfiguredFontSubstitutions.Responses.$200>;
  };
  ['/api/documents/{documentId}']: {
    /**
     * delete-document - Delete a Document
     *
     * Deletes a document with all of its annotation, underlying PDF file and attachments
     * not referenced by other documents.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteDocument.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDocument.Responses.$200>;
  };
  ['/api/documents/{documentId}/outline.json']: {
    /**
     * get-document-outline - Get a Document Outline
     *
     * This endpoint allows you to fetch the outline of a document.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentOutline.HeaderParameters & Paths.GetDocumentOutline.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentOutline.Responses.$200>;
  };
  ['/api/documents/{documentId}/document_info']: {
    /**
     * fetch-document-info - Fetch Document Information
     *
     * This endpoint allows you to fetch the document's page count,
     * the dimensions of each page, and the document's permissions.
     */
    'get'(
      parameters?: Parameters<
        Paths.FetchDocumentInfo.HeaderParameters & Paths.FetchDocumentInfo.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.FetchDocumentInfo.Responses.$200>;
  };
  ['/api/documents/{documentId}/properties']: {
    /**
     * fetch-document-properties - Fetch Document Properties
     *
     * This endpoint allows you to fetch properties of a document
     * including its title, information about password-protection,
     * SHA256 hash of the content, and the storage mechanism used
     * for the underlying PDF file. All of them are set by Document Engine
     * when a document is uploaded.
     */
    'get'(
      parameters?: Parameters<Paths.FetchDocumentProperties.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.FetchDocumentProperties.Responses.$200>;
  };
  ['/api/documents/{documentId}/search']: {
    /**
     * search-document - Search for Text
     *
     * Use this endpoint to search in a whole document or a continuous range of pages.
     *
     * This API offers three different types of search, controlled via `type` query parameter:
     * - `text` (default) - simple, text search. By default, the search query is case insensitive,
     *    but you can change this by setting `case_sensitive` to `true`.
     * - `preset` - search using one of the predefined patterns. For the full list of presets,
     *    see the request parameters schema.
     * - `regex` - search using a regular expression. The regular expressions needs to comply
     *    with the [ICU regex standard](http://userguide.icu-project.org/strings/regexp). By
     *    default, the regular expression is case sensitive, but you can change that by setting the
     *    `case_sensitive` parameter to `false`.
     *
     * When using `text` search, the search query needs to be at least three characters long.
     *
     * By default, search results do not include annotations. If you want to
     * search inside annotations in the document, you can include a
     * `include_annotations` parameter set to `true`.
     */
    'get'(
      parameters?: Parameters<
        Paths.SearchDocument.QueryParameters &
          Paths.SearchDocument.HeaderParameters &
          Paths.SearchDocument.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchDocument.Responses.$200>;
  };
  ['/api/documents/{documentId}/pages/text']: {
    /**
     * get-document-text - Fetch Document Text
     *
     * This endpoint allows you to fetch the text of all pages in a document.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentText.HeaderParameters & Paths.GetDocumentText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentText.Responses.$200>;
  };
  ['/api/documents/{documentId}/pages/{pageIndex}/text']: {
    /**
     * get-document-page-text - Fetch Page Text
     *
     * This endpoint allows you to fetch the text of a specific page in a document.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentPageText.HeaderParameters & Paths.GetDocumentPageText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentPageText.Responses.$200>;
  };
  ['/api/documents/{documentId}/pages/{pageIndex}/highlighted']: {
    /**
     * get-document-page-highlighted-text - Fetch Highlighted Text on a Page
     *
     * Highlighted text in the document refers to any text that is highlighted with any of the
     * markup annotations, like underline, strikeout, or highlight.
     *
     * Note that the data returned by this endpoint is just an approximation and might not always
     * exactly reflect the text highlighted in the PDF file.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentPageHighlightedText.HeaderParameters &
          Paths.GetDocumentPageHighlightedText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentPageHighlightedText.Responses.$200>;
  };
  ['/api/documents/{documentId}/pages/{pageIndex}/image']: {
    /**
     * render-document-page - Render a Page
     *
     * Returns an image with the rendered page from a document. Requires exactly one of
     * `width` and `height` query parameters to set the required dimensions of the rendered image.
     *
     * Annotation AP streams are not rendered by default, use `render_ap_streams` query parameter
     * to enable AP streams rendering.
     *
     * Rendered image format depends on the value of the `Accept` header. Supported content types
     * are `image/png` (default) and `image/webp`.
     */
    'get'(
      parameters?: Parameters<
        Paths.RenderDocumentPage.QueryParameters &
          Paths.RenderDocumentPage.HeaderParameters &
          Paths.RenderDocumentPage.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RenderDocumentPage.Responses.$200>;
  };
  ['/api/documents/{documentId}/prerender']: {
    /**
     * prerender-document - Prerender a Document
     *
     * This endpoint allows you to pre-render documents in background so that they
     * are cached ahead of time by Document Engine.
     *
     * This speeds up loading times when opening documents via Nutrient Web SDK.
     * The rendering is done asynchronously, and future clients asking for the
     * document will receive the already cached, rendered pages. For more details
     * about how Document Engine caches work, please check out our
     * [Cache](https://www.nutrient.io/guides/document-engine/configuration/cache/) guide.
     *
     * You can customize prerendering by providing a range of pages to prerender
     * and an array of scale factors for prerendered images.
     *
     * > ⚠️ Note: Prerendering feature requires setting up the Redis cache.
     * > All Redis cache keys are set to expire after the configured `REDIS_TTL`. To opt out of using the `REDIS_TTL`
     * > for prerendered cache keys, set `USE_REDIS_TTL_FOR_PRERENDERING` to `false` in your configuration.
     */
    'post'(
      parameters?: Parameters<
        Paths.PrerenderDocument.HeaderParameters & Paths.PrerenderDocument.PathParameters
      > | null,
      data?: Paths.PrerenderDocument.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PrerenderDocument.Responses.$202>;
  };
  ['/api/build']: {
    /**
     * build-document - Process Documents And Download the Result
     *
     * This endpoint allows to use [Build instructions](#tag/Build-API) to process a document. This allows to
     * assemble a PDF from multiple parts, such as an existing document in supported content type, a blank page,
     * or an HTML page. You can apply one or more actions, such as watermarking, rotating pages, or importing
     * annotations. Once the entire PDF is generated from its parts, you can also apply additional actions,
     * such as optical character recognition (OCR), to the assembled PDF itself.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.BuildDocument.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.BuildDocument.Responses.$200>;
  };
  ['/api/documents/{documentId}/migrate_assets']: {
    /**
     * migrate-document-assets - Migrate a Document's Assets to the Storage in the Configuration
     *
     * This endpoint allows you to migrate all the assets that are associated with a document to a new storage backend.
     *
     * With this endpoint, you can migrate assets from one s3 compatible storage bucket, to another s3 compatible storage bucket.
     * You can also use this endpoint to migrate assets from the built_in storage to s3 or Azure and vice versa.
     *
     * This endpoint triggers an asynchronous migration operation.
     * If the request parameters are valid will return immediately with a `202 Accepted` response with a `jobId`
     * that you can use to track the status of the migration operation.
     *
     * You can track the status of the migration operation at `/api/async/jobs/{jobId}`
     *
     * > ⚠️ NOTE: The `backend` set in `storage` must be enabled as either the main storage backend or as a fallback otherwise migration will fail
     * > Learn more about configuring Asset Storage backends for Document Engine [here](https://www.nutrient.io/guides/document-engine/configuration/asset-storage/#migration-between-asset-storage-options)
     */
    'post'(
      parameters?: Parameters<
        Paths.MigrateDocumentAssets.HeaderParameters & Paths.MigrateDocumentAssets.PathParameters
      > | null,
      data?: Paths.MigrateDocumentAssets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.MigrateDocumentAssets.Responses.$202>;
  };
  ['/api/process_office_template']: {
    /**
     * process-office-template - Process Office Template And Download the Result
     *
     * This endpoint allows to populate the document template (in DOCX format) with corresponding data.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ProcessOfficeTemplate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ProcessOfficeTemplate.Responses.$200>;
  };
  ['/api/documents/{documentId}/apply_instructions']: {
    /**
     * document-apply-instructions - Process Documents And Persist the Result
     *
     * This endpoint allows to use [Build instructions](#tag/Build-API) to process a document.
     *
     * The current document can be referred to by using `#self` anchor.
     * ```
     * {
     *   "document": { "id": "#self" }
     * }
     * ```
     *
     * The result of the processing will replace the document's base layer after successful completion.
     */
    'post'(
      parameters?: Parameters<
        Paths.DocumentApplyInstructions.HeaderParameters &
          Paths.DocumentApplyInstructions.PathParameters
      > | null,
      data?: Paths.DocumentApplyInstructions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DocumentApplyInstructions.Responses.$200>;
  };
  ['/api/documents/{documentId}/apply_operations']: {
    /**
     * edit-and-persist-document-pdf - Edit the Document and Persist the Result
     *
     * > ⚠️ This endpoint is deprecated. Please use `/api/documents/{documentId}/apply_instructions` instead.
     *
     * This endpoint allows you to edit the document, performing transformations like
     * rotating, adding or deleting pages, and store the resulting PDF file at the
     * document's base layer.
     *
     * Editing the document affects the responses returned by other endpoints. For
     * example, removing a page also deletes all the annotations on that page. Similarly,
     * other functionality, like searching in a document will return different results.
     *
     * If you need to preserve the original document, PDF file, and related data,
     * we recommend leveraging Instant Layers and always using named layers.
     *
     * Note that in order to use this endpoint you need to have a document editing feature
     * enabled in your license.
     */
    'post'(
      parameters?: Parameters<
        Paths.EditAndPersistDocumentPdf.HeaderParameters &
          Paths.EditAndPersistDocumentPdf.PathParameters
      > | null,
      data?: Paths.EditAndPersistDocumentPdf.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.EditAndPersistDocumentPdf.Responses.$200>;
  };
  ['/api/documents/{documentId}/pdf_with_operations']: {
    /**
     * edit-and-download-document-pdf - Edit the Document and Download it
     *
     * > ⚠️ This endpoint is deprecated. Please use `/api/build` instead.
     *
     * This endpoint allows you to edit the document, performing transformations like
     * rotating, adding or deleting pages. After these operations are applied, the
     * Document Engine will return the result as a PDF file.
     *
     * Note that in order to use this endpoint you need to have a document editing feature
     * enabled in your license.
     *
     * ### Operations with external files
     *
     * In order to use `importDocument`, `applyInstantJson`, or `applyXfdf` operations, you need to use
     * `multipart/form-data` content type.
     */
    'post'(
      parameters?: Parameters<
        Paths.EditAndDownloadDocumentPdf.HeaderParameters &
          Paths.EditAndDownloadDocumentPdf.PathParameters
      > | null,
      data?: Paths.EditAndDownloadDocumentPdf.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/pdf']: {
    /**
     * download-document-pdf - Download the Document as a PDF
     *
     * This operation downloads the latest version of the document with annotations
     * as a PDF file.
     *
     * If the query parameter `source=true` is included in the request, the originally
     * uploaded version will be fetched instead.
     *
     * Additionally, you can download the flattened version of the file by providing
     * `flatten=true` query parameter. Note, however, that `source` and `flatten`
     * can't be used at the same time.
     *
     * To download a PDF/A conformant document, include the `type=pdfa` query parameter.
     * You can also specify the conformance of the PDF/A file by specifying the
     * `conformance=pdfa-1a` query parameter.
     */
    'get'(
      parameters?: Parameters<
        Paths.DownloadDocumentPdf.QueryParameters &
          Paths.DownloadDocumentPdf.HeaderParameters &
          Paths.DownloadDocumentPdf.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * download-document-pdf-post - Download the Document as a PDF
     *
     * This operation downloads the latest version of the document as a PDF file.
     */
    'post'(
      parameters?: Parameters<
        Paths.DownloadDocumentPdfPost.HeaderParameters &
          Paths.DownloadDocumentPdfPost.PathParameters
      > | null,
      data?: Paths.DownloadDocumentPdfPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/document.xfdf']: {
    /**
     * get-document-xfdf - Export Annotations as an XFDF
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentXfdf.HeaderParameters & Paths.GetDocumentXfdf.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/document.json']: {
    /**
     * get-document-instant-json - Export Records as an Instant JSON
     *
     * Use this endpoint to export a document's records as an Instant JSON file. This includes annotations,
     * form field, form field values and bookmarks.
     *
     * This API allows to optionally specify the Instant JSON schema version for the annotations, controlled
     * via `annotation_version` query parameter. The value of `annotation_version` can be any valid
     * positive integer version. If the `annotation_version` parameter is not mentioned, or is
     * invalid, the latest version of Instant JSON schema will be exported.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentInstantJson.QueryParameters &
          Paths.GetDocumentInstantJson.HeaderParameters &
          Paths.GetDocumentInstantJson.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/apply_instant_json']: {
    /**
     * document-apply-instant-json - Apply an Instant JSON to Document
     *
     * To import an Instant JSON file and apply it to an existing document, you can POST a `multipart/form`
     * request including an `instant.json` file. This will modify the default layer of the document in place.
     * In case of success, the endpoint will respond with an empty JSON object.
     */
    'post'(
      parameters?: Parameters<
        Paths.DocumentApplyInstantJson.HeaderParameters &
          Paths.DocumentApplyInstantJson.PathParameters
      > | null,
      data?: Paths.DocumentApplyInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DocumentApplyInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/pdf_with_instant_json']: {
    /**
     * download-document-with-instant-json - Download a Document with Instant JSON
     *
     * To import an Instant JSON file and download the resulting PDF, you can
     * `POST` a `multipart/form` request including an `instant.json` file.
     *
     * This will create a new PDF containing the latest annotations of the
     * chosen layer, import the uploaded Instant JSON, and respond with the
     * resulting PDF. Please note that this action will not modify the
     * existing document, but rather only import the Instant JSON on a
     * temporary file that will be downloaded in the process.
     */
    'post'(
      parameters?: Parameters<
        Paths.DownloadDocumentWithInstantJson.HeaderParameters &
          Paths.DownloadDocumentWithInstantJson.PathParameters
      > | null,
      data?: Paths.DownloadDocumentWithInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/copy_with_instant_json']: {
    /**
     * copy-document-with-instant-json - Copy a Default Layer With Instant JSON
     *
     * This will create a new PDF containing the latest annotations of the default/base layer, optionally
     * import the uploaded Instant JSON, and persist the resulting PDF as a new document.
     *
     * If the content type of the request is `multipart/form-data`, the document with its default layer
     * will be copied, and uploaded `instant.json` file will be imported into the default layer.
     *
     * If the content type is `application/json`, the request body is ignored and the document is copied
     * as-is, without any modifications to the default layer.
     */
    'post'(
      parameters?: Parameters<
        Paths.CopyDocumentWithInstantJson.HeaderParameters &
          Paths.CopyDocumentWithInstantJson.PathParameters
      > | null,
      data?: Paths.CopyDocumentWithInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CopyDocumentWithInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/bookmarks']: {
    /**
     * get-document-bookmarks - Fetch Bookmarks
     *
     * Fetches all bookmarks in a given document.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentBookmarks.HeaderParameters & Paths.GetDocumentBookmarks.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentBookmarks.Responses.$200>;
    /**
     * create-document-bookmark - Create a Bookmark
     *
     * Bookmarks can be created with and without specifying the ID for the bookmark. When no ID is specified,
     * Document Engine will assign a random ID to the bookmark. If you want to rely on a specific ID being the
     * ID of the created bookmark, the ID can be set with the `id` property in the JSON payload.
     * This is useful if you, for example, want a bookmark with the same ID in multiple documents.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentBookmark.HeaderParameters & Paths.CreateDocumentBookmark.PathParameters
      > | null,
      data?: Paths.CreateDocumentBookmark.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentBookmark.Responses.$200>;
  };
  ['/api/documents/{documentId}/bookmarks/{bookmarkId}']: {
    /**
     * update-document-bookmark - Update a Bookmark
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentBookmark.HeaderParameters & Paths.UpdateDocumentBookmark.PathParameters
      > | null,
      data?: Paths.UpdateDocumentBookmark.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentBookmark.Responses.$200>;
    /**
     * delete-document-bookmark - Delete a Bookmark
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteDocumentBookmark.HeaderParameters & Paths.DeleteDocumentBookmark.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDocumentBookmark.Responses.$200>;
  };
  ['/api/documents/{documentId}/embedded-files']: {
    /**
     * get-document-embedded-files - Fetch Embedded Files
     *
     * Returned records describe files that are attached to a document.
     *
     * Use attachments API to retrieve the actual file contents.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentEmbeddedFiles.HeaderParameters &
          Paths.GetDocumentEmbeddedFiles.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentEmbeddedFiles.Responses.$200>;
  };
  ['/api/documents/{documentId}/annotations']: {
    /**
     * get-document-annotations - Get Annotations
     *
     * You can use this endpoint to fetch all annotations from the document's default layer.
     *
     * If `Accept: application/json` header is used, only the first 1000 annotations
     * from the page will be returned. If the page has more than 1000 annotations,
     * the `truncated` property in the response is set to `true`.
     *
     * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
     * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
     * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
     * individually or in batches before the complete response body has been received.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentAnnotations.HeaderParameters & Paths.GetDocumentAnnotations.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentAnnotations.Responses.$200>;
    /**
     * create-document-annotation - Create Annotations
     *
     * This endpoint allows you to add one or more new annotations to a document's default layer.
     *
     * The endpoint accepts two content types:
     * - `application/json` - in this case, the request body is a JSON representation of
     *   one or more annotation; you can check the schema for more details.
     * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
     *   with a new attachment. Annotations are one part of the request, followed by
     *   attachments.
     *
     * The annotation `id` is optional, and will be generated by Document Engine if not provided.
     * The `user_id` is set as the creator of the annotation.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentAnnotation.HeaderParameters &
          Paths.CreateDocumentAnnotation.PathParameters
      > | null,
      data?: Paths.CreateDocumentAnnotation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentAnnotation.Responses.$200>;
    /**
     * update-document-annotations - Update Annotations
     *
     * This endpoint allows you to update multiple annotations in the document's default layer.
     *
     * The annotation's content will be completely replaced with the `content` provided in
     * the request, and its `updatedBy` field will be set to `user_id`.
     *
     * The endpoint accepts two content types:
     * - `application/json` - in this case, the request body is a JSON representation of
     *   one or more annotation; you can check the schema for more details.
     * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
     *   with a new attachment. Annotations are one part of the request, followed by
     *   attachments.
     *
     * The annotation `id` is required, and it should correspond to an already existing annotation
     * in the document. The `user_id` is set as the creator of the annotation.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentAnnotations.HeaderParameters &
          Paths.UpdateDocumentAnnotations.PathParameters
      > | null,
      data?: Paths.UpdateDocumentAnnotations.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentAnnotations.Responses.$200>;
    /**
     * remove-document-annotations - Delete Annotations
     *
     * This endpoint allows you to remove multiple annotations from the document's default layer.
     *
     * The endpoint accepts one content type `application/json`. The request body is either a JSON
     * array of annotations ids, or "all" in order to remove all annotations in one go.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentAnnotations.HeaderParameters &
          Paths.RemoveDocumentAnnotations.PathParameters
      > | null,
      data?: Paths.RemoveDocumentAnnotations.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentAnnotations.Responses.$200>;
  };
  ['/api/documents/{documentId}/pages/{pageIndex}/annotations']: {
    /**
     * get-document-page-annotations - Fetch Annotations on a Page
     *
     * You can use this endpoint to fetch annotations on the given page from the document's
     * default layer.
     *
     * If `Accept: application/json` header is used, only the first 1000 annotations
     * from the page will be returned. If the page has more than 1000 annotations,
     * the `truncated` property in the response is set to `true`.
     *
     * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
     * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
     * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
     * individually or in batches before the complete response body has been received.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentPageAnnotations.HeaderParameters &
          Paths.GetDocumentPageAnnotations.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentPageAnnotations.Responses.$200>;
  };
  ['/api/documents/{documentId}/annotations/{annotationId}']: {
    /**
     * get-document-annotation - Get Annotation
     *
     * Use this endpoint to get the annotation from the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentAnnotation.HeaderParameters & Paths.GetDocumentAnnotation.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentAnnotation.Responses.$200>;
    /**
     * update-document-annotation - Update an Annotation
     *
     * This endpoint allows you to update an annotation in the document's default layer.
     *
     * The annotation's content will be completely replaced with the `content` provided in
     * the request, and its `updatedBy` field will be set to `user_id`.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentAnnotation.HeaderParameters &
          Paths.UpdateDocumentAnnotation.PathParameters
      > | null,
      data?: Paths.UpdateDocumentAnnotation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentAnnotation.Responses.$200>;
    /**
     * delete-document-annotation - Delete an Annotation
     *
     * This endpoint allows you to delete an annotation in the document's default layer.
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteDocumentAnnotation.HeaderParameters &
          Paths.DeleteDocumentAnnotation.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDocumentAnnotation.Responses.$200>;
  };
  ['/api/documents/{documentId}/form-field-values']: {
    /**
     * get-document-form-field-values - Get Form Field Values
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentFormFieldValues.HeaderParameters &
          Paths.GetDocumentFormFieldValues.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentFormFieldValues.Responses.$200>;
    /**
     * update-document-form-field-values - Update Form Field Values
     *
     * To update existing form field values, send a POST request with a JSON body containing the list of form fields and their values.
     */
    'post'(
      parameters?: Parameters<
        Paths.UpdateDocumentFormFieldValues.HeaderParameters &
          Paths.UpdateDocumentFormFieldValues.PathParameters
      > | null,
      data?: Paths.UpdateDocumentFormFieldValues.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentFormFieldValues.Responses.$200>;
  };
  ['/api/sign']: {
    /**
     * sign-file - Digitally Sign a PDF File
     *
     * Use this endpoint to digitally sign a PDF file.
     *
     * ### Signing Service
     *
     * The actual signing of the file is performed by a signing service callback that needs to be maintained
     * and operated separately. It needs to expose a single HTTP endpoint that receives all callbacks required
     * during the document signing flow differentiated by an `action` property in the request's JSON.
     *
     * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
     */
    'post'(
      parameters?: Parameters<Paths.SignFile.HeaderParameters> | null,
      data?: Paths.SignFile.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/inspect_signatures']: {
    /**
     * inspect-digital-signatures - Inspect Digital Signatures in a PDF file
     *
     * Returns PDF file's digital signatures.
     *
     * A document's digital signature status is computed by looking at all the digital signatures
     * included in the document
     *
     * The validity of a signature is determined by the signing certificate used to create it: If you're using a
     * custom certificate, you need to set up Document Engine to use a corresponding certificate store in order to
     * identify the signature as valid. Please check our
     * [guide article](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates)
     * on how to set up custom certificates for digital signature validation.
     */
    'post'(
      parameters?: Parameters<Paths.InspectDigitalSignatures.HeaderParameters> | null,
      data?: Paths.InspectDigitalSignatures.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.InspectDigitalSignatures.Responses.$200>;
  };
  ['/api/documents/{documentId}/sign']: {
    /**
     * sign-document - Digitally Sign a Document
     *
     * Use this endpoint to digitally sign a document.
     *
     * ### Signing Service
     *
     * The actual signing of the current state of the document is performed by a signing service callback
     * that needs to be maintained and operated separately. It needs to expose a single HTTP endpoint
     * that receives all callbacks required during the document signing flow differentiated by an `action`
     * property in the request's JSON.
     *
     * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
     *
     * ### Watermark and Graphic
     *
     * The appearance of a digital signature can include a watermark, which is an image typically depicting a company logo or stamp placed in the center, and a graphic, which is an image usually containing the signer's name in the form of a handwritten signature image positioned on the left side of the signature. You can find more information about these different signature appearance options at https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/configure-digital-signature-appearance/.
     *
     * To specify the image to be used as the watermark or graphic in the digital signature, send a multipart request
     * with the `application/json` part containing the sign request options and the `image` part containing the watermark image, and the `graphicImage` part containing the graphic.
     */
    'post'(
      parameters?: Parameters<
        Paths.SignDocument.HeaderParameters & Paths.SignDocument.PathParameters
      > | null,
      data?: Paths.SignDocument.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SignDocument.Responses.$200>;
  };
  ['/api/documents/{documentId}/refresh_ltv']: {
    /**
     * refresh-document-signatures - Refresh signatures on a document
     *
     * Use this endpoint to refresh LTV signatures for the given document.
     *
     * Learn more about CAdES and LTV signatures here:
     * https://www.nutrient.io/guides/web/signatures/digital-signatures/standards/#understanding-ltv-pades-b-lt
     *
     * It will refresh the signatures with IDs provided in the `signatureFQNs` field.
     * If `signatureFQNs` is not set, or empty, then all the signatures in the document will be refreshed.
     */
    'post'(
      parameters?: Parameters<
        Paths.RefreshDocumentSignatures.HeaderParameters &
          Paths.RefreshDocumentSignatures.PathParameters
      > | null,
      data?: Paths.RefreshDocumentSignatures.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RefreshDocumentSignatures.Responses.$200>;
  };
  ['/api/documents/{documentId}/signatures']: {
    /**
     * get-document-digital-signatures - Get Digital Signatures
     *
     * Returns a document's digital signatures.
     *
     * A document's digital signature status is computed by looking at all the digital signatures
     * included in the document. Digital signature status is automatically updated after each change
     * (e.g. adding a new annotation).
     *
     * The validity of a signature is determined by the signing certificate used to create it: If you're using a
     * custom certificate, you need to set up Document Engine to use a corresponding certificate store in order to
     * identify the signature as valid. Please check our
     * [guide article](https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/validation/#providing-trusted-root-certificates)
     * on how to set up custom certificates for digital signature validation.
     *
     * By default, the signature certificates are validated against the current time. This means that valid signatures
     * with expired certificates validate as expired. You can modify the `DIGITAL_SIGNATURE_CERTIFICATE_CHECK_TIME`
     * configuration option to `signing_time` if you wish to instead validate certificates against the signing time.
     *
     * > ⚠ Warning: If you're validating digital signature certificates against the signing time, special care should be
     * taken: By default, there's no way of knowing whether the creation time stored with the signature itself can be trusted.
     * To solve this issue, digital signatures need to use a Time Stamping Authority to provide a signed timestamp to embed.
     * Note that we don't validate the timestamp token's certificates — we always assume a valid proof of existence if it's present.
     * Thus, it's expected that the timestamps will be validated independently by your client code.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentDigitalSignatures.HeaderParameters &
          Paths.GetDocumentDigitalSignatures.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentDigitalSignatures.Responses.$200>;
  };
  ['/api/documents/{documentId}/annotations/{annotationId}/comments']: {
    /**
     * fetch-document-annotation-comments - Get Comments For a Root Annotation
     *
     * Use this endpoint to list all the annotation attached to the given annotation in the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.FetchDocumentAnnotationComments.HeaderParameters &
          Paths.FetchDocumentAnnotationComments.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.FetchDocumentAnnotationComments.Responses.$200>;
    /**
     * create-document-annotation-comments - Add Comments to a Root Annotation
     *
     * Use this endpoint to add new comments to an existing annotation in the document's default layer.
     * Note that the annotation needs to be either a markup annotation or a comment marker.
     * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine if they are not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentAnnotationComments.HeaderParameters &
          Paths.CreateDocumentAnnotationComments.PathParameters
      > | null,
      data?: Paths.CreateDocumentAnnotationComments.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentAnnotationComments.Responses.$200>;
  };
  ['/api/documents/{documentId}/comments']: {
    /**
     * create-document-comments - Adds Comments
     *
     * Use this endpoint to add comments and their root annotation at the same time.
     *
     * Note that the annotation needs to be either a markup annotation or a comment marker.
     *
     * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine
     * if they are not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentComments.HeaderParameters & Paths.CreateDocumentComments.PathParameters
      > | null,
      data?: Paths.CreateDocumentComments.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentComments.Responses.$200>;
  };
  ['/api/documents/{documentId}/redactions']: {
    /**
     * create-document-redactions - Create Redactions
     *
     * Use this endpoint to add multiple redaction annotations in a single request.
     *
     * Available strategies are:
     *
     * - `preset` - creates redactions on top of text and annotations matching the predefined
     *   pattern. For the full list of presets, see the request schema.
     * - `regex` - creates redactions on top of text and annotations matching the provided
     *   regular expression. The regular expressions needs to comply with the
     *   [ICU regex standard](http://userguide.icu-project.org/strings/regexp).
     * - `text` - creates redactions on top of text and annotations matching the provided string
     *   search term. Note that the search is case-insensitive.
     *
     * The shape of the `strategyOptions` depends on the chosen strategy. Currently each
     * strategy supports the `includeAnnotations` options (`true` by default), which controls
     * whether redactions should also cover annotations whose content match the search query.
     *
     * The `user_id` key allows to specify the owner of the newly created annotations,
     * and `content` allows to override their visual properties.
     *
     * On success, an array of created redaction annotations is returned.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentRedactions.HeaderParameters &
          Paths.CreateDocumentRedactions.PathParameters
      > | null,
      data?: Paths.CreateDocumentRedactions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentRedactions.Responses.$200>;
  };
  ['/api/documents/{documentId}/redact']: {
    /**
     * apply-document-redactions - Apply Redactions
     *
     * Use this endpoint to apply existing redaction annotation to the default layer, erasing
     * any content and annotations below them.
     *
     * Applying redactions removes the existing redaction annotations and rewrites the underlying
     * PDF file.
     *
     * Note that regardless of applied redactions, the content and annotations from the originally
     * uploaded file are always stored at the document's immutable base layer.
     * In some circumstances, e.g. due to legal requirements, this may be undesirable.
     * In these cases, you can delete the document after applying redactions, which will erase
     * all of the document's data.
     */
    'post'(
      parameters?: Parameters<
        Paths.ApplyDocumentRedactions.HeaderParameters &
          Paths.ApplyDocumentRedactions.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApplyDocumentRedactions.Responses.$200>;
  };
  ['/api/documents/{documentId}/attachments/{attachmentId}']: {
    /**
     * get-document-attachment - Get Attachment
     *
     * Attachments are files that are attached to a document.
     *
     * This endpoint provides a way to fetch an attachment's contents.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentAttachment.HeaderParameters & Paths.GetDocumentAttachment.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentAttachment.Responses.$200>;
  };
  ['/api/documents/{documentId}/form-fields']: {
    /**
     * get-document-form-fields - Get Form Fields
     *
     * You can use this endpoint to fetch all form fields from the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentFormFields.HeaderParameters & Paths.GetDocumentFormFields.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentFormFields.Responses.$200>;
    /**
     * create-document-form-field - Create Form Fields
     *
     * This endpoint allows you to add a new form field to the document's default layer.
     *
     * The `id` of each form field is optional, and will be generated by Document Engine if not provided.
     * The `user_id` is set as the creator of the form field. The `group` of the form field will be inherited by the widgets and values associated with it.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentFormField.HeaderParameters &
          Paths.CreateDocumentFormField.PathParameters
      > | null,
      data?: Paths.CreateDocumentFormField.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentFormField.Responses.$200>;
    /**
     * update-document-form-field - Update Form Fields
     *
     * This endpoint allows you to update an existing form field in the document's default layer
     *
     * The `id` is required. If you provide the `group` in this operation
     * then the new group will cascade to all the widgets and values associated with this field.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentFormField.HeaderParameters &
          Paths.UpdateDocumentFormField.PathParameters
      > | null,
      data?: Paths.UpdateDocumentFormField.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentFormField.Responses.$200>;
    /**
     * remove-document-form-fields - Delete Form Fields
     *
     * This endpoint allows you to remove multiple form fields from the document's default layer.
     *
     * Deleting a form field will cascade delete all its associated widgets and values.
     *
     * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldIds`
     * that is set to either a JSON array of IDs, or "all" in order to remove all form fields in one request.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentFormFields.HeaderParameters &
          Paths.RemoveDocumentFormFields.PathParameters
      > | null,
      data?: Paths.RemoveDocumentFormFields.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentFormFields.Responses.$200>;
  };
  ['/api/documents/{documentId}/form-fields/{formFieldId}']: {
    /**
     * get-document-form-field - Get a Form Field
     *
     * Use this endpoint to get the form field with the specified ID from the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentFormField.HeaderParameters & Paths.GetDocumentFormField.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentFormField.Responses.$200>;
  };
  ['/api/documents/{documentId}/form-field-widgets']: {
    /**
     * get-document-form-field-widgets - Get Widgets
     *
     * You can use this endpoint to fetch all widgets from the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentFormFieldWidgets.HeaderParameters &
          Paths.GetDocumentFormFieldWidgets.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentFormFieldWidgets.Responses.$200>;
    /**
     * create-document-form-field-widget - Create Widgets
     *
     * This endpoint allows you to add a new widget to the document's default layer.
     *
     * The `id` is optional, and will be generated by Document Engine if not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentFormFieldWidget.HeaderParameters &
          Paths.CreateDocumentFormFieldWidget.PathParameters
      > | null,
      data?: Paths.CreateDocumentFormFieldWidget.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentFormFieldWidget.Responses.$200>;
    /**
     * update-document-form-field-widgets - Update Widgets
     *
     * This endpoint allows you to update an existing widget in the document's default layer
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentFormFieldWidgets.HeaderParameters &
          Paths.UpdateDocumentFormFieldWidgets.PathParameters
      > | null,
      data?: Paths.UpdateDocumentFormFieldWidgets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentFormFieldWidgets.Responses.$200>;
    /**
     * remove-document-form-field-widgets - Delete Widgets
     *
     * This endpoint allows you to remove multiple widgets from the document's default layer.
     *
     * The endpoint accepts content type `application/json`. The request body is an object that is set to either
     * a JSON array of widget ids, or "all" in order to remove all widgets in one go.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentFormFieldWidgets.HeaderParameters &
          Paths.RemoveDocumentFormFieldWidgets.PathParameters
      > | null,
      data?: Paths.RemoveDocumentFormFieldWidgets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentFormFieldWidgets.Responses.$200>;
  };
  ['/api/documents/{documentId}/fonts']: {
    /**
     * get-fonts - Get fonts
     */
    'get'(
      parameters?: Parameters<
        Paths.GetFonts.HeaderParameters & Paths.GetFonts.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFonts.Responses.$200>;
  };
  ['/api/documents/{documentId}/font_substitutions']: {
    /**
     * get-font-substitutions - Get font substitutions
     *
     * This endpoint allows you to get font substitutions that were set for the specific document.
     *
     * Note that font substitutions returned by this endpoint will include the font substitutions defined for the specified document,
     * as well as any font substitutions defined in the `font-substitutions.json` configuration file, if a `font-substitutions.json` file is mounted on Document Engine.
     *
     * The font substitutions for the document will be merged with the font substitutions in `font-substitutions.json` if any,
     * with the substitutions in the document having priority over any substitutions `font-substitutions.json` may define.
     * It is this combination of font substitutions that will be applied by Document Engine
     * when performing operations on the document where a font is unavailable and needs to be substituted.
     *
     * Learn more about the `font-substitutions.json` file from the documentation available here:
     * https://www.nutrient.io/guides/document-engine/configuration/custom-fonts/#font-substitutions
     */
    'get'(
      parameters?: Parameters<
        Paths.GetFontSubstitutions.HeaderParameters & Paths.GetFontSubstitutions.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFontSubstitutions.Responses.$200>;
    /**
     * update-font-substitutions - Replaces font substitutions in the document
     *
     * This endpoint allows you to replace font substitutions in the document.
     * It will delete any existing font substitutions defined for the document and replace them with these new ones
     *
     * If no font substitutions existed for the document prior, it will create them.
     *
     * **Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.**
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateFontSubstitutions.HeaderParameters &
          Paths.UpdateFontSubstitutions.PathParameters
      > | null,
      data?: Paths.UpdateFontSubstitutions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateFontSubstitutions.Responses.$200>;
    /**
     * delete-font-substitutions - Deletes all font substitutions in the document
     *
     * This endpoint allows you to delete all font substitutions in the document.
     * Note that it won't delete other font substitutions that are associated with a different layer.
     * To delete the font substitutions in a specific layer, make a request to the specified layer
     *
     * Also note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteFontSubstitutions.HeaderParameters &
          Paths.DeleteFontSubstitutions.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteFontSubstitutions.Responses.$200>;
  };
  ['/api/documents/{documentId}/form-field-widgets/{formFieldWidgetId}']: {
    /**
     * get-document-form-field-widget - Get a Widget
     *
     * Use this endpoint to get the widget with the specified ID from the document's default layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentFormFieldWidget.HeaderParameters &
          Paths.GetDocumentFormFieldWidget.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentFormFieldWidget.Responses.$200>;
  };
  ['/api/documents/{documentId}/ocg-layers']: {
    /**
     * get-ocg-layers - Get available OCG layers for the document
     */
    'get'(
      parameters?: Parameters<
        Paths.GetOcgLayers.HeaderParameters & Paths.GetOcgLayers.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetOcgLayers.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers']: {
    /**
     * list-layers - Get Document's Layers
     *
     * Fetches a list of document's layers.
     */
    'get'(
      parameters?: Parameters<
        Paths.ListLayers.HeaderParameters & Paths.ListLayers.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListLayers.Responses.$200>;
    /**
     * create-new-layer - Create a New Layer
     *
     * This endpoint allows you to create a new layer for a document. It supports three modes
     * of operation:
     * - *create a new layer based on a source layer*: this essentially copies a layer in a document
     *   to a new layer in the same document
     * - *create a new layer based on an Instant JSON file*: this creates a new layer by copying document's
     *   base layer and applying the provided Instant JSON payload
     * - *create a new layer based on a source layer and an Instant JSON file*: the same as above, but instead
     *   of copying the base layer, the source layer is used
     *
     * **NOTE**: When the provided source layer name doesn't exist, the base layer is used instead.
     *
     * In case of success, the new layer name is returned along with a list of errors from importing the Instant
     * JSON file into the layer.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateNewLayer.HeaderParameters & Paths.CreateNewLayer.PathParameters
      > | null,
      data?: Paths.CreateNewLayer.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateNewLayer.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}']: {
    /**
     * delete-layer - Delete a Layer
     *
     * This endpoint allows you to delete a layer along with all of its contents.
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteLayer.HeaderParameters & Paths.DeleteLayer.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteLayer.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pdf']: {
    /**
     * download-document-layer-pdf - Download the Layer as a PDF
     *
     * This operation downloads the latest version of the document with
     * annotations for the specified layer as a PDF file.
     *
     * For example, you can use this endpoint to download the PDF file generated
     * after applying a series of document operations on a given layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.DownloadDocumentLayerPdf.QueryParameters &
          Paths.DownloadDocumentLayerPdf.HeaderParameters &
          Paths.DownloadDocumentLayerPdf.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
    /**
     * download-document-layer-pdf-post - Download the Layer as a PDF
     *
     * This operation downloads the latest version of the document with annotations
     * as a PDF file.
     */
    'post'(
      parameters?: Parameters<
        Paths.DownloadDocumentLayerPdfPost.HeaderParameters &
          Paths.DownloadDocumentLayerPdfPost.PathParameters
      > | null,
      data?: Paths.DownloadDocumentLayerPdfPost.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/annotations']: {
    /**
     * get-document-layer-annotations - Get Annotations in a Layer
     *
     * You can use this endpoint to fetch all annotations from the given layer.
     *
     * If `Accept: application/json` header is used, only the first 1000 annotations
     * from the page will be returned. If the page has more than 1000 annotations,
     * the `truncated` property in the response is set to `true`.
     *
     * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
     * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
     * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
     * individually or in batches before the complete response body has been received.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerAnnotations.HeaderParameters &
          Paths.GetDocumentLayerAnnotations.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerAnnotations.Responses.$200>;
    /**
     * create-document-layer-annotation - Create Annotations in a Layer
     *
     * This endpoint allows you to add one or more new annotations to a specific layer in the document.
     *
     * The endpoint accepts two content types:
     * - `application/json` - in this case, the request body is a JSON representation of
     *   one or more annotation; you can check the schema for more details.
     * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
     *   with a new attachment. Annotations are one part of the request, followed by
     *   attachments.
     *
     * The annotation `id` is optional, and will be generated by Document Engine if not provided.
     * The `user_id` is set as the creator of the annotation.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerAnnotation.HeaderParameters &
          Paths.CreateDocumentLayerAnnotation.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerAnnotation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerAnnotation.Responses.$200>;
    /**
     * update-document-layer-annotations - Update Annotations in a Layer
     *
     * This endpoint allows you to update multiple annotations in the document's specified layer.
     *
     * The annotation's content will be completely replaced with the `content` provided in
     * the request, and its `updatedBy` field will be set to `user_id`.
     *
     * The endpoint accepts two content types:
     * - `application/json` - in this case, the request body is a JSON representation of
     *   one or more annotation; you can check the schema for more details.
     * - `multipart/form-data` - with multipart request, annotation(s) can be uploaded along
     *   with a new attachment. Annotations are one part of the request, followed by
     *   attachments.
     *
     * The annotation `id` is required, and it should correspond to an already existing annotation
     * in the document. The `user_id` is set as the creator of the annotation.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerAnnotations.HeaderParameters &
          Paths.UpdateDocumentLayerAnnotations.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerAnnotations.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerAnnotations.Responses.$200>;
    /**
     * remove-document-layer-annotations - Delete Annotations in a Layer.
     *
     * This endpoint allows you to remove multiple annotations from the given layer.
     *
     * The endpoint accepts one content type `application/json`. The request body is either a JSON
     * array of annotations ids, or "all" in order to remove all annotations in one go.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentLayerAnnotations.HeaderParameters &
          Paths.RemoveDocumentLayerAnnotations.PathParameters
      > | null,
      data?: Paths.RemoveDocumentLayerAnnotations.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentLayerAnnotations.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pages/{pageIndex}/annotations']: {
    /**
     * get-document-layer-page-annotations - Get Annotations on a Page in a Layer
     *
     * You can use this endpoint to fetch annotations on the given page from the given layer.
     *
     * If `Accept: application/json` header is used, only the first 1000 annotations
     * from the page will be returned. If the page has more than 1000 annotations,
     * the `truncated` property in the response is set to `true`.
     *
     * In order to consume greater number of annotations in a controlled manner, use `application/x-ndjson`
     * as accepted content type. When `Accept: application/x-ndjson` header is used, the response will be
     * returned as [Newline delimited JSON](http://ndjson.org/), allowing the client to process annotations
     * individually or in batches before the complete response body has been received.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerPageAnnotations.HeaderParameters &
          Paths.GetDocumentLayerPageAnnotations.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerPageAnnotations.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/annotations/{annotationId}']: {
    /**
     * get-document-layer-annotation - Get an Annotation From a Layer
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerAnnotation.HeaderParameters &
          Paths.GetDocumentLayerAnnotation.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerAnnotation.Responses.$200>;
    /**
     * update-document-layer-annotation - Update an Annotation in a Layer
     *
     * This endpoint allows you to update an annotation in the given layer.
     *
     * The annotation's content will be completely replaced with the `content` provided in
     * the request, and its `updatedBy` field will be set to `user_id`.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerAnnotation.HeaderParameters &
          Paths.UpdateDocumentLayerAnnotation.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerAnnotation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerAnnotation.Responses.$200>;
    /**
     * delete-document-layer-annotation - Delete an Annotation in a Layer.
     *
     * This endpoint allows you to delete an annotation in the given layer.
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteDocumentLayerAnnotation.HeaderParameters &
          Paths.DeleteDocumentLayerAnnotation.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDocumentLayerAnnotation.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/annotations/{annotationId}/comments']: {
    /**
     * fetch-document-layer-annotation-comments - Get Comments For a Root Annotation in a Layer
     *
     * Use this endpoint to list all the comments attached to the given annotation in the document's layer with the specified name.
     */
    'get'(
      parameters?: Parameters<
        Paths.FetchDocumentLayerAnnotationComments.HeaderParameters &
          Paths.FetchDocumentLayerAnnotationComments.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.FetchDocumentLayerAnnotationComments.Responses.$200>;
    /**
     * create-document-layer-annotation-comments - Add Comments to a Root Annotation in a Layer
     *
     * Use this endpoint to add new comments to the existing annotation in the given layer.
     * Note that the annotation needs to be either a markup annotation or a comment marker.
     * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine if they are not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerAnnotationComments.HeaderParameters &
          Paths.CreateDocumentLayerAnnotationComments.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerAnnotationComments.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerAnnotationComments.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/comments']: {
    /**
     * create-document-layer-comments - Add Comments in a Layer
     *
     * Use this endpoint to add comments and their root annotation at the same time.
     *
     * Note that the annotation needs to be either a markup annotation or a comment marker.
     *
     * The `id` and `createdAt` properties of the comment are autogenerated by Document Engine
     * if they are not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerComments.HeaderParameters &
          Paths.CreateDocumentLayerComments.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerComments.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerComments.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/redactions']: {
    /**
     * create-document-layer-redactions - Create Redactions in a Layer
     *
     * Use this endpoint to add multiple redaction annotations in a single request.
     *
     * Available strategies are:
     *
     * - `preset` - creates redactions on top of text and annotations matching the predefined
     *   pattern. For the full list of presets, see the request schema.
     * - `regex` - creates redactions on top of text and annotations matching the provided
     *   regular expression. The regular expressions needs to comply with the
     *   [ICU regex standard](http://userguide.icu-project.org/strings/regexp).
     * - `text` - creates redactions on top of text and annotations matching the provided string
     *   search term. Note that the search is case-insensitive.
     *
     * The shape of the `strategyOptions` depends on the chosen strategy. Currently each
     * strategy supports the `includeAnnotations` options (`true` by default), which controls
     * whether redactions should also cover annotations whose content match the search query.
     *
     * The `user_id` key allows to specify the owner of the newly created annotations,
     * and `content` allows to override their visual properties.
     *
     * On success, an array of created redaction annotations is returned.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerRedactions.HeaderParameters &
          Paths.CreateDocumentLayerRedactions.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerRedactions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerRedactions.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/redact']: {
    /**
     * apply-document-layer-redactions - Apply Redactions to a Layer
     *
     * Use this endpoint to apply existing redaction annotation to the default layer, erasing
     * any content and annotations below them.
     *
     * Applying redactions removes the existing redaction annotations and rewrites the underlying
     * PDF file.
     *
     * Note that regardless of applied redactions, the content and annotations from the originally
     * uploaded file are always stored at the document's immutable base layer.
     * In some circumstances, e.g. due to legal requirements, this may be undesirable.
     * In these cases, you can delete the document after applying redactions, which will erase
     * all of the document's data.
     */
    'post'(
      parameters?: Parameters<
        Paths.ApplyDocumentLayerRedactions.HeaderParameters &
          Paths.ApplyDocumentLayerRedactions.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApplyDocumentLayerRedactions.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/form-field-values']: {
    /**
     * get-document-layer-form-field-values - Gets Layer's Form Field Values
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerFormFieldValues.HeaderParameters &
          Paths.GetDocumentLayerFormFieldValues.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerFormFieldValues.Responses.$200>;
    /**
     * update-document-layer-form-field-values - Update Layer's Form Field Values
     *
     * To update existing form field values, send a POST request with a JSON body containing the list of form fields and their values.
     */
    'post'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerFormFieldValues.HeaderParameters &
          Paths.UpdateDocumentLayerFormFieldValues.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerFormFieldValues.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerFormFieldValues.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/sign']: {
    /**
     * sign-document-layer - Digitally Sign a Layer
     *
     * Use this endpoint to digitally sign a document's layer.
     *
     * You can apply a signature to a specific Instant layer. This lets you maintain independent
     * versions of the same document with separate signatures. For example, if you're working on
     * a contract, you can maintain two layers: one for the original document, and one for a copy
     * that will be digitally signed.
     *
     * You can sign an Instant layer using the parent document ID and the layer name. If you use a
     * layer name that maps to a non-existing layer, it will be copied automatically from the document
     * base layer and then signed.
     *
     * ### Signing Service
     *
     * The actual signing of the current state of the document is performed by a signing service callback
     * that needs to be maintained and operated separately. It needs to expose a single HTTP endpoint
     * that receives all callbacks required during the document signing flow differentiated by an `action`
     * property in the request's JSON.
     *
     * URL of the signing service needs to be configured via `SIGNING_SERVICE_URL` environment variable.
     *
     * ### Watermark and Graphic
     *
     * The appearance of a digital signature can include a watermark, which is an image typically depicting a company logo or stamp placed in the center, and a graphic, which is an image usually containing the signer's name in the form of a handwritten signature image positioned on the left side of the signature. You can find more information about these different signature appearance options at https://www.nutrient.io/guides/document-engine/signatures/signature-lifecycle/configure-digital-signature-appearance/.
     *
     * To specify the image to be used as the watermark or graphic in the digital signature, send a multipart request
     * with the `application/json` part containing the sign request options and the `image` part containing the watermark image, and the `graphicImage` part containing the graphic.
     */
    'post'(
      parameters?: Parameters<
        Paths.SignDocumentLayer.HeaderParameters & Paths.SignDocumentLayer.PathParameters
      > | null,
      data?: Paths.SignDocumentLayer.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SignDocumentLayer.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/refresh_ltv']: {
    /**
     * refresh-document-layer-signatures - Refresh signatures on a document's layer
     *
     * Use this endpoint to refresh LTV signatures for the given document layer.
     *
     * Learn more about CAdES and LTV signatures here:
     * https://www.nutrient.io/guides/web/signatures/digital-signatures/standards/#understanding-ltv-pades-b-lt
     *
     * It will refresh the signatures with IDs provided in the `signatureFQNs` field.
     * If `signatureFQNs` is not set, or empty, then all the signatures in the document layer will be refreshed.
     */
    'post'(
      parameters?: Parameters<
        Paths.RefreshDocumentLayerSignatures.HeaderParameters &
          Paths.RefreshDocumentLayerSignatures.PathParameters
      > | null,
      data?: Paths.RefreshDocumentLayerSignatures.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RefreshDocumentLayerSignatures.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/signatures']: {
    /**
     * get-document-layer-digital-signatures - Get Digital Signatures in a Layer
     *
     * Returns a layer's digital signatures.
     *
     * You can fetch the digital signature status of an individual layer using the parent
     * document ID and the layer name.
     *
     * If you use a layer name that maps to a non-existing layer, Document Engine will report
     * the status of the document base layer without creating a new one:
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerDigitalSignatures.HeaderParameters &
          Paths.GetDocumentLayerDigitalSignatures.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerDigitalSignatures.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/document.xfdf']: {
    /**
     * get-document-layer-xfdf - Export Layer's Annotations as an XFDF
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerXfdf.HeaderParameters & Paths.GetDocumentLayerXfdf.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/document.json']: {
    /**
     * get-document-layer-instant-json - Export Layer's Records as an Instant JSON
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerInstantJson.HeaderParameters &
          Paths.GetDocumentLayerInstantJson.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/document_info']: {
    /**
     * fetch-document-layer-info - Fetch Document Layer Information
     *
     * This endpoint allows you to fetch the page count,
     * the dimensions of each page, and the document's permissions.
     */
    'get'(
      parameters?: Parameters<
        Paths.FetchDocumentLayerInfo.HeaderParameters & Paths.FetchDocumentLayerInfo.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.FetchDocumentLayerInfo.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/apply_instant_json']: {
    /**
     * layer-apply-instant-json - Apply an Instant JSON to a Layer
     */
    'post'(
      parameters?: Parameters<
        Paths.LayerApplyInstantJson.HeaderParameters & Paths.LayerApplyInstantJson.PathParameters
      > | null,
      data?: Paths.LayerApplyInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.LayerApplyInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pdf_with_instant_json']: {
    /**
     * download-document-layer-with-instant-json - Download a PDF, Applying the Instant JSON to a Layer
     *
     * To import an Instant JSON file and download the resulting PDF, you can
     * `POST` a `multipart/form` request including an `instant.json` file.
     *
     * This will create a new PDF containing the latest annotations of the
     * default layer, import the uploaded Instant JSON, and respond with the
     * resulting PDF. Please note that this action will not modify the
     * existing document, but rather only import the Instant JSON on a
     * temporary file that will be downloaded in the process.
     */
    'post'(
      parameters?: Parameters<
        Paths.DownloadDocumentLayerWithInstantJson.HeaderParameters &
          Paths.DownloadDocumentLayerWithInstantJson.PathParameters
      > | null,
      data?: Paths.DownloadDocumentLayerWithInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/copy_with_instant_json']: {
    /**
     * copy-document-layer-with-instant-json - Copy the Layer Into a New Document, Applying the Instant JSON
     *
     * If the content type of the request is `multipart/form-data`, the document with the chosen layer
     * will be copied, and the uploaded `instant.json` file will be imported into the default layer.
     *
     * If the content type is `application/json`, the request body is ignored and the layer is copied
     * as-is, without any modifications to the default layer.
     */
    'post'(
      parameters?: Parameters<
        Paths.CopyDocumentLayerWithInstantJson.HeaderParameters &
          Paths.CopyDocumentLayerWithInstantJson.PathParameters
      > | null,
      data?: Paths.CopyDocumentLayerWithInstantJson.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CopyDocumentLayerWithInstantJson.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pages/text']: {
    /**
     * get-document-layer-text - Fetch Document Text
     *
     * This endpoint allows you to fetch the text of all pages in a document.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerText.HeaderParameters & Paths.GetDocumentLayerText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerText.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pages/{pageIndex}/text']: {
    /**
     * get-document-layer-page-text - Get Text of a Page in a Layer
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerPageText.HeaderParameters &
          Paths.GetDocumentLayerPageText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerPageText.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pages/{pageIndex}/highlighted']: {
    /**
     * get-document-layer-page-highlighted-text - Get Highlighted Text on a Page in a Layer
     *
     * Highlighted text in the document refers to any text that is highlighted with any of the
     * markup annotations like underline, strikeout, or highlight.
     *
     * Note that the data returned by this endpoint is just an approximation and might not always
     * exactly reflect the text highlighted in the PDF file.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerPageHighlightedText.HeaderParameters &
          Paths.GetDocumentLayerPageHighlightedText.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerPageHighlightedText.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/pages/{pageIndex}/image']: {
    /**
     * render-document-layer-page - Renders a Page in a Layer
     *
     * Returns an image with the rendered page from a document. Requires exactly one of
     * `width` and `height` query parameters to set the required dimensions of the rendered image.
     *
     * Annotation AP streams are not rendered by default, use `render_ap_streams` query parameter
     * to enable AP streams rendering.
     *
     * Rendered image format depends on the value of the `Accept` header. Supported content types
     * are `image/png` (default) and `image/webp`.
     */
    'get'(
      parameters?: Parameters<
        Paths.RenderDocumentLayerPage.QueryParameters &
          Paths.RenderDocumentLayerPage.HeaderParameters &
          Paths.RenderDocumentLayerPage.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RenderDocumentLayerPage.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/apply_instructions']: {
    /**
     * document-layer-apply-instructions - Edit the Layer and Persist the Result
     *
     * This endpoints allows to use instructions pipeline for document modification.
     *
     * The current document's layer can be referred to by using `#self` anchor.
     * ```
     * {
     *   "document": { "id": "#self" }
     * }
     * ```
     *
     * The result of the processing will replace the layer after successful completion.
     *
     * Please refer to [Build Instructions](#tag/Build-API) schema for all options.
     */
    'post'(
      parameters?: Parameters<
        Paths.DocumentLayerApplyInstructions.HeaderParameters &
          Paths.DocumentLayerApplyInstructions.PathParameters
      > | null,
      data?: Paths.DocumentLayerApplyInstructions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DocumentLayerApplyInstructions.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/bookmarks']: {
    /**
     * get-document-layer-bookmarks - Gets Layer's Bookmarks
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerBookmarks.HeaderParameters &
          Paths.GetDocumentLayerBookmarks.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerBookmarks.Responses.$200>;
    /**
     * create-document-layer-bookmark - Create a Bookmark in a Layer
     *
     * Bookmarks can be created with and without specifying the ID for the bookmark. When no ID is specified,
     * Document Engine will assign a random ID to the bookmark. If you want to rely on a specific ID being the
     * ID of the created bookmark, the ID can be set with the `id` property in the JSON payload.
     * This is useful if you, for example, want a bookmark with the same ID in multiple documents.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerBookmark.HeaderParameters &
          Paths.CreateDocumentLayerBookmark.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerBookmark.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerBookmark.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/bookmarks/{bookmarkId}']: {
    /**
     * update-document-layer-bookmark - Update a Bookmark in a Layer
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerBookmark.HeaderParameters &
          Paths.UpdateDocumentLayerBookmark.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerBookmark.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerBookmark.Responses.$200>;
    /**
     * delete-document-layer-bookmark - Delete a Bookmark in a Layer
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteDocumentLayerBookmark.HeaderParameters &
          Paths.DeleteDocumentLayerBookmark.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteDocumentLayerBookmark.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/embedded-files']: {
    /**
     * get-document-layer-embedded-files - Get Layers's Embedded Files
     *
     * Returned records describe files that are attached to a layer.
     *
     * Use attachments API to retrieve the actual file contents.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerEmbeddedFiles.HeaderParameters &
          Paths.GetDocumentLayerEmbeddedFiles.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerEmbeddedFiles.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/form-fields']: {
    /**
     * get-document-layer-form-fields - Get Form Fields in a Layer
     *
     * You can use this endpoint to fetch all form fields from a document's layer.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerFormFields.HeaderParameters &
          Paths.GetDocumentLayerFormFields.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerFormFields.Responses.$200>;
    /**
     * create-document-layer-form-fields - Create Form Fields in a Layer
     *
     * This endpoint allows you to add a new form field to a layer of the document.
     *
     * The `id` is optional, and will be generated by Document Engine if not provided. The `group` of the form field
     * will be inherited by the widgets and form field values associated with it.
     * The `user_id` is set as the creator of the form field.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerFormFields.HeaderParameters &
          Paths.CreateDocumentLayerFormFields.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerFormFields.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerFormFields.Responses.$200>;
    /**
     * update-document-layer-form-fields - Update Form Fields in a Layer
     *
     * This endpoint allows you to update an existing form field in a document's layer.
     *
     * The `id` is required. If you provide the `group` in this operation then the new group
     * will cascade to all the widgets and form field values associated  with this field in this layer.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerFormFields.HeaderParameters &
          Paths.UpdateDocumentLayerFormFields.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerFormFields.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerFormFields.Responses.$200>;
    /**
     * remove-document-layer-form-fields - Delete Form Fields in a Layer
     *
     * This endpoint allows you to remove multiple form fields from a document's layer.
     *
     * Deleting a form field will cascade delete all its associated widgets and values in the specified layer.
     *
     * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldIds`
     * that is set to either a JSON array of IDs, or "all" in order to remove all form fields in one request.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentLayerFormFields.HeaderParameters &
          Paths.RemoveDocumentLayerFormFields.PathParameters
      > | null,
      data?: Paths.RemoveDocumentLayerFormFields.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentLayerFormFields.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/form-fields/{formFieldId}']: {
    /**
     * get-document-layer-form-field - Get a Form Field in a Layer
     *
     * Use this endpoint to get the form field with a specified ID from a layer of the document
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerFormField.HeaderParameters &
          Paths.GetDocumentLayerFormField.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerFormField.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/form-field-widgets']: {
    /**
     * get-document-layer-widgets - Get Widgets in a Layer
     *
     * You can use this endpoint to fetch all widgets from a layer of the documents.
     * The response will also contain details of the formField each widget is associated with,
     * if it is associated with a form field.
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerWidgets.HeaderParameters &
          Paths.GetDocumentLayerWidgets.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerWidgets.Responses.$200>;
    /**
     * create-document-layer-widgets - Create Widgets in a Layer
     *
     * This endpoint allows you to add a new widget to a layer of the document
     *
     * The `id` is optional, and will be generated by Document Engine if not provided.
     */
    'post'(
      parameters?: Parameters<
        Paths.CreateDocumentLayerWidgets.HeaderParameters &
          Paths.CreateDocumentLayerWidgets.PathParameters
      > | null,
      data?: Paths.CreateDocumentLayerWidgets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateDocumentLayerWidgets.Responses.$200>;
    /**
     * update-document-layer-widgets - Update Widgets in a Layer
     *
     * This endpoint allows you to update an existing widget in a layer of the document
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateDocumentLayerWidgets.HeaderParameters &
          Paths.UpdateDocumentLayerWidgets.PathParameters
      > | null,
      data?: Paths.UpdateDocumentLayerWidgets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateDocumentLayerWidgets.Responses.$200>;
    /**
     * remove-document-layer-widgets - Delete Widgets in a Layer
     *
     * This endpoint allows you to remove multiple widgets from a layer of the document.
     *
     * The endpoint accepts content type `application/json`. The request body is an object with a field `formFieldWidgetIds`
     * that is set to either a JSON array of IDs, or "all" in order to remove all widgets in one request.
     */
    'delete'(
      parameters?: Parameters<
        Paths.RemoveDocumentLayerWidgets.HeaderParameters &
          Paths.RemoveDocumentLayerWidgets.PathParameters
      > | null,
      data?: Paths.RemoveDocumentLayerWidgets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RemoveDocumentLayerWidgets.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/form-field-widgets/{formFieldWidgetId}']: {
    /**
     * get-document-layer-widget - Get a Widget in a Layer
     *
     * Use this endpoint to get the widget with the specified ID from a layer of the document
     */
    'get'(
      parameters?: Parameters<
        Paths.GetDocumentLayerWidget.HeaderParameters & Paths.GetDocumentLayerWidget.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDocumentLayerWidget.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/fonts']: {
    /**
     * get-fonts-in-layer - Get fonts
     */
    'get'(
      parameters?: Parameters<
        Paths.GetFontsInLayer.HeaderParameters & Paths.GetFontsInLayer.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFontsInLayer.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/font_substitutions']: {
    /**
     * get-font-substitutions-in-layer - Get font substitutions
     *
     * This endpoint allows you to get font substitutions that were set for the specific document layer.
     *
     * Note that font substitutions returned by this endpoint will include the font substitutions defined for the specified document layer,
     * as well as any font substitutions defined in the `font-substitutions.json` configuration file, if a `font-substitutions.json` file is mounted on Document Engine.
     *
     * The font substitutions for the document layer will be merged with the font substitutions in `font-substitutions.json` if any,
     * with the substitutions in the document layer having priority over any substitutions `font-substitutions.json` may define.
     * It is this combination of font substitutions that will be applied by Document Engine
     * when performing operations on the document layer where a font is unavailable and needs to be substituted.
     *
     * Learn more about the `font-substitutions.json` file from the documentation available here:
     * https://www.nutrient.io/guides/document-engine/configuration/custom-fonts/#font-substitutions
     */
    'get'(
      parameters?: Parameters<
        Paths.GetFontSubstitutionsInLayer.HeaderParameters &
          Paths.GetFontSubstitutionsInLayer.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFontSubstitutionsInLayer.Responses.$200>;
    /**
     * update-font-substitutions-in-layer - Replaces font substitutions in the document layer
     *
     * This endpoint allows you to replace font substitutions in the specified document layer.
     * It will delete any existing font substitutions for the document layer and replace them with these new ones
     *
     * If no font substitutions existed for the document layer prior, it will create them.
     * Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
     */
    'put'(
      parameters?: Parameters<
        Paths.UpdateFontSubstitutionsInLayer.HeaderParameters &
          Paths.UpdateFontSubstitutionsInLayer.PathParameters
      > | null,
      data?: Paths.UpdateFontSubstitutionsInLayer.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateFontSubstitutionsInLayer.Responses.$200>;
    /**
     * delete-font-substitutions-in-layer - Deletes all font substitutions in the document layer
     *
     * This endpoint allows you to delete all font substitutions in the document layer.
     *
     * Note that this endpoint does not affect the font substitutions specified in the `font-substitutions.json` configuration file, if any.
     */
    'delete'(
      parameters?: Parameters<
        Paths.DeleteFontSubstitutionsInLayer.HeaderParameters &
          Paths.DeleteFontSubstitutionsInLayer.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteFontSubstitutionsInLayer.Responses.$200>;
  };
  ['/api/documents/{documentId}/layers/{layerName}/ocg-layers']: {
    /**
     * get-ocg-layers-in-layer - Get available OCG layers for layer
     */
    'get'(
      parameters?: Parameters<
        Paths.GetOcgLayersInLayer.HeaderParameters & Paths.GetOcgLayersInLayer.PathParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetOcgLayersInLayer.Responses.$200>;
  };
  ['/api/copy_document']: {
    /**
     * copy-document - Copy a Document
     *
     * You can use this endpoint to copy the document, without having to reupload
     * it to Document Engine
     *
     * The copy includes the latest version of all layers and their annotations
     * from the original document.
     *
     * A common use case for copying a document is to create an individual document
     * for each user, allowing different users work on the same file without seeing
     * each other's annotations. However, we recommend leveraging named Instant Layers
     * for such scenarios as they provide more efficient API to manage different document versions.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CopyDocument.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CopyDocument.Responses.$200>;
  };
  ['/api/validate_pdfa']: {
    /**
     * validate-pdfa - Validate PDF/A Compliance
     *
     * This endpoint allows you to validate the PDF/A compliance of a PDF file and returns a validation report.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ValidatePdfa.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ValidatePdfa.Responses.$200>;
  };
  ['/api/revoke']: {
    /**
     * revoke-jwt - Revoke JWT
     *
     * This endpoint allows you to revoke JSON Web Tokens created by your service. Revoked tokens are invalided before they would normally expire. On top of preventing any future authentications with revoked JWTs, any active authenticated session is also destroyed immediately.
     *
     * It's only possible to revoke JWTs with an ID that needs to be specified in their `jti` claim. Note that revoking a particular JWTs will revoke all JWTs with the same ID as well.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.RevokeJwt.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RevokeJwt.Responses.$200>;
  };
  ['/api/secrets/{secretType}']: {
    /**
     * create-secret - Add a Secret
     *
     * Creates a new secret. This does not replace previous secrets of this type.
     */
    'post'(
      parameters?: Parameters<Paths.CreateSecret.PathParameters> | null,
      data?: Paths.CreateSecret.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateSecret.Responses.$200>;
    /**
     * get-secrets - List Secrets
     *
     * Gets all non-expired secret of the specified type.
     */
    'get'(
      parameters?: Parameters<Paths.GetSecrets.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetSecrets.Responses.$200>;
  };
  ['/api/secrets/{secretType}/rotate']: {
    /**
     * rotate-secret - Rotate a Secret
     *
     * Current secrets don't expire. To change current secrets, you'll need to rotate them.
     */
    'post'(
      parameters?: Parameters<Paths.RotateSecret.PathParameters> | null,
      data?: Paths.RotateSecret.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.RotateSecret.Responses.$200>;
  };
  ['/api/secrets/{secretType}/{secretId}']: {
    /**
     * expire-secret - Update a Secret
     *
     * Updates existing secret. This is usually done to update the expiration date of existing secrets.
     */
    'post'(
      parameters?: Parameters<Paths.ExpireSecret.PathParameters> | null,
      data?: Paths.ExpireSecret.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ExpireSecret.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;

export type Action = Components.Schemas.Action;
export type AddPageConfiguration = Components.Schemas.AddPageConfiguration;
export type Annotation = Components.Schemas.Annotation;
export type AnnotationBbox = Components.Schemas.AnnotationBbox;
export type AnnotationContent = Components.Schemas.AnnotationContent;
export type AnnotationCreateMultiple = Components.Schemas.AnnotationCreateMultiple;
export type AnnotationCreateMultipleWithAttachment =
  Components.Schemas.AnnotationCreateMultipleWithAttachment;
export type AnnotationCreateSingle = Components.Schemas.AnnotationCreateSingle;
export type AnnotationCreateSingleWithAttachment =
  Components.Schemas.AnnotationCreateSingleWithAttachment;
export type AnnotationCustomData = Components.Schemas.AnnotationCustomData;
export type AnnotationId = Components.Schemas.AnnotationId;
export type AnnotationIdsAll = Components.Schemas.AnnotationIdsAll;
export type AnnotationIdsList = Components.Schemas.AnnotationIdsList;
export type AnnotationMultipleResponse = Components.Schemas.AnnotationMultipleResponse;
export type AnnotationNote = Components.Schemas.AnnotationNote;
export type AnnotationOpacity = Components.Schemas.AnnotationOpacity;
export type AnnotationPlainText = Components.Schemas.AnnotationPlainText;
export type AnnotationRecord = Components.Schemas.AnnotationRecord;
export type AnnotationReference = Components.Schemas.AnnotationReference;
export type AnnotationRotation = Components.Schemas.AnnotationRotation;
export type AnnotationText = Components.Schemas.AnnotationText;
export type AnnotationUpdate = Components.Schemas.AnnotationUpdate;
export type AnnotationUpdateMultiple = Components.Schemas.AnnotationUpdateMultiple;
export type AnnotationV1 = Components.Schemas.AnnotationV1;
export type ApplyInstantJsonAction = Components.Schemas.ApplyInstantJsonAction;
export type ApplyRedactionsAction = Components.Schemas.ApplyRedactionsAction;
export type ApplyXfdfAction = Components.Schemas.ApplyXfdfAction;
export type AsyncJobStatus = Components.Schemas.AsyncJobStatus;
export type Attachment = Components.Schemas.Attachment;
export type AttachmentContent = Components.Schemas.AttachmentContent;
export type Attachments = Components.Schemas.Attachments;
export type BackgroundColor = Components.Schemas.BackgroundColor;
export type BaseAction = Components.Schemas.BaseAction;
export type BaseAnnotation = Components.Schemas.BaseAnnotation;
export type BaseAnnotationV1 = Components.Schemas.BaseAnnotationV1;
export type BaseFormField = Components.Schemas.BaseFormField;
export type BasePDFOutput = Components.Schemas.BasePDFOutput;
export type BaseWatermarkAction = Components.Schemas.BaseWatermarkAction;
export type BatchOperationResult = Components.Schemas.BatchOperationResult;
export type BlendMode = Components.Schemas.BlendMode;
export type Bookmark = Components.Schemas.Bookmark;
export type BookmarkRecord = Components.Schemas.BookmarkRecord;
export type BorderStyle = Components.Schemas.BorderStyle;
export type BuildAction = Components.Schemas.BuildAction;
export type BuildInstructions = Components.Schemas.BuildInstructions;
export type BuildOutput = Components.Schemas.BuildOutput;
export type BuildResponseJsonContents = Components.Schemas.BuildResponseJsonContents;
export type ButtonFormField = Components.Schemas.ButtonFormField;
export type ByteSize = Components.Schemas.ByteSize;
export type Character = Components.Schemas.Character;
export type CheckboxFormField = Components.Schemas.CheckboxFormField;
export type ChoiceFormField = Components.Schemas.ChoiceFormField;
export type CloudyBorderInset = Components.Schemas.CloudyBorderInset;
export type CloudyBorderIntensity = Components.Schemas.CloudyBorderIntensity;
export type ComboBoxFormField = Components.Schemas.ComboBoxFormField;
export type Comment = Components.Schemas.Comment;
export type CommentContent = Components.Schemas.CommentContent;
export type CommentCreate = Components.Schemas.CommentCreate;
export type CommentCreatedAt = Components.Schemas.CommentCreatedAt;
export type CommentCreatorName = Components.Schemas.CommentCreatorName;
export type CommentMarkerAnnotation = Components.Schemas.CommentMarkerAnnotation;
export type CommentText = Components.Schemas.CommentText;
export type CommentUpdatedAt = Components.Schemas.CommentUpdatedAt;
export type CommentsCreate = Components.Schemas.CommentsCreate;
export type CommentsCreateErrors = Components.Schemas.CommentsCreateErrors;
export type CommentsCreateErrorsWithRoot = Components.Schemas.CommentsCreateErrorsWithRoot;
export type CommentsCreateWithRoot = Components.Schemas.CommentsCreateWithRoot;
export type CommentsCreated = Components.Schemas.CommentsCreated;
export type CommentsCreatedWithRoot = Components.Schemas.CommentsCreatedWithRoot;
export type CommentsList = Components.Schemas.CommentsList;
export type Confidence = Components.Schemas.Confidence;
export type CreateDigitalSignature = Components.Schemas.CreateDigitalSignature;
export type CreateDigitalSignatureCustom = Components.Schemas.CreateDigitalSignatureCustom;
export type CreateDocumentAttachment = Components.Schemas.CreateDocumentAttachment;
export type CreateDocumentCopyAssetToStorageBackend =
  Components.Schemas.CreateDocumentCopyAssetToStorageBackend;
export type CreateDocumentId = Components.Schemas.CreateDocumentId;
export type CreateDocumentInstructions = Components.Schemas.CreateDocumentInstructions;
export type CreateDocumentKeepCurrentAnnotations =
  Components.Schemas.CreateDocumentKeepCurrentAnnotations;
export type CreateDocumentOverwriteExistingDocument =
  Components.Schemas.CreateDocumentOverwriteExistingDocument;
export type CreateDocumentSha256 = Components.Schemas.CreateDocumentSha256;
export type CreateDocumentTitle = Components.Schemas.CreateDocumentTitle;
export type CreateDocumentUpload = Components.Schemas.CreateDocumentUpload;
export type CreateDocumentUrl = Components.Schemas.CreateDocumentUrl;
export type CreateRedactions = Components.Schemas.CreateRedactions;
export type CreateRedactionsAction = Components.Schemas.CreateRedactionsAction;
export type CreateRedactionsErrors = Components.Schemas.CreateRedactionsErrors;
export type CreateRedactionsStrategyOptionsPreset =
  Components.Schemas.CreateRedactionsStrategyOptionsPreset;
export type CreateRedactionsStrategyOptionsRegex =
  Components.Schemas.CreateRedactionsStrategyOptionsRegex;
export type CreateRedactionsStrategyOptionsText =
  Components.Schemas.CreateRedactionsStrategyOptionsText;
export type CustomData = Components.Schemas.CustomData;
export type DeleteAnnotations = Components.Schemas.DeleteAnnotations;
export type DigitalSignature = Components.Schemas.DigitalSignature;
export type DigitalSignatureCreate = Components.Schemas.DigitalSignatureCreate;
export type DigitalSignatures = Components.Schemas.DigitalSignatures;
export type DigitalSignaturesRefresh = Components.Schemas.DigitalSignaturesRefresh;
export type DocumentCreated = Components.Schemas.DocumentCreated;
export type DocumentEngineAnnotation = Components.Schemas.DocumentEngineAnnotation;
export type DocumentId = Components.Schemas.DocumentId;
export type DocumentInfo = Components.Schemas.DocumentInfo;
export type DocumentOperation = Components.Schemas.DocumentOperation;
export type DocumentOperationPageIndex = Components.Schemas.DocumentOperationPageIndex;
export type DocumentOperationPageIndexes = Components.Schemas.DocumentOperationPageIndexes;
export type DocumentOperations = Components.Schemas.DocumentOperations;
export type DocumentPageIndex = Components.Schemas.DocumentPageIndex;
export type DocumentPart = Components.Schemas.DocumentPart;
export type DocumentProperties = Components.Schemas.DocumentProperties;
export type DownloadPDF = Components.Schemas.DownloadPDF;
export type EllipseAnnotation = Components.Schemas.EllipseAnnotation;
export type EllipseAnnotationV1 = Components.Schemas.EllipseAnnotationV1;
export type EmbeddedFile = Components.Schemas.EmbeddedFile;
export type Error = Components.Schemas.Error;
export type ErrorResponse = Components.Schemas.ErrorResponse;
export type Errors = Components.Schemas.Errors;
export type Features = Components.Schemas.Features;
export type FileHandle = Components.Schemas.FileHandle;
export type FilePart = Components.Schemas.FilePart;
export type FillColor = Components.Schemas.FillColor;
export type FlattenAction = Components.Schemas.FlattenAction;
export type Font = Components.Schemas.Font;
export type FontColor = Components.Schemas.FontColor;
export type FontFile = Components.Schemas.FontFile;
export type FontSizeAuto = Components.Schemas.FontSizeAuto;
export type FontSizeInt = Components.Schemas.FontSizeInt;
export type FontStyle = Components.Schemas.FontStyle;
export type FontSubstitution = Components.Schemas.FontSubstitution;
export type FontSubstitutionList = Components.Schemas.FontSubstitutionList;
export type FormField = Components.Schemas.FormField;
export type FormFieldAdditionalActionsEvent = Components.Schemas.FormFieldAdditionalActionsEvent;
export type FormFieldAdditionalActionsInput = Components.Schemas.FormFieldAdditionalActionsInput;
export type FormFieldCreate = Components.Schemas.FormFieldCreate;
export type FormFieldDefaultValue = Components.Schemas.FormFieldDefaultValue;
export type FormFieldDefaultValues = Components.Schemas.FormFieldDefaultValues;
export type FormFieldOption = Components.Schemas.FormFieldOption;
export type FormFieldOptions = Components.Schemas.FormFieldOptions;
export type FormFieldRecord = Components.Schemas.FormFieldRecord;
export type FormFieldUpdate = Components.Schemas.FormFieldUpdate;
export type FormFieldValue = Components.Schemas.FormFieldValue;
export type FormFieldValueRecord = Components.Schemas.FormFieldValueRecord;
export type FormFieldValueUpdate = Components.Schemas.FormFieldValueUpdate;
export type FormFieldValuesRecords = Components.Schemas.FormFieldValuesRecords;
export type FormFieldWidget = Components.Schemas.FormFieldWidget;
export type FormFieldWidgetContent = Components.Schemas.FormFieldWidgetContent;
export type FormFieldWidgetCreate = Components.Schemas.FormFieldWidgetCreate;
export type FormFieldWidgetId = Components.Schemas.FormFieldWidgetId;
export type FormFieldWidgetUpdate = Components.Schemas.FormFieldWidgetUpdate;
export type FormFieldWidgetWithFormField = Components.Schemas.FormFieldWidgetWithFormField;
export type FormFieldWithWidgets = Components.Schemas.FormFieldWithWidgets;
export type GoToAction = Components.Schemas.GoToAction;
export type GoToEmbeddedAction = Components.Schemas.GoToEmbeddedAction;
export type GoToRemoteAction = Components.Schemas.GoToRemoteAction;
export type Group = Components.Schemas.Group;
export type HTMLPart = Components.Schemas.HTMLPart;
export type HideAction = Components.Schemas.HideAction;
export type HighlightedText = Components.Schemas.HighlightedText;
export type HorizontalAlign = Components.Schemas.HorizontalAlign;
export type ImageAnnotation = Components.Schemas.ImageAnnotation;
export type ImageAnnotationV1 = Components.Schemas.ImageAnnotationV1;
export type ImageOutput = Components.Schemas.ImageOutput;
export type ImageWatermarkAction = Components.Schemas.ImageWatermarkAction;
export type InkAnnotation = Components.Schemas.InkAnnotation;
export type InkAnnotationV1 = Components.Schemas.InkAnnotationV1;
export type InstantCommentV1 = Components.Schemas.InstantCommentV1;
export type InstantCommentV2 = Components.Schemas.InstantCommentV2;
export type InstantJson = Components.Schemas.InstantJson;
export type Intensity = Components.Schemas.Intensity;
export type IsCommentThreadRoot = Components.Schemas.IsCommentThreadRoot;
export type IsoDateTime = Components.Schemas.IsoDateTime;
export type JSONContentOutput = Components.Schemas.JSONContentOutput;
export type JWT = Components.Schemas.JWT;
export type JavaScriptAction = Components.Schemas.JavaScriptAction;
export type JsonContentsBbox = Components.Schemas.JsonContentsBbox;
export type JwtBackendV1 = Components.Schemas.JwtBackendV1;
export type JwtBase = Components.Schemas.JwtBase;
export type JwtFrontendV1 = Components.Schemas.JwtFrontendV1;
export type KVPKey = Components.Schemas.KVPKey;
export type KVPValue = Components.Schemas.KVPValue;
export type KeyValuePair = Components.Schemas.KeyValuePair;
export type Label = Components.Schemas.Label;
export type LaunchAction = Components.Schemas.LaunchAction;
export type LayerCreateWithSourceLayer = Components.Schemas.LayerCreateWithSourceLayer;
export type LayerCreateWithSourceLayerAndInstantJson =
  Components.Schemas.LayerCreateWithSourceLayerAndInstantJson;
export type LayerCreated = Components.Schemas.LayerCreated;
export type Line = Components.Schemas.Line;
export type LineAnnotation = Components.Schemas.LineAnnotation;
export type LineAnnotationV1 = Components.Schemas.LineAnnotationV1;
export type LineCap = Components.Schemas.LineCap;
export type LineCaps = Components.Schemas.LineCaps;
export type Lines = Components.Schemas.Lines;
export type LinkAnnotation = Components.Schemas.LinkAnnotation;
export type LinkAnnotationV1 = Components.Schemas.LinkAnnotationV1;
export type ListBoxFormField = Components.Schemas.ListBoxFormField;
export type MarkupAnnotation = Components.Schemas.MarkupAnnotation;
export type MarkupAnnotationV1 = Components.Schemas.MarkupAnnotationV1;
export type MeasurementPrecision = Components.Schemas.MeasurementPrecision;
export type MeasurementScale = Components.Schemas.MeasurementScale;
export type Metadata = Components.Schemas.Metadata;
export type MigrateDocumentAssetsError = Components.Schemas.MigrateDocumentAssetsError;
export type MigrateDocumentAssetsRequest = Components.Schemas.MigrateDocumentAssetsRequest;
export type MigrateDocumentAssetsResponse = Components.Schemas.MigrateDocumentAssetsResponse;
export type NamedAction = Components.Schemas.NamedAction;
export type NewPagePart = Components.Schemas.NewPagePart;
export type NoteAnnotation = Components.Schemas.NoteAnnotation;
export type NoteAnnotationV1 = Components.Schemas.NoteAnnotationV1;
export type NoteIcon = Components.Schemas.NoteIcon;
export type OCGCollectionObject = Components.Schemas.OCGCollectionObject;
export type OCGLayerObject = Components.Schemas.OCGLayerObject;
export type OCGLayerResponse = Components.Schemas.OCGLayerResponse;
export type OcrAction = Components.Schemas.OcrAction;
export type OcrLanguage = Components.Schemas.OcrLanguage;
export type OfficeOutput = Components.Schemas.OfficeOutput;
export type OfficeTemplateModel = Components.Schemas.OfficeTemplateModel;
export type OptimizePdf = Components.Schemas.OptimizePdf;
export type OutlineElement = Components.Schemas.OutlineElement;
export type OutlineElements = Components.Schemas.OutlineElements;
export type PDFAOutput = Components.Schemas.PDFAOutput;
export type PDFOutput = Components.Schemas.PDFOutput;
export type PDFUserPermission = Components.Schemas.PDFUserPermission;
export type Page = Components.Schemas.Page;
export type PageIndex = Components.Schemas.PageIndex;
export type PageJsonContents = Components.Schemas.PageJsonContents;
export type PageLayout = Components.Schemas.PageLayout;
export type PageRange = Components.Schemas.PageRange;
export type PageRotation = Components.Schemas.PageRotation;
export type PageText = Components.Schemas.PageText;
export type Paragraph = Components.Schemas.Paragraph;
export type Part = Components.Schemas.Part;
export type PasswordProtected = Components.Schemas.PasswordProtected;
export type PdfObjectId = Components.Schemas.PdfObjectId;
export type PlainText = Components.Schemas.PlainText;
export type Point = Components.Schemas.Point;
export type PolygonAnnotation = Components.Schemas.PolygonAnnotation;
export type PolygonAnnotationV1 = Components.Schemas.PolygonAnnotationV1;
export type PolylineAnnotation = Components.Schemas.PolylineAnnotation;
export type PolylineAnnotationV1 = Components.Schemas.PolylineAnnotationV1;
export type Prerender = Components.Schemas.Prerender;
export type RadioButtonFormField = Components.Schemas.RadioButtonFormField;
export type RecordId = Components.Schemas.RecordId;
export type Rect = Components.Schemas.Rect;
export type RectangleAnnotation = Components.Schemas.RectangleAnnotation;
export type RectangleAnnotationV1 = Components.Schemas.RectangleAnnotationV1;
export type RedactionAnnotation = Components.Schemas.RedactionAnnotation;
export type RedactionAnnotationV1 = Components.Schemas.RedactionAnnotationV1;
export type RedactionsCreate = Components.Schemas.RedactionsCreate;
export type RedactionsCreateErrors = Components.Schemas.RedactionsCreateErrors;
export type RefreshDigitalSignatures = Components.Schemas.RefreshDigitalSignatures;
export type ResetFormAction = Components.Schemas.ResetFormAction;
export type RotateAction = Components.Schemas.RotateAction;
export type schemasDocumentId = Components.Schemas.SchemasDocumentId;
export type schemasPageIndex = Components.Schemas.SchemasPageIndex;
export type SearchPreset = Components.Schemas.SearchPreset;
export type SearchResult = Components.Schemas.SearchResult;
export type SearchResults = Components.Schemas.SearchResults;
export type ShapeAnnotation = Components.Schemas.ShapeAnnotation;
export type ShapeAnnotationV1 = Components.Schemas.ShapeAnnotationV1;
export type SignatureFormField = Components.Schemas.SignatureFormField;
export type SignatureType = Components.Schemas.SignatureType;
export type SigningToken = Components.Schemas.SigningToken;
export type SourcePdfSha256 = Components.Schemas.SourcePdfSha256;
export type StampAnnotation = Components.Schemas.StampAnnotation;
export type StampAnnotationV1 = Components.Schemas.StampAnnotationV1;
export type StorageConfiguration = Components.Schemas.StorageConfiguration;
export type StructuredText = Components.Schemas.StructuredText;
export type SubmitFormAction = Components.Schemas.SubmitFormAction;
export type Table = Components.Schemas.Table;
export type TableCell = Components.Schemas.TableCell;
export type TableColumn = Components.Schemas.TableColumn;
export type TableLine = Components.Schemas.TableLine;
export type TableRow = Components.Schemas.TableRow;
export type TextAnnotation = Components.Schemas.TextAnnotation;
export type TextAnnotationV1 = Components.Schemas.TextAnnotationV1;
export type TextFormField = Components.Schemas.TextFormField;
export type TextLine = Components.Schemas.TextLine;
export type TextWatermarkAction = Components.Schemas.TextWatermarkAction;
export type Title = Components.Schemas.Title;
export type URIAction = Components.Schemas.URIAction;
export type User = Components.Schemas.User;
export type ValidatePDFAResult = Components.Schemas.ValidatePDFAResult;
export type VerticalAlign = Components.Schemas.VerticalAlign;
export type WatermarkAction = Components.Schemas.WatermarkAction;
export type WatermarkDimension = Components.Schemas.WatermarkDimension;
export type WidgetAnnotation = Components.Schemas.WidgetAnnotation;
export type WidgetAnnotationV1 = Components.Schemas.WidgetAnnotationV1;
export type Word = Components.Schemas.Word;
