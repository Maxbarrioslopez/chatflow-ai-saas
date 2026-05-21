import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === 'production') {
    console.error(`FATAL: Environment variable ${name} is required in production.`);
    process.exit(1);
  }
  return value || '';
}

const nodeEnv = process.env.NODE_ENV || 'development';

if (!process.env.JWT_SECRET && nodeEnv === 'production') {
  console.error('FATAL: JWT_SECRET must be set in production. Generate with: openssl rand -hex 64');
  process.exit(1);
}

if (!process.env.ENCRYPTION_KEY && nodeEnv === 'production') {
  console.error('FATAL: ENCRYPTION_KEY must be set in production.');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY && nodeEnv === 'production') {
  console.warn('WARNING: OPENAI_API_KEY not set. AI features will not work.');
}

export const config = {
  port: parseInt(process.env.BACKEND_PORT || '4000', 10),
  nodeEnv,
  isProduction: nodeEnv === 'production',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/chatflow',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    provider: process.env.AI_PROVIDER || 'openai',
    chatModel: process.env.CHAT_MODEL || 'gpt-4o-mini',
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    defaultModel: 'gpt-4o-mini',
  },
  documentProcessing: {
    chunkSize: parseInt(process.env.DOCUMENT_CHUNK_SIZE || '1000', 10),
    chunkOverlap: parseInt(process.env.DOCUMENT_CHUNK_OVERLAP || '150', 10),
    maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10', 10),
  },
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'dev-encryption-key-change-in-production',
  },
};
