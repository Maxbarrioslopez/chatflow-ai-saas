import { Response, NextFunction } from 'express';
import { ChatbotService } from './chatbot.service';
import type { AuthRequest } from '../../common/middleware/auth-guard';

const chatbotService = new ChatbotService();

export class ChatbotController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chatbots = await chatbotService.findAll(req.organizationId!);
      res.json(chatbots);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chatbot = await chatbotService.create(req.organizationId!, req.body);
      res.status(201).json(chatbot);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chatbot = await chatbotService.findById(req.params.id, req.organizationId!);
      res.json(chatbot);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const chatbot = await chatbotService.update(req.params.id, req.organizationId!, req.body);
      res.json(chatbot);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await chatbotService.delete(req.params.id, req.organizationId!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  updateAppearance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await chatbotService.updateAppearance(req.params.id, req.organizationId!, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateBehavior = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await chatbotService.updateBehavior(req.params.id, req.organizationId!, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateAIConfig = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await chatbotService.updateAIConfig(req.params.id, req.organizationId!, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getWidgetToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = await chatbotService.getWidgetToken(req.params.id, req.organizationId!);
      res.json(token);
    } catch (error) {
      next(error);
    }
  };

  regenerateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = await chatbotService.regenerateToken(req.params.id, req.organizationId!);
      res.json(token);
    } catch (error) {
      next(error);
    }
  };
}
