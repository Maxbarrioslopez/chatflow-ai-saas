import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import type { AuthRequest } from '../../common/middleware/auth-guard';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { period } = req.query;
      const metrics = await analyticsService.getDashboard(req.organizationId!, (period as string) || '7d');
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  };

  getConversationAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.getConversationAnalytics(req.organizationId!);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getLeadAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.getLeadAnalytics(req.organizationId!);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getSatisfaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.getSatisfaction(req.organizationId!);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getChatbotAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.getChatbotAnalytics(req.params.chatbotId, req.organizationId!);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
