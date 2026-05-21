import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';
import { knowledgeUpload } from '../../common/middleware/upload';
import { KnowledgeController } from './knowledge.controller';

export const knowledgeRouter = Router();
const controller = new KnowledgeController();

knowledgeRouter.use(authenticate);

knowledgeRouter.get('/:chatbotId/sources', controller.listSources);
knowledgeRouter.get('/:chatbotId/sources/:sourceId', controller.getSource);
knowledgeRouter.post('/:chatbotId/documents', knowledgeUpload.single('file'), controller.uploadDocument);
knowledgeRouter.post('/:chatbotId/text', controller.addTextSource);
knowledgeRouter.post('/:chatbotId/search', controller.search);
knowledgeRouter.get('/:chatbotId/stats', controller.getStats);
knowledgeRouter.delete('/:chatbotId/sources/:sourceId', controller.deleteSource);
knowledgeRouter.post('/:chatbotId/sources/:sourceId/reprocess', controller.reprocessSource);
