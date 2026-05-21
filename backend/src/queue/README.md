# Queue System

BullMQ job queues for async processing. Uses Redis as a backing store.

## Queues

| Queue Name | QueueName Enum | Purpose |
|-----------|----------------|---------|
| `ai-processing` | `AI_PROCESSING` | AI chat completions (non-streaming) |
| `embeddings` | `EMBEDDINGS` | Vector embedding generation |
| `document-parsing` | `DOCUMENT_PARSING` | PDF/DOCX/TXT text extraction |
| `analytics` | `ANALYTICS` | Token usage tracking, insight generation |
| `notifications` | `NOTIFICATIONS` | Email, Slack notifications |
| `webhooks` | `WEBHOOKS` | Outgoing webhook delivery |

## Usage

```typescript
import { addJob, QueueName } from '../../queue';

// Add a job to a queue
await addJob(QueueName.ANALYTICS, 'track-token-usage', {
  organizationId: 'org-123',
  promptTokens: 150,
  completionTokens: 50,
  totalTokens: 200,
});
```

## Worker Pattern

```typescript
import { createWorker, QueueName } from '../../queue';

const worker = createWorker(QueueName.DOCUMENT_PARSING, async (job) => {
  const { sourceId, type, content } = job.data;
  // Process document...
  await updateJobProgress(job, 100);
});
```

## Status

⚠️ **Partial.** Queue definitions and job submission work. Workers are not implemented — jobs are enqueued but never processed. Redis connection defaults to `localhost:6379`.

## Dependencies

- `bullmq` — Queue management
- `ioredis` — Redis client
