import type { ParsedDocument } from '../types';

async function loadUnpdf() {
  try {
    return await import('unpdf');
  } catch {
    return null;
  }
}

export async function parsePdf(buffer: Buffer, filename?: string): Promise<ParsedDocument> {
  const unpdf = await loadUnpdf();
  if (!unpdf) {
    return {
      text: '',
      metadata: {
        parser: 'unpdf',
        originalName: filename,
        warning: 'PDF parser (unpdf) could not be loaded.',
      },
    };
  }

  const uint8Array = new Uint8Array(buffer);

  let totalPages = 0;
  try {
    const pdf = await unpdf.getDocumentProxy(uint8Array);
    totalPages = pdf.numPages || 0;
  } catch {
    return {
      text: '',
      metadata: {
        parser: 'unpdf',
        originalName: filename,
        warning: 'Could not read PDF structure. File may be corrupted.',
      },
    };
  }

  let text: string;
  try {
    const result = await unpdf.extractText(uint8Array, { mergePages: true });
    text = result.text || '';
  } catch {
    return {
      text: '',
      metadata: {
        parser: 'unpdf',
        pages: totalPages,
        originalName: filename,
        warning: 'Failed to extract text from PDF.',
      },
    };
  }

  if (!text || text.trim().length < 20) {
    return {
      text: '',
      metadata: {
        parser: 'unpdf',
        pages: totalPages,
        originalName: filename,
        warning: 'PDF has little or no extractable text. OCR may be required.',
      },
    };
  }

  return {
    text: text.trim(),
    metadata: {
      parser: 'unpdf',
      pages: totalPages,
      originalName: filename,
    },
  };
}
