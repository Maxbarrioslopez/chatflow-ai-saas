import { Response, NextFunction } from 'express';
import { LeadService } from './lead.service';
import type { AuthRequest } from '../../common/middleware/auth-guard';

const leadService = new LeadService();

export class LeadController {
  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId, status, search, limit, offset } = req.query;
      const result = await leadService.findAll(
        req.organizationId!,
        {
          chatbotId: chatbotId as string,
          status: status as string,
          search: search as string,
          limit: Number(limit) || 50,
          offset: Number(offset) || 0,
        },
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lead = await leadService.findById(req.params.id, req.organizationId!);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lead = await leadService.updateStatus(req.params.id, req.organizationId!, req.body.status);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  updateScore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lead = await leadService.updateScore(req.params.id, req.organizationId!, req.body.score);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  addTags = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lead = await leadService.addTags(req.params.id, req.organizationId!, req.body.tags);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  removeTags = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lead = await leadService.removeTags(req.params.id, req.organizationId!, req.body.tags);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };
}
