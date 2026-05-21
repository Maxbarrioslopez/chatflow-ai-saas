import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';
import { validate } from '../../common/middleware/validate';
import { ModerationController } from './moderation.controller';
import {
  createModerationRuleSchema,
  updateModerationRuleSchema,
  bulkCreateModerationRulesSchema,
  testModerationSchema,
} from '@chatflow/shared';

export const moderationRouter = Router();
const controller = new ModerationController();

moderationRouter.use(authenticate);

moderationRouter.get('/:chatbotId/rules', controller.listRules);
moderationRouter.post('/:chatbotId/rules', validate(createModerationRuleSchema), controller.createRule);
moderationRouter.patch('/:chatbotId/rules/:ruleId', validate(updateModerationRuleSchema), controller.updateRule);
moderationRouter.delete('/:chatbotId/rules/:ruleId', controller.deleteRule);
moderationRouter.post('/:chatbotId/rules/bulk', validate(bulkCreateModerationRulesSchema), controller.bulkCreate);
moderationRouter.post('/:chatbotId/rules/test', validate(testModerationSchema), controller.testRule);
moderationRouter.get('/:chatbotId/events', controller.listEvents);
