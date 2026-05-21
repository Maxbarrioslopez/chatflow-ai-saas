import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../common/middleware/auth-guard';

export const analyticsRouter = Router();
const controller = new AnalyticsController();

analyticsRouter.use(authenticate);

analyticsRouter.get('/dashboard', controller.getDashboard);
analyticsRouter.get('/conversations', controller.getConversationAnalytics);
analyticsRouter.get('/leads', controller.getLeadAnalytics);
analyticsRouter.get('/satisfaction', controller.getSatisfaction);
analyticsRouter.get('/chatbot/:chatbotId', controller.getChatbotAnalytics);
