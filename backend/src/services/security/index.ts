import { config } from '../../config';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const rawKey = config.encryption.key;
  if (rawKey === 'dev-encryption-key-change-in-production' && config.isProduction) {
    throw new Error('ENCRYPTION_KEY must be set in production');
  }
  return scryptSync(rawKey, 'chatflow-salt', KEY_LENGTH);
}

export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted + ':' + cipher.getAuthTag().toString('hex');
}

export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const parts = ciphertext.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const authTag = Buffer.from(parts[2], 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  const injectionPatterns = [
    /ignore\s+all\s+(previous|above|prior)/i,
    /forget\s+(all\s+)?(previous|above|prior)/i,
    /system\s*(prompt|message|instruction)/i,
    /you\s+are\s+(now\s+)?(an?\s+)?(openai|chatgpt|assistant)/i,
    /act\s+as\s+/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(prompt)) {
      return { valid: false, reason: 'Prompt injection pattern detected' };
    }
  }

  return { valid: true };
}

export function auditLog(
  organizationId: string,
  userId: string | undefined,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, any>,
) {
  const entry = {
    timestamp: new Date().toISOString(),
    organizationId,
    userId,
    action,
    resource,
    resourceId,
    metadata,
  };

  if (config.isProduction) {
    try {
      const { prisma } = require('../prisma');
      prisma.auditLog.create({ data: entry }).catch((err: Error) => {
        console.error('[AUDIT] Failed to persist audit log:', err.message);
      });
    } catch {
      console.warn('[AUDIT] Audit log persistence unavailable');
    }
  } else {
    console.log('[AUDIT]', JSON.stringify(entry));
  }
}
