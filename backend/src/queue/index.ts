import { Queue, Worker, Job } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export enum QueueName {
  AI_PROCESSING = 'ai-processing',
  EMBEDDINGS = 'embeddings',
  DOCUMENT_PARSING = 'document-parsing',
  ANALYTICS = 'analytics',
  NOTIFICATIONS = 'notifications',
  WEBHOOKS = 'webhooks',
}

const queues = new Map<QueueName, Queue>();

export function getQueue(name: QueueName): Queue {
  if (!queues.has(name)) {
    const queue = new Queue(name, { connection });
    queues.set(name, queue);
  }
  return queues.get(name)!;
}

export async function addJob<T>(queueName: QueueName, jobName: string, data: T) {
  const queue = getQueue(queueName);
  return queue.add(jobName, data);
}

export function createWorker(
  queueName: QueueName,
  handler: (job: Job) => Promise<void>,
) {
  return new Worker(queueName, handler, { connection });
}

export async function getQueueMetrics(name: QueueName) {
  const queue = getQueue(name);
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
  ]);
  return { waiting, active, completed, failed };
}
