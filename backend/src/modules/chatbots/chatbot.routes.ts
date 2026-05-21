import { Router } from 'express';
import { ChatbotController } from './chatbot.controller';
import { authenticate } from '../../common/middleware/auth-guard';
import { validate } from '../../common/middleware/validate';
import { createChatbotSchema, updateAppearanceSchema, updateBehaviorSchema } from '@chatmbl/shared';

export const chatbotRouter = Router();
const controller = new ChatbotController();

chatbotRouter.use(authenticate);

chatbotRouter.get('/', controller.list);
chatbotRouter.post('/', validate(createChatbotSchema), controller.create);
chatbotRouter.get('/:id', controller.getById);
chatbotRouter.put('/:id', controller.update);
chatbotRouter.delete('/:id', controller.delete);
chatbotRouter.put('/:id/appearance', validate(updateAppearanceSchema), controller.updateAppearance);
chatbotRouter.put('/:id/behavior', validate(updateBehaviorSchema), controller.updateBehavior);
chatbotRouter.put('/:id/ai-config', controller.updateAIConfig);
chatbotRouter.get('/:id/widget-token', controller.getWidgetToken);
chatbotRouter.post('/:id/regenerate-token', controller.regenerateToken);
