# Backend Services

Shared business logic services used across modules. Each service is a singleton exported as `lowercaseName`.

## Services

| Service | File | Status | Key Methods |
|---------|------|--------|-------------|
| `aiService` | `ai/index.ts` | ⚠️ Partial | `chat()`, `streamChat()`, `trackUsage()` |
| `ragService` | `rag/index.ts` | ❌ Mock | `processDocument()`, `chunkContent()`, `generateEmbedding()`, `semanticSearch()`, `augmentPrompt()` |
| `analyticsService` | `analytics/index.ts` | ⚠️ Partial | `generateConversationInsight()`, `getFunnelData()`, `getTokenUsage()` |
| `workflowService` | `workflow/index.ts` | ⚠️ Partial | `evaluateWorkflow()`, `executeNode()` |
| `prisma` | `prisma.ts` | ✅ | Prisma client singleton |

## What Goes Here

- Business logic shared by multiple modules
- Third-party API clients (AI, embeddings, etc.)
- Analytics and reporting logic
- Workflow evaluation engine

## What Does NOT Go Here

- Module-specific controllers (go in `modules/`)
- Data access layer (goes in `repositories/`)
- Queue configurations (goes in `queue/`)
- HTTP middleware (goes in `common/middleware/`)
