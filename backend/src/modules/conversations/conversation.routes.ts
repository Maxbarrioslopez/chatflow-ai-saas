import { Router } from 'express';
import { ConversationController } from './conversation.controller';
import { authenticate } from '../../common/middleware/auth-guard';

export const conversationRouter = Router();
const controller = new ConversationController();

conversationRouter.use(authenticate);

conversationRouter.get('/', controller.list);
conversationRouter.get('/:id', controller.getById);
conversationRouter.patch('/:id/status', controller.updateStatus);
conversationRouter.post('/:id/rating', controller.updateRating);
conversationRouter.get('/:id/messages', controller.getMessages);
