import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from './types';
import type { ParsedDocument } from './types';
import { parsePdf } from './parsers/pdf.parser';
import { parseDocx } from './parsers/docx.parser';
import { parseCsv } from './parsers/csv.parser';
import { parseText } from './parsers/text.parser';
import { parseHtml } from './parsers/html.parser';
import { parseWithMarkitdown } from './parsers/markitdown.parser';
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
        // 1) Try native unpdf parser first
        const result = await parsePdf(buffer, filename);
        if (result.text && result.text.length >= 20) {
          return { success: true, document: result };
        }
        // 2) If native failed, try MarkItDown as fallback
        const mdResult = await parseWithMarkitdown(buffer, filename);
        if (mdResult?.text && mdResult.text.length >= 20) {
          return { success: true, document: mdResult };
        }
        // 3) Both failed
        if (result.metadata.warning?.toLowerCase().includes('ocr')) {
          return { success: true, document: result, needsOcr: true };
        }
        return { success: true, document: result };
      }

      case '.docx': {
        // 1) Try mammoth first
        const docxResult = await parseDocx(buffer, filename);
        if (docxResult.text && docxResult.text.length >= 20) {
          return { success: true, document: docxResult };
        }
        // 2) Fallback to MarkItDown
        const mdDocx = await parseWithMarkitdown(buffer, filename);
        if (mdDocx?.text) return { success: true, document: mdDocx };
        return { success: true, document: docxResult };
      }

      case '.csv': {
        const csvResult = await parseCsv(buffer, filename);
        return { success: true, document: csvResult };
      }

      case '.md':
      case '.txt': {
        const textResult = await parseText(buffer, filename);
        return { success: true, document: textResult };
      }

      default: {
        if (mimeType?.startsWith('text/html') || mimeType?.startsWith('application/xhtml')) {
          const htmlResult = await parseHtml(buffer, filename);
          return { success: true, document: htmlResult };
        }
        // Unknown type: try MarkItDown as last resort
        const mdFallback = await parseWithMarkitdown(buffer, filename);
        if (mdFallback?.text) return { success: true, document: mdFallback };
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
