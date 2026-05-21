import { Router, Request, Response } from 'express';
import { config } from '../config';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  const checks: Record<string, string> = {};

  try {
    const { prisma } = await import('../services/prisma');
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'connected';
  } catch {
    checks.database = 'disconnected';
  }

  try {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || '6379';
    if (redisHost && redisPort) {
      checks.redis = 'configured';
    } else {
      checks.redis = 'not configured';
    }
  } catch {
    checks.redis = 'unavailable';
  }

  const provider = config.ai.provider || 'openai';
  const hasKey = provider === 'openrouter'
    ? !!config.ai.openrouterKey
    : !!config.ai.openaiKey;

  checks[`ai_${provider}`] = hasKey ? 'configured' : 'not configured';

  const allHealthy = Object.values(checks).every((v) => v === 'connected' || v === 'configured');

  res.json({
    status: allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    provider,
    checks,
  });
});
