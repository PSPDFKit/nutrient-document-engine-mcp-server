export const uploadResultsTemplate = (
  results: { filename: string; success: boolean; error?: string }[]
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Results</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <h1>Upload Results</h1>
    <ul>
        ${results
          .map(
            result => `
            <li class="${result.success ? 'success' : 'error'}">
                ${result.filename}: ${result.success ? 'Uploaded successfully' : `Failed - ${result.error}`}
            </li>
        `
          )
          .join('')}
    </ul>
    <a href="/dashboard" class="btn">Back to Dashboard</a>
</body>
</html>
`;
