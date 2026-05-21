import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { config } from './config';
import { errorHandler } from './common/errors/error-handler';
import { rateLimiter } from './common/middleware/rate-limiter';
import { initWebSocket } from './websocket';
import { authRouter } from './modules/auth/auth.routes';
import { chatbotRouter } from './modules/chatbots/chatbot.routes';
import { chatRouter } from './modules/chat/chat.routes';
import { conversationRouter } from './modules/conversations/conversation.routes';
import { leadRouter } from './modules/leads/lead.routes';
import { analyticsRouter } from './modules/analytics/analytics.routes';
import { documentRouter } from './modules/documents/document.routes';
import { knowledgeRouter } from './modules/knowledge/knowledge.routes';
import { workflowRouter } from './modules/workflows/workflow.routes';
import { webhookRouter } from './modules/webhooks/webhook.routes';
import { workspaceRouter } from './modules/workspaces/workspace.routes';
import { moderationRouter } from './modules/moderation/moderation.routes';
import { healthRouter } from './routes/health.routes';
import { initDocumentProcessingWorker } from './queue/workers/document-processing.worker';

const app = express();

try {
  initDocumentProcessingWorker();
} catch (error) {
  console.warn('[Worker] BullMQ worker not available (Redis may be offline). Document processing requires Redis.');
}
const httpServer = createServer(app);

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/chatbots', chatbotRouter);
app.use('/api/chat', chatRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/leads', leadRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/documents', documentRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/moderation', moderationRouter);
app.use('/api/workflows', workflowRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/workspaces', workspaceRouter);

app.use(errorHandler);

initWebSocket(httpServer);

const port = config.port;
httpServer.listen(port, () => {
  console.log(`🚀 ChatFlow server running on http://localhost:${port}`);
  console.log(`🔌 WebSocket ready`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

export default app;
