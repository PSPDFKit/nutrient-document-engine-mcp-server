#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths
const apiYamlPath = path.resolve(__dirname, '../src/api/document-engine-api.yml');
const schemaOutputPath = path.resolve(__dirname, '../src/api/DocumentEngineSchema.ts');

console.log('Generating TypeScript schema from OpenAPI YAML...');

function fixIndexSignatureConflictsSimple(content) {
  // Match interfaces with index signatures followed by named properties
  const pattern = /export interface (\w+) \{\s*\[name: string\]: ([^;]+);([\s\S]*?)\n\s*\}/g;

  return content.replace(pattern, (match, interfaceName, indexType, bodyContent) => {
    // Extract only TOP-LEVEL property names from the body content
    const propertyNames = [];
    const lines = bodyContent.split('\n');

    let inNestedObject = false;
    let braceDepth = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (
        !trimmed ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('//') ||
        trimmed.startsWith('/**') ||
        trimmed === '*/' ||
        trimmed.includes('example:') ||
        trimmed.includes('description:')
      ) {
        continue;
      }

      // Track brace depth to know if we're inside a nested object
      for (const char of trimmed) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;
      }

      // Only look for properties at the top level (braceDepth should be 0 before we encounter the property)
      if (braceDepth === 0 || (braceDepth === 1 && trimmed.includes('{'))) {
        // Look for top-level property definitions (name: type pattern)
        const propertyMatch = trimmed.match(/^(\w+)\??:\s*/);
        if (propertyMatch) {
          propertyNames.push(propertyMatch[1]);
        }
      }
    }

    // If we found properties, create union type
    if (propertyNames.length > 0) {
      const propertyUnions = propertyNames.map(name => `${interfaceName}['${name}']`);
      const newIndexType = `${indexType.trim()} | ${propertyUnions.join(' | ')}`;

      return `export interface ${interfaceName} {
    [name: string]: ${newIndexType};${bodyContent}
}`;
    }

    return match;
  });
}

try {
  // Run openapicmd to generate the TypeScript schema
  const command = `npx openapicmd typegen  ${apiYamlPath} > ${schemaOutputPath}`;
  execSync(command, { stdio: 'inherit' });
  console.log('Schema generated successfully.');

  // Read the generated file
  let schemaContent = fs.readFileSync(schemaOutputPath, 'utf8');

  // Apply string replacements
  console.log('Applying fixes to the generated schema...');

  // Fix 1: Convert dot notation with version numbers (e.g., Type.v1) to camelCase (TypeV1)
  schemaContent = schemaContent.replace(
    /export type ([A-Za-z]+)\.v([0-9]+) = Components\.Schemas\.([A-Za-z]+)V([0-9]+);/g,
    'export type $1V$2 = Components.Schemas.$3V$4;'
  );

  // Fix 2: Convert hyphenated types (e.g., type-name) to camelCase (typeName)
  schemaContent = schemaContent.replace(
    /export type ([a-z]+)-([A-Za-z]+) = Components\.Schemas\.([A-Za-z]+)([A-Za-z]+);/g,
    (match, p1, p2, p3, p4) => {
      // Convert first letter of second part to uppercase for camelCase
      const camelCaseName = p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
      return `export type ${camelCaseName} = Components.Schemas.${p3}${p4};`;
    }
  );

  // Fix 3: Convert underscore types (e.g., _type_name) to camelCase (typeName)
  schemaContent = schemaContent.replace(
    /export type _([a-z]+)_([A-Za-z]+) = Components\.Schemas\.([A-Za-z]+)([A-Za-z]+);/g,
    (match, p1, p2, p3, p4) => {
      // Convert first letter of each part to uppercase for camelCase (except the first part)
      const camelCaseName = p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
      return `export type ${camelCaseName} = Components.Schemas.${p3}${p4};`;
    }
  );

  // Fix 4: Add id field to DocumentProperties interface
  schemaContent = schemaContent.replace(
    /export interface DocumentProperties \{/,
    'export interface DocumentProperties {\n            id: string;'
  );

  schemaContent = fixIndexSignatureConflictsSimple(schemaContent);

  // Write the fixed content back to the file
  fs.writeFileSync(schemaOutputPath, schemaContent);
  console.log('Schema fixes applied successfully.');

  console.log('Schema generation and fixes completed.');
} catch (error) {
  console.error('Error generating schema:', error);
  process.exit(1);
}
