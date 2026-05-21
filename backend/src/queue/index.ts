import { Queue, Worker, Job } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

let redisAvailable = true;

export enum QueueName {
  AI_PROCESSING = 'ai-processing',
  EMBEDDINGS = 'embeddings',
  DOCUMENT_PARSING = 'document-parsing',
  ANALYTICS = 'analytics',
  NOTIFICATIONS = 'notifications',
  WEBHOOKS = 'webhooks',
}

const queues = new Map<QueueName, Queue>();

export function getQueue(name: QueueName): Queue | null {
  if (queues.has(name)) return queues.get(name) || null;
  if (!redisAvailable) return null;
  try {
    const queue = new Queue(name, { connection });
    queue.on('error', (err: Error) => {
      if (redisAvailable && err.message?.includes('ECONNREFUSED')) {
        redisAvailable = false;
        console.warn('[Queue] Redis connection refused, disabling queues.');
      }
    });
    queues.set(name, queue);
    return queue;
  } catch {
    redisAvailable = false;
    return null;
  }
}

export async function addJob<T>(queueName: QueueName, jobName: string, data: T) {
  const queue = getQueue(queueName);
  if (!queue) return;
  try {
    return queue.add(jobName, data);
  } catch (error) {
    console.warn(`[Queue] Failed to add job "${jobName}":`, error instanceof Error ? error.message : '');
  }
}

export function createWorker(
  queueName: QueueName,
  handler: (job: Job) => Promise<void>,
) {
  if (!redisAvailable) return null;
  try {
    return new Worker(queueName, handler, { connection });
  } catch {
    return null;
  }
}

export async function getQueueMetrics(name: QueueName) {
  const queue = getQueue(name);
  if (!queue) return { waiting: 0, active: 0, completed: 0, failed: 0 };
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);
    return { waiting, active, completed, failed };
  } catch {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }
}
