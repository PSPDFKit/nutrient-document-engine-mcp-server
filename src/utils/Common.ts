import { AnnotationBbox } from '../api/DocumentEngineSchema.js';

/**
 * Format file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  const precision = value >= 10 ? 0 : 1;
  return `${value.toFixed(precision)} ${sizes[i]}`;
};

/**
 * Format annotation location for display. AnnotationBBox: [left, top, width, height]
 */
export function formatBBox(coordinates: AnnotationBbox): string {
  return `(left:${coordinates[0]}, top:${coordinates[1]}, width:${coordinates[2]}, height:${coordinates[3]})`;
}
