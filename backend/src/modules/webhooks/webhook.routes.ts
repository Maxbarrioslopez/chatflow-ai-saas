import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';

export const webhookRouter = Router();

webhookRouter.use(authenticate);

webhookRouter.get('/', (req, res) => {
  res.json({ webhooks: [] });
});

webhookRouter.post('/', (req, res) => {
  res.status(201).json({ message: 'Webhook created' });
});
