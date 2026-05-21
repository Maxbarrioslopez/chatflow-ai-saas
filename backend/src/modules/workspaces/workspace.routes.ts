import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';

export const workspaceRouter = Router();

workspaceRouter.use(authenticate);

workspaceRouter.get('/', (req, res) => {
  res.json({ workspaces: [] });
});

workspaceRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Workspace created' });
});
