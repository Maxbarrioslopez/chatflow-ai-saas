import { Router } from 'express';
import { LeadController } from './lead.controller';
import { authenticate } from '../../common/middleware/auth-guard';

export const leadRouter = Router();
const controller = new LeadController();

leadRouter.use(authenticate);

leadRouter.get('/', controller.list);
leadRouter.get('/:id', controller.getById);
leadRouter.patch('/:id/status', controller.updateStatus);
leadRouter.patch('/:id/score', controller.updateScore);
leadRouter.post('/:id/tags', controller.addTags);
leadRouter.delete('/:id/tags', controller.removeTags);
