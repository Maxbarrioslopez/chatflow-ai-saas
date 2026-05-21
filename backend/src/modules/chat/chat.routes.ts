import { Router } from 'express';
import { ChatController } from './chat.controller';

export const chatRouter = Router();
const controller = new ChatController();

chatRouter.post('/send', controller.sendMessage);
chatRouter.get('/:chatbotId/session', controller.createSession);
chatRouter.get('/widget/:widgetToken', controller.getWidgetConfig);
