import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../../common/middleware/auth-guard';
import { ChatService } from './chat.service';

const chatService = new ChatService();

export class ChatController {
  sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId, message, conversationId, visitorId } = req.body;
      const result = await chatService.sendMessage(
        chatbotId,
        message,
        conversationId,
        visitorId,
        req.organizationId,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await chatService.createSession(req.params.chatbotId);
      res.json(session);
    } catch (error) {
      next(error);
    }
  };

  getWidgetConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await chatService.getWidgetConfig(req.params.widgetToken);
      res.json(config);
    } catch (error) {
      next(error);
    }
  };
}
