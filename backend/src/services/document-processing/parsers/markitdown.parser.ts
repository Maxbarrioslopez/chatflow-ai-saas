import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { ParsedDocument } from '../types';

let markitdownAvailable: boolean | null = null;

function checkMarkitdown(): boolean {
  if (markitdownAvailable !== null) return markitdownAvailable;
  try {
    execSync('markitdown --help', { stdio: 'ignore', timeout: 5000 });
    markitdownAvailable = true;
  } catch {
    markitdownAvailable = false;
  }
  return markitdownAvailable;
}

export async function parseWithMarkitdown(buffer: Buffer, filename: string): Promise<ParsedDocument | null> {
  if (!checkMarkitdown()) return null;

  const ext = filename.split('.').pop()?.toLowerCase() || 'tmp';
  const tmpPath = join(tmpdir(), `chatmbl-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);

  try {
    writeFileSync(tmpPath, buffer);
    const output = execSync(`markitdown "${tmpPath}" 2>/dev/null`, {
      encoding: 'utf-8',
      timeout: 30000,
      maxBuffer: 50 * 1024 * 1024,
    }).trim();

    if (!output || output.length < 10) {
      return {
        text: '',
        metadata: { parser: 'markitdown', originalName: filename, warning: 'MarkItDown produced no output' },
      };
    }

    return {
      text: output,
      metadata: { parser: 'markitdown', originalName: filename },
    };
  } catch {
    return null;
  } finally {
    try { unlinkSync(tmpPath); } catch {}
  }
}
