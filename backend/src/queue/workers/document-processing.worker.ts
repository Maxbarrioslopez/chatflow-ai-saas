import { createWorker, QueueName } from '../index';
import { processDocument } from '../../services/document-processing';
import type { DocumentProcessingJob } from '../../services/document-processing/types';

let workerInitialized = false;

export function initDocumentProcessingWorker() {
  if (workerInitialized) return;
  workerInitialized = true;

  const worker = createWorker(QueueName.DOCUMENT_PARSING, async (job) => {
    const data = job.data as DocumentProcessingJob;

    if (!data.knowledgeSourceId || !data.organizationId || !data.chatbotId) {
      throw new Error('Invalid job data: missing required fields');
    }

    await processDocument(data);
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] Document processing completed: ${job.id}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`[Worker] Document processing failed: ${job?.id}`, error.message);
  });

  console.log('[Worker] Document processing worker initialized');
}
