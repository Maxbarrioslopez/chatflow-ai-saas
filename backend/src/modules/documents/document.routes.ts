import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth-guard';
import multer from 'multer';

export const documentRouter = Router();
const upload = multer({ dest: 'uploads/' });

documentRouter.use(authenticate);

documentRouter.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded', file: req.file });
});

documentRouter.get('/:chatbotId', (req, res) => {
  res.json({ documents: [] });
});

documentRouter.delete('/:id', (req, res) => {
  res.status(204).send();
});
