import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from './types';
import type { ParsedDocument } from './types';
import { parsePdf } from './parsers/pdf.parser';
import { parseDocx } from './parsers/docx.parser';
import { parseCsv } from './parsers/csv.parser';
import { parseText } from './parsers/text.parser';
import { parseHtml } from './parsers/html.parser';
import path from 'path';

export type ParseResult = {
  success: boolean;
  document?: ParsedDocument;
  error?: string;
  needsOcr?: boolean;
};

function getExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function validateFile(buffer: Buffer, filename: string, mimeType?: string): string | null {
  if (!buffer || buffer.length === 0) {
    return 'File is empty';
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`;
  }

  const ext = getExtension(filename);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `File type "${ext}" is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }

  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return `MIME type "${mimeType}" is not allowed.`;
  }

  return null;
}

export async function parseDocument(buffer: Buffer, filename: string, mimeType?: string): Promise<ParseResult> {
  const validationError = validateFile(buffer, filename, mimeType);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const ext = getExtension(filename);

  try {
    switch (ext) {
      case '.pdf': {
        const result = await parsePdf(buffer, filename);
        const warning = (result.metadata as any).warning || '';
if (!result.text && warning.toLowerCase().includes('ocr')) {
          return { success: true, document: result, needsOcr: true };
        }
        return { success: true, document: result };
      }

      case '.docx': {
        const result = await parseDocx(buffer, filename);
        return { success: true, document: result };
      }

      case '.csv': {
        const result = await parseCsv(buffer, filename);
        return { success: true, document: result };
      }

      case '.md':
      case '.txt': {
        const result = await parseText(buffer, filename);
        return { success: true, document: result };
      }

      default: {
        if (mimeType?.startsWith('text/html') || mimeType?.startsWith('application/xhtml')) {
          const result = await parseHtml(buffer, filename);
          return { success: true, document: result };
        }
        return { success: false, error: `Unsupported file type: ${ext}` };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function parseUrlContent(html: string, url: string): Promise<ParsedDocument> {
  const buffer = Buffer.from(html, 'utf-8');
  return parseHtml(buffer, url);
}
