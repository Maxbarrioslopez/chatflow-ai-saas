# ChatMBL Backend

Express server with Socket.IO, BullMQ queues, AI/RAG services, and multi-tenant middleware.

## Stack

- **Node.js + Express** — HTTP server with 11 route modules
- **Socket.IO** — WebSocket with JWT auth and room-based channels
- **BullMQ + Redis** — Async job queues (6 queues: AI, embeddings, documents, analytics, notifications, webhooks)
- **Prisma Client** — PostgreSQL ORM
- **JWT (jsonwebtoken)** — Auth with access + refresh tokens
- **Zod** — Schema validation middleware
- **Multer** — File uploads
- **Helmet + CORS** — Security headers
- **bcryptjs** — Password hashing (12 rounds)
- **Pino** — Structured logging (dependency present, not yet active)

## Architecture

```
src/
├── modules/          # Feature modules (controllers + routes + services)
│   ├── auth/         # Register, login, logout, refresh
│   ├── chatbots/     # CRUD + appearance/behavior/AI config + widget tokens
│   ├── chat/         # Send message, streaming (not connected to widget)
│   ├── conversations/# List, get, update conversations
│   ├── leads/        # List, get, update, delete leads
│   ├── analytics/    # Dashboard metrics, funnel, token usage
│   ├── documents/    # Routes only — service incomplete
│   ├── knowledge/    # Routes only — service incomplete
│   ├── workflows/    # Workflow CRUD routes
│   ├── webhooks/     # Webhook routes — service incomplete
│   └── workspaces/   # Workspace routes — service incomplete
├── services/         # Business logic services
│   ├── ai/           # OpenAI chat + streaming + token tracking
│   ├── rag/          # Document processing, embeddings, semantic search
│   ├── analytics/    # Conversation insights, funnel, token usage
│   ├── workflow/     # DAG node executor (conditions, actions, AI, handoff)
│   ├── security/     # Encryption, sanitization, prompt injection, audit
│   └── prisma.ts     # Prisma client singleton
├── repositories/     # Data access layer (wraps Prisma)
├── common/           # Shared infrastructure
│   ├── middleware/    # Auth guard, RBAC, rate limiter, Zod validation
│   ├── errors/       # AppError + error handler middleware
│   ├── logger/       # Structured JSON logger
│   ├── guards/       # Route guards (placeholder)
│   └── validators/   # Validators (placeholder)
├── websocket/        # Socket.IO server with room access control
├── queue/            # BullMQ queue definitions + factory
├── config/           # Environment config with production validation
└── routes/           # Health check (with dependency status)
```

## Route Modules

| Prefix | Module | Auth | Status |
|--------|--------|------|--------|
| `GET /api/health` | Health check | No | ✅ Implemented |
| `POST /api/auth/register` | Register | No | ✅ Implemented |
| `POST /api/auth/login` | Login | No | ✅ Implemented |
| `POST /api/auth/refresh` | Refresh token | No | ✅ Implemented |
| `POST /api/auth/logout` | Logout | No | ✅ Implemented |
| `GET/POST /api/chatbots` | List/Create | Yes | ✅ Implemented |
| `GET/PUT/DELETE /api/chatbots/:id` | Get/Update/Delete | Yes | ✅ Implemented |
| `PUT /api/chatbots/:id/appearance` | Appearance | Yes | ✅ Implemented |
| `PUT /api/chatbots/:id/behavior` | Behavior | Yes | ✅ Implemented |
| `PUT /api/chatbots/:id/ai-config` | AI config | Yes | ✅ Implemented |
| `GET /api/chatbots/:id/widget-token` | Widget token | Yes | ✅ Implemented |
| `POST /api/chatbots/:id/regenerate-token` | Regenerate token | Yes | ✅ Implemented |
| `POST /api/chat` | Send message | No | ⚠️ Partial |
| `GET /api/conversations` | List conversations | Yes | ✅ Implemented |
| `GET /api/leads` | List leads | Yes | ✅ Implemented |
| `GET /api/analytics/dashboard` | Dashboard metrics | Yes | ✅ Implemented |
| `GET /api/analytics/conversations` | Conversation analytics | Yes | ⚠️ Mock |
| `GET /api/analytics/leads` | Lead analytics | Yes | ⚠️ Mock |
| `GET /api/analytics/satisfaction` | Satisfaction analytics | Yes | ⚠️ Mock |
| `POST /api/documents/upload` | Upload document | Yes | ❌ Incomplete |
| `GET /api/knowledge/:chatbotId` | List knowledge | Yes | ❌ Incomplete |
| `POST /api/workflows` | Create workflow | Yes | ✅ Implemented |
| `POST /api/webhooks` | Webhook handler | Yes | ❌ Incomplete |
| `GET /api/workspaces` | List workspaces | Yes | ❌ Incomplete |

## Services

| Service | File | Status | Description |
|---------|------|--------|-------------|
| AI | `services/ai/index.ts` | ⚠️ Partial | OpenAI chat/streaming via raw fetch (SDK not used). Single provider, no fallback |
| RAG | `services/rag/index.ts` | ❌ Mock | Embedding API call works; `simpleEmbedding()` generates random vectors; semantic search is non-functional |
| Analytics | `services/analytics/index.ts` | ⚠️ Partial | Funnel and token usage work. Conversation insights not persisted |
| Workflow | `services/workflow/index.ts` | ⚠️ Partial | DAG node executor works. Delay node not implemented. Webhook nodes have no timeout |
| Security | `services/security/index.ts` | ✅ Implemented | AES-256-GCM encryption, sanitization, prompt injection detection, audit logging |

## WebSocket

- **Transport**: WebSocket + polling fallback
- **Auth**: JWT token via handshake auth or query param
- **Rooms**: Auto-join `org:{orgId}`. Manual join via `conversation:join` / `chatbot:subscribe`
- **Access Control**: Server verifies org ownership before allowing room join
- **Events**: `conversation:join`, `conversation:leave`, `chatbot:subscribe`

## Queue System (BullMQ)

| Queue | Jobs |
|-------|------|
| `ai-processing` | AI chat completions |
| `embeddings` | Vector embedding generation |
| `document-parsing` | PDF/DOCX text extraction |
| `analytics` | Token usage, conversation insights |
| `notifications` | Email, Slack notifications |
| `webhooks` | Outgoing webhook delivery |

> **Note:** Queue workers are not implemented. Jobs are added to queues but never processed. Redis connection defaults (`localhost:6379`).

## Middleware

| Middleware | File | Status | Description |
|-----------|------|--------|-------------|
| `authenticate` | `auth-guard.ts` | ✅ | JWT verification, attaches userId/orgId/role |
| `requireRole` | `auth-guard.ts` | ✅ | RBAC check for specified roles |
| `rateLimiter` | `rate-limiter.ts` | ✅ | Global 100 req / 15 min |
| `validate` | `validate.ts` | ✅ | Zod schema validation for body/query/params |
| `errorHandler` | `error-handler.ts` | ✅ | Handles AppError, ZodError, Prisma errors, JSON parse errors |

## Security

### Current
- JWT auth with access + refresh tokens
- bcryptjs password hashing (12 rounds)
- Helmet.js security headers (CSP not configured)
- CORS restricted to configured origin
- Global rate limiting
- Input sanitization
- Basic prompt injection detection
- AES-256-GCM encryption for sensitive data
- RBAC (owner, admin, member, viewer)

### Required for Production
1. **JWT_SECRET** and **ENCRYPTION_KEY** must be set — app will halt on startup if missing in production
2. Apply Zod validation middleware to all API routes (currently only auth routes use it)
3. Add httpOnly cookie support for auth tokens
4. Add per-endpoint rate limiting (login brute force protection)
5. Configure CSP headers via Helmet
6. Implement proper audit trail persistence (currently console.log in development)
7. Add request logging with correlation IDs

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
JWT_SECRET="<random-64-char-hex>"
ENCRYPTION_KEY="<random-string>"

# AI Features
OPENAI_API_KEY="sk-..."

# Optional
ANTHROPIC_API_KEY="sk-ant-..."
OPENROUTER_API_KEY="sk-or-..."
REDIS_HOST="localhost"
REDIS_PORT="6379"
BACKEND_PORT="4000"
NODE_ENV="development"
LOG_LEVEL="info"
CORS_ORIGIN="http://localhost:3000"
UPLOAD_DIR="./uploads"
```

## Running

```bash
npm run dev        # Development with hot reload (tsx watch)
npm run build      # TypeScript compilation
npm run start      # Production start
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Health Check

```bash
curl http://localhost:4000/api/health
# Response:
# {
#   "status": "ok",
#   "timestamp": "2026-05-20T...",
#   "uptime": 123.45,
#   "checks": {
#     "database": "connected",
#     "redis": "configured",
#     "openai": "configured"
#   }
# }
```

## Known Technical Debt

1. **AI provider lock-in** — Only OpenAI. No abstraction layer for multiple providers.
2. **Vercel AI SDK not used** — Raw `fetch` calls to OpenAI. SDK present in package.json.
3. **RAG search is non-functional** — `simpleEmbedding()` generates random vectors.
4. **Embeddings not persisted** — Generated per-query, never stored in DB.
5. **Queue workers not implemented** — Jobs are enqueued but never processed.
6. **5 incomplete modules** — Documents, Knowledge, Webhooks, Workspaces have routes but no services.
7. **No chat service file** — `/modules/chat/chat.service.ts` references but not fully implemented.
8. **Chat service uses `setTimeout` mock** — PremiumWidget does not connect to backend.
9. **No streaming to widget** — `streamChat()` exists but widget doesn't use it.
10. **Workflow delay nodes ignored** — The `delay` node type is not handled in `executeNode`.
11. **Webhook execution has no timeout** — Can hang indefinitely.
12. **Analytics insights not persisted** — OpenAI analysis result is returned but never saved to DB.
13. **Pino logger not active** — Custom logger used instead of Pino despite it being in dependencies.
14. **Room access control only recently added** — May need validation across all multi-tenant queries.
