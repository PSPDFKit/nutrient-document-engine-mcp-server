# Changelog

## Unreleased

### Security

- Updated both Docker stages to Node.js 24.22.1 to address CVE-2026-111497 in Node.js's bundled Brotli decoder. The npm package now requires Node.js 22.23.4+ on the 22.x line, 24.22.1+ on the 24.x line, or 26.12.1 and later. Users running the server through npm or `npx` must upgrade their installed Node.js runtime; updating the package alone does not update Node.js.
