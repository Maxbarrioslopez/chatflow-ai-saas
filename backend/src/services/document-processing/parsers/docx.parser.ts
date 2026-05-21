import type { ParsedDocument } from '../types';

export async function parseDocx(buffer: Buffer, filename?: string): Promise<ParsedDocument> {
  let mammoth: any;
  try {
    mammoth = await import('mammoth');
  } catch {
    return {
      text: '',
      metadata: { parser: 'mammoth', originalName: filename, warning: 'DOCX parser could not be loaded.' },
    };
  }

  try {
    const result = await mammoth.extractRawText({ buffer });

    const text = (result.value || '').trim();
    return {
      text,
      metadata: {
        parser: 'mammoth',
        originalName: filename,
        warnings: result.messages?.filter((m: any) => m.type === 'warning').map((m: any) => m.message) || [],
      },
    };
  } catch (error) {
    return {
      text: '',
      metadata: {
        parser: 'mammoth',
        originalName: filename,
        warning: `DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    };
  }
}
