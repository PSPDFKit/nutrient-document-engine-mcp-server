export const dashboardTemplate = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Document type is intentionally generic for template flexibility
  documents: any[],
  formatFileSize: (bytes: number) => string,
  message?: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nutrient Document Engine</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f2f2f2;
            color: #333;
            line-height: 1.6;
        }

        .header {
            background: #e2dbd9;
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .logo::before {
            content: "⚙️";
            margin-right: 0.5rem;
        }


        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .hero-section {
            text-align: center;
            margin-bottom: 3rem;
        }

        .hero-title {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 1rem;
            color: #2d3436;
        }

        .hero-subtitle {
            font-size: 1.1rem;
            color: #636e72;
            margin-bottom: 2rem;
        }

        .upload-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
        }

        .upload-card h3 {
            margin-bottom: 1rem;
            color: #2d3436;
            font-weight: 500;
        }

        .file-input-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 1rem;
        }

        .file-input {
            opacity: 0;
            position: absolute;
            z-index: -1;
        }

        .file-input-label {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            color: #6c757d;
        }

        .file-input-label:hover {
            border-color: #f0c968;
            background: #fef7e6;
        }

        .file-selected {
            border-color: #6eb579 !important;
            background: #e8f5ec !important;
            color: #2d3436 !important;
            font-weight: 500;
        }

        .documents-list {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
            overflow: hidden;
        }

        .document-item {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f1f3f4;
            transition: background-color 0.2s ease;
        }

        .document-item:last-child {
            border-bottom: none;
        }

        .document-item:hover {
            background-color: #f8f9fa;
        }

        .doc-icon {
            width: 40px;
            height: 40px;
            background: #6c757d;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            margin-right: 1rem;
            flex-shrink: 0;
        }

        .doc-content {
            flex: 1;
            min-width: 0;
        }

        .doc-title {
            font-size: 1rem;
            font-weight: 500;
            color: #2d3436;
            margin-bottom: 0.25rem;
        }

        .doc-meta {
            font-size: 0.85rem;
            color: #636e72;
        }

        .doc-actions {
            display: flex;
            gap: 0.5rem;
            flex-shrink: 0;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            min-width: 80px;
            height: 36px;
        }

        .btn-primary {
            background: #6eb579;
            color: white;
        }

        .btn-primary:hover {
            background: #5fa568;
        }

        .btn-success {
            background: #6eb579;
            color: white;
        }

        .btn-success:hover {
            background: #5fa568;
        }

        .btn-danger {
            background: #6eb579;
            color: white;
        }

        .btn-danger:hover {
            background: #5fa568;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 500;
            color: #2d3436;
        }

        .document-count {
            background: #6eb579;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #636e72;
        }

        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .delete-form {
            display: inline;
        }

        .message-container {
            background: linear-gradient(135deg, #6eb579, #5fa568);
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(110,181,121,0.2);
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }


            .hero-title {
                font-size: 2rem;
            }

            .nav-links {
                display: none;
            }
        }
    </style>
    <script>
        function confirmDelete(title) {
            return confirm('Are you sure you want to delete "' + title + '"?');
        }

        // Add event listener for file input change to provide visual feedback
        document.addEventListener('DOMContentLoaded', function() {
            const fileInput = document.getElementById('file');
            const fileLabel = document.querySelector('.file-input-label');
            const originalLabelText = fileLabel.innerHTML;

            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    // Update label text to show selected file(s)
                    if (fileInput.files.length === 1) {
                        fileLabel.innerHTML = '📄 Selected: ' + fileInput.files[0].name;
                    } else {
                        fileLabel.innerHTML = '📄 Selected: ' + fileInput.files.length + ' files';
                    }
                    // Add a visual indicator class
                    fileLabel.classList.add('file-selected');
                } else {
                    // Reset to original state
                    fileLabel.innerHTML = originalLabelText;
                    fileLabel.classList.remove('file-selected');
                }
            });
        });
    </script>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <svg width="100%" height="36" viewBox="0 0 208 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.1524 22.1521C1.8582 22.1521 0 20.2939 0 17.9997C0 15.7055 1.8582 13.8473 4.1524 13.8473C6.44659 13.8473 8.30479 15.7055 8.30479 17.9997C8.30479 20.2939 6.44659 22.1521 4.1524 22.1521ZM45.6763 13.8473C43.3821 13.8473 41.524 15.7055 41.524 17.9997C41.524 20.2939 43.3821 22.1521 45.6763 22.1521C47.9705 22.1521 49.8287 20.2939 49.8287 17.9997C49.8287 15.7055 47.9705 13.8473 45.6763 13.8473ZM6.34071 28.1647C4.58424 29.6388 4.35379 32.259 5.82789 34.0154C7.30199 35.7719 9.92215 36.0024 11.6786 34.5283C13.4351 33.0542 13.6655 30.434 12.1914 28.6775C10.7173 26.9211 8.09717 26.6906 6.34071 28.1647ZM43.488 7.8346C45.2445 6.3605 45.475 3.74033 44.0009 1.98387C42.5268 0.227407 39.9066 -0.0030509 38.1501 1.47105C36.3937 2.94515 36.1632 5.56531 37.6373 7.32177C39.1114 9.07824 41.7316 9.3087 43.488 7.8346ZM11.6786 1.47313C9.92215 -0.000974749 7.30199 0.227407 5.82789 1.98595C4.35379 3.74449 4.58217 6.36257 6.34071 7.83667C8.09925 9.31077 10.7173 9.08239 12.1914 7.32385C13.6655 5.56531 13.4372 2.94723 11.6786 1.47313ZM43.488 28.1647C41.7316 26.6906 39.1114 26.919 37.6373 28.6775C36.1632 30.434 36.3916 33.0542 38.1501 34.5283C39.9066 36.0024 42.5268 35.774 44.0009 34.0154C45.475 32.259 45.2466 29.6388 43.488 28.1647ZM32.8849 19.2661C31.1284 17.792 28.5083 18.0204 27.0342 19.779C25.5601 21.5375 25.7884 24.1556 27.547 25.6297C29.3055 27.1038 31.9236 26.8754 33.3977 25.1169C34.8718 23.3583 34.6434 20.7402 32.8849 19.2661ZM22.2818 10.3696C20.5253 8.89553 17.9051 9.12391 16.431 10.8825C14.9569 12.641 15.1853 15.2591 16.9438 16.7332C18.7024 18.2073 21.3205 17.9789 22.7946 16.2204C24.2687 14.4618 24.0403 11.8437 22.2818 10.3696Z" fill="#1A1414"></path>
                <path d="M83.2482 4.00294H86.8124V32.0934H82.7174L73.1011 15.2088C72.579 14.2696 71.494 12.1667 69.849 8.90002H69.8111C69.8636 10.1017 69.9103 11.4113 69.9482 12.8288C69.9861 14.2463 70.0065 15.3079 70.0065 16.0109V32.0934H66.4424V4.00294H70.4382L80.0749 20.6921C80.559 21.5292 81.434 23.1654 82.6999 25.6096L83.4057 26.96H83.4436C83.3911 25.8896 83.3445 24.6559 83.3065 23.2588C83.2686 21.8617 83.2482 20.7388 83.2482 19.89V4.00294ZM104.254 23.2996C104.254 27.4792 102.53 29.5675 99.0828 29.5675C98.3128 29.5675 97.639 29.4975 97.0645 29.3604C96.4899 29.2234 95.9474 28.9054 95.4399 28.4096C95.0607 28.045 94.7865 27.6279 94.6174 27.1671C94.4482 26.7034 94.3461 26.2396 94.314 25.7759C94.282 25.3121 94.2645 24.6617 94.2645 23.8275V12.0354H90.5428V24.0229C90.5428 24.9621 90.572 25.7788 90.6303 26.4729C90.6886 27.1671 90.8374 27.8525 91.0707 28.5409C91.304 29.2292 91.6657 29.8242 92.147 30.3346C92.8645 31.1046 93.7074 31.6734 94.6728 32.0379C95.6382 32.4025 96.7757 32.5863 98.0824 32.5863C99.5203 32.5863 100.772 32.2859 101.842 31.685C102.912 31.0842 103.714 30.2238 104.251 29.0979V32.0963H107.856V12.0354H104.251V23.2996H104.254ZM118.677 6.45294H115.113V12.0354H110.901V15.0513H115.113V27.1584C115.113 28.9725 115.603 30.2821 116.583 31.0871C117.563 31.8921 119.141 32.2917 121.322 32.2917C121.871 32.2917 122.416 32.2625 122.959 32.2042C123.501 32.1459 123.947 32.07 124.3 31.9796L124.222 28.6896C123.215 28.9259 122.346 29.0425 121.617 29.0425C120.888 29.0425 120.275 28.9871 119.864 28.8763C119.453 28.7654 119.152 28.5671 118.963 28.2784C118.773 27.9896 118.68 27.5784 118.68 27.0446V15.0571H124.379V12.0413H118.68V6.45294H118.677ZM134.73 12.9746C133.456 13.7329 132.63 14.6721 132.251 15.795V12.0354H128.646V32.0934H132.251V22.9059C132.251 20.8029 132.563 19.1638 133.19 17.9884C133.817 16.8129 134.666 16.0079 135.737 15.5704C136.807 15.1329 138.108 14.9142 139.633 14.9142C140.246 14.9142 140.666 14.9346 140.887 14.9725L140.966 11.5454C140.103 11.5454 139.554 11.5571 139.321 11.5834C137.53 11.7525 136.002 12.2163 134.727 12.9746H134.73ZM170.287 18.5979C170.588 19.785 170.737 21.0217 170.737 22.2992C170.737 22.6784 170.731 22.9584 170.716 23.1421H155.497C155.535 25.35 156.025 26.9921 156.967 28.0684C157.906 29.1446 159.318 29.6842 161.199 29.6842C162.897 29.6842 164.215 29.3167 165.157 28.5788C166.099 27.8409 166.691 26.715 166.939 25.1984L170.424 25.4725C169.981 27.8088 168.978 29.5792 167.417 30.7809C165.857 31.9825 163.798 32.5834 161.237 32.5834C158.154 32.5834 155.754 31.6034 154.027 29.6463C152.394 27.8175 151.577 25.2771 151.577 22.025C151.577 20.5229 151.79 19.1346 152.213 17.8629C152.636 16.5884 153.269 15.4888 154.103 14.5613C154.978 13.5696 156.016 12.8171 157.218 12.3096C158.419 11.7992 159.744 11.5454 161.193 11.5454C162.812 11.5454 164.32 11.8896 165.717 12.575C167.114 13.2604 168.217 14.2434 169.027 15.5238C169.564 16.3871 169.981 17.4109 170.282 18.5979H170.287ZM167.015 20.2225C167.003 19.6479 166.898 19.0238 166.703 18.3529C166.507 17.6821 166.254 17.1163 165.939 16.6584C165.428 15.9 164.792 15.3488 164.028 15.0017C163.264 14.6546 162.334 14.4825 161.237 14.4825C160.14 14.4825 159.181 14.675 158.358 15.06C157.536 15.445 156.92 15.9788 156.518 16.6554C156.177 17.2038 155.934 17.7929 155.783 18.4171C155.634 19.0442 155.549 19.645 155.538 20.2196H167.018L167.015 20.2225ZM190.672 15.6113C190.444 14.9113 190.094 14.3075 189.625 13.8C188.893 13.03 188.044 12.4613 187.079 12.0967C186.113 11.7321 184.97 11.5484 183.652 11.5484C180.583 11.5484 178.518 12.7354 177.462 15.1125V12.0384H173.857V32.0963H177.462V21.0275C177.462 18.5075 178.005 16.7984 179.087 15.9059C180.172 15.0104 181.371 14.5642 182.692 14.5642C183.436 14.5642 184.089 14.6342 184.652 14.7713C185.212 14.9084 185.749 15.2263 186.259 15.7221C186.638 16.0867 186.915 16.5067 187.09 16.9763C187.265 17.4459 187.37 17.9184 187.402 18.3967C187.434 18.8721 187.452 19.5371 187.452 20.3859V32.0992H191.194V20.1904C191.194 19.2367 191.165 18.4113 191.107 17.7113C191.048 17.0113 190.902 16.3142 190.675 15.6142L190.672 15.6113ZM207.338 15.0513V12.0354H201.639V6.45294H198.074V12.0354H193.863V15.0513H198.074V27.1584C198.074 28.9725 198.564 30.2821 199.544 31.0871C200.524 31.8921 202.102 32.2917 204.284 32.2917C204.832 32.2917 205.378 32.2625 205.92 32.2042C206.463 32.1459 206.909 32.07 207.262 31.9796L207.183 28.6896C206.177 28.9259 205.308 29.0425 204.579 29.0425C203.849 29.0425 203.237 28.9871 202.826 28.8763C202.414 28.7654 202.114 28.5671 201.924 28.2784C201.735 27.9896 201.642 27.5784 201.642 27.0446V15.0571H207.341L207.338 15.0513ZM144.557 32.1225H148.162V12.0646H144.557V32.1225ZM146.359 3.41669C144.904 3.41669 143.725 4.59502 143.725 6.05044C143.725 7.50585 144.904 8.68419 146.359 8.68419C147.814 8.68419 148.993 7.50585 148.993 6.05044C148.993 4.59502 147.814 3.41669 146.359 3.41669Z" fill="#1A1414"></path>
            </svg>
        </div>
    </header>

    <div class="container">
        ${
          message
            ? `
        <div class="message-container">
            ${message}
        </div>
        `
            : ''
        }

        <div class="hero-section">
            <h1 class="hero-title">Document Engine MCP Server</h1>
            <p class="hero-subtitle">Manage your documents with the Nutrient Document Engine MCP Server.</p>
        </div>

        <div class="upload-card">
            <h3>Upload Documents</h3>
            <form action="/dashboard/upload" method="post" enctype="multipart/form-data">
                <div class="file-input-wrapper">
                    <input type="file" id="file" name="files" multiple class="file-input">
                    <label for="file" class="file-input-label">
                        📁 Choose files or drag & drop
                    </label>
                </div>
                <br>
                <button type="submit" class="btn btn-primary">Upload Documents</button>
            </form>
        </div>

        <div class="section-header">
            <h2 class="section-title">Documents</h2>
            <span class="document-count">${documents.length}</span>
        </div>

        ${
          documents.length === 0
            ? `
        <div class="empty-state">
            <div class="empty-state-icon">📄</div>
            <h3>No documents yet</h3>
            <p>Upload your first document to get started</p>
        </div>
        `
            : `
        <div class="documents-list">
            ${documents
              .map(
                doc => `
                <div class="document-item">
                    <div class="doc-icon">📄</div>
                    <div class="doc-content">
                        <div class="doc-title">${doc.title || 'Untitled Document'}</div>
                        <div class="doc-meta">
                            Created: ${doc.createdAt || 'N/A'} • Size: ${doc.byteSize ? formatFileSize(doc.byteSize) : 'N/A'}
                        </div>
                    </div>
                    <div class="doc-actions">
                        <a href="/dashboard/download/${doc.id}" class="btn btn-success" title="Download">
                            Download
                        </a>
                        <form class="delete-form" action="/dashboard/delete/${doc.id}" method="post" onsubmit="return confirmDelete('${doc.title || 'Untitled Document'}')">
                            <button type="submit" class="btn btn-danger" title="Delete">
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            `
              )
              .join('')}
        </div>
        `
        }
    </div>
</body>
</html>
`;
