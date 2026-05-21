import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';

export const workflowRouter = Router();

workflowRouter.use(authenticate);

workflowRouter.get('/:chatbotId', (req, res) => {
  res.json({ workflows: [] });
});

workflowRouter.post('/:chatbotId', (req, res) => {
  res.status(201).json({ message: 'Workflow created' });
});

workflowRouter.put('/:id', (req, res) => {
  res.json({ message: 'Workflow updated' });
});

workflowRouter.delete('/:id', (req, res) => {
  res.status(204).send();
});
