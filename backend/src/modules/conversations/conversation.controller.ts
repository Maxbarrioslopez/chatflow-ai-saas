import { Response, NextFunction } from 'express';
import { ConversationService } from './conversation.service';
import type { AuthRequest } from '../../common/middleware/auth-guard';

const conversationService = new ConversationService();

export class ConversationController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId, status, limit, offset } = req.query;
      const result = await conversationService.findAll(
        req.organizationId!,
        { chatbotId: chatbotId as string, status: status as string, limit: Number(limit) || 50, offset: Number(offset) || 0 },
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const conversation = await conversationService.findById(req.params.id, req.organizationId!);
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const conversation = await conversationService.updateStatus(
        req.params.id,
        req.organizationId!,
        req.body.status,
      );
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };

  updateRating = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const conversation = await conversationService.updateRating(
        req.params.id,
        req.organizationId!,
        req.body.rating,
        req.body.feedback,
      );
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const messages = await conversationService.getMessages(req.params.id, req.organizationId!);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };
}
