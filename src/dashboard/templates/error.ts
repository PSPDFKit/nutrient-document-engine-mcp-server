export const errorTemplate = (message: string, backLink: string = '/dashboard') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 20px;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Error</h1>
    <p>${message}</p>
    <p><a href="${backLink}">Back to dashboard</a></p>
</body>
</html>
`;
