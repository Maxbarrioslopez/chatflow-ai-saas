import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../common/middleware/auth-guard';
import { knowledgeSourceRepository } from '../../repositories/knowledge-source.repository';
import { ragService } from '../../services/rag';
import { AppError } from '../../common/errors';
import { addJob, QueueName } from '../../queue';
import { validateFile } from '../../services/document-processing';

export class KnowledgeController {
  listSources = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const sources = await knowledgeSourceRepository.findByChatbot(chatbotId, req.organizationId!);
      res.json({ sources });
    } catch (error) {
      next(error);
    }
  };

  getSource = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const source = await knowledgeSourceRepository.findById(req.params.sourceId, req.organizationId!);
      if (!source) throw new AppError(404, 'Knowledge source not found');
      res.json({ source });
    } catch (error) {
      next(error);
    }
  };

  uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const file = req.file;

      if (!file) {
        throw new AppError(400, 'No file provided. Send a file with field name "file".');
      }

      const validationError = validateFile(file.buffer, file.originalname, file.mimetype);
      if (validationError) {
        throw new AppError(400, validationError);
      }

      const source = await knowledgeSourceRepository.create({
        organizationId: req.organizationId!,
        chatbotId,
        type: 'document',
        name: file.originalname,
        mimeType: file.mimetype,
        originalName: file.originalname,
        fileSize: file.size,
      });

      const bufferBase64 = file.buffer.toString('base64');

      await addJob(QueueName.DOCUMENT_PARSING, 'parse-document', {
        knowledgeSourceId: source.id,
        organizationId: req.organizationId!,
        chatbotId,
        bufferBase64,
        mimeType: file.mimetype,
        filename: file.originalname,
      });

      res.status(201).json({
        source,
        status: 'pending',
        message: 'Document uploaded and queued for processing.',
      });
    } catch (error) {
      next(error);
    }
  };

  addTextSource = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const { name, content } = req.body;

      if (!content || content.trim().length < 10) {
        throw new AppError(400, 'Content must be at least 10 characters');
      }

      const source = await knowledgeSourceRepository.create({
        organizationId: req.organizationId!,
        chatbotId,
        type: 'text',
        name: name || `Text ${new Date().toLocaleDateString()}`,
        content,
      });

      await addJob(QueueName.DOCUMENT_PARSING, 'parse-document', {
        knowledgeSourceId: source.id,
        organizationId: req.organizationId!,
        chatbotId,
        bufferBase64: Buffer.from(content).toString('base64'),
        mimeType: 'text/plain',
        filename: `${source.id}.txt`,
      });

      res.status(201).json({ source, status: 'pending' });
    } catch (error) {
      next(error);
    }
  };

  deleteSource = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await knowledgeSourceRepository.delete(req.params.sourceId, req.organizationId!);
      if (!result) throw new AppError(404, 'Knowledge source not found');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  reprocessSource = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const source = await knowledgeSourceRepository.findById(req.params.sourceId, req.organizationId!);
      if (!source) throw new AppError(404, 'Knowledge source not found');

      await knowledgeSourceRepository.updateStatus(source.id, 'pending');
      await ragService.processDocument(source.id);

      res.json({ message: 'Reprocessing queued', sourceId: source.id });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const { query } = req.body;

      if (!query || query.trim().length === 0) {
        throw new AppError(400, 'Search query is required');
      }

      const results = await ragService.semanticSearch(chatbotId, req.organizationId!, query, 10);
      res.json({ results });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const total = await knowledgeSourceRepository.countByChatbot(chatbotId, req.organizationId!);
      const sources = await knowledgeSourceRepository.findByChatbot(chatbotId, req.organizationId!);

      const stats = {
        total,
        byStatus: {
          pending: sources.filter((s) => s.status === 'pending').length,
          processing: sources.filter((s) => s.status === 'processing').length,
          ready: sources.filter((s) => s.status === 'ready').length,
          failed: sources.filter((s) => s.status === 'failed').length,
          needsOcr: sources.filter((s) => s.status === 'needs_ocr').length,
        },
        totalChunks: sources.reduce((sum, s) => sum + (s.chunkCount || 0), 0),
      };

      res.json({ stats });
    } catch (error) {
      next(error);
    }
  };
}
