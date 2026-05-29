# ChatMBL AI SaaS Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI"/>
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white" alt="LangChain"/>
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/BullMQ-FF6B35?style=flat-square&logo=queue&logoColor=white" alt="BullMQ"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.io"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
</p>

Multi-tenant chatbot SaaS platform with modular architecture (frontend/backend/db/shared). Built for white-label deployment with AI-first design, knowledge retrieval (RAG), workflow automation, and premium UI/UX.

## Project Status

> **Prototype / Advanced MVP** — Not production-ready. See [Limitations](#limitations) below.

| Aspect | Status |
|--------|--------|
| Architecture | ✅ Modular monorepo (npm workspaces) |
| Frontend UI | ✅ High-fidelity, partially connected to backend |
| Backend API | ✅ 11 route modules, partially implemented |
| Database Schema | ✅ 22 Prisma models, 12 enums |
| Authentication | ✅ JWT with register/login/refresh |
| AI Integration | ⚠️ OpenAI only, no provider abstraction |
| RAG Pipeline | ⚠️ Embedding generation works, search is mocked |
| Workflow Engine | ⚠️ Backend evaluates, frontend is UI-only |
| WebSocket | ⚠️ Connected, missing production hardening |
| Security | ⚠️ Basic protections present, gaps remain |
| Testing | ❌ No tests written |
| Multi-tenant | ⚠️ Schema supports it, enforcement incomplete |
| Production readiness | ❌ Not ready |

## Architecture

```
chatmbl/                     # npm workspaces monorepo
├── frontend/                 # Next.js 14 (App Router) + React 18 + Tailwind
├── backend/                  # Express + Socket.IO + BullMQ
├── db/                       # Prisma schema + migrations + seeds
├── shared/                   # Types, Zod schemas, constants (no deps)
└── docs/                     # Architecture, API, deployment docs
```

### Data Flow

```mermaid
graph TD
    A[Visitor Browser] -->|Widget Embed| B[Frontend Next.js]
    B -->|API Calls| C[Backend Express]
    B -->|WebSocket| D[Socket.IO Server]
    C -->|ORM| E[PostgreSQL / Prisma]
    C -->|Queues| F[BullMQ / Redis]
    C -->|AI API| G[OpenAI / Anthropic]
    C -->|Embeddings| H[pgvector]
    C -->|Auth| I[JWT]
    
    subgraph "Multi-tenant Layer"
        C -->|Scoped by orgId| E
    end
```

### Module Map

```mermaid
graph LR
    A[Chatbot Manager] --> B[Widget System]
    A --> C[Prompt Studio]
    A --> D[Knowledge Base]
    A --> E[Workflow Engine]
    A --> F[Agent System]
    A --> G[Theme Editor]
    A --> H[Analytics]
    A --> I[Conversations]
    A --> J[Leads]
    A --> K[Human Handoff]
    
    D --> L[RAG Pipeline]
    E --> M[Automation]
    F --> N[AI Tools]
```

## Tech Stack

### Frontend
- **Next.js 14** (App Router) — React framework
- **React 18** — UI components
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui + Radix UI** — Accessible primitives (18 components)
- **Framer Motion** — Animations
- **Zustand** — Client state (4 stores)
- **TanStack Query** — Server state (6 query hooks)
- **Socket.IO Client** — Real-time
- **Recharts** — Charts (license TBD)
- **Lucide React** — Icons
- **Sonner** — Toasts
- **Monaco Editor** — Prompt code editing
- **React Dropzone** — File uploads

### Backend
- **Node.js + Express** — HTTP server
- **Socket.IO** — WebSocket with rooms
- **BullMQ + Redis** — Job queues (6 queues)
- **Prisma Client** — ORM
- **JWT (jsonwebtoken)** — Auth
- **Zod** — Schema validation
- **Multer** — File uploads
- **Helmet + CORS** — Security headers
- **bcryptjs** — Password hashing

### AI / ML
- **OpenAI API** — GPT-4o, GPT-4o-mini, text-embedding-3-small
- **LangChain** — Dependency present, not yet used
- **Vercel AI SDK** — Dependency present, not yet used
- **Custom RAG** — Embedding-based semantic search (MVP)

### Database
- **PostgreSQL 15+** — Primary database
- **pgvector** — Vector embeddings (requires extension)

## Modules

| Module | Status | Description |
|--------|--------|-------------|
| Multi-tenant | ⚠️ Partial | Organizations, workspaces, RBAC schema, enforcement incomplete |
| Chatbot Manager | ✅ Implemented | CRUD, AI config, appearance, behavior, presets |
| Widget System | ⚠️ Partial | 4 modes (floating/inline/fullscreen/standalone), mock responses |
| Prompt Studio | ⚠️ Partial | Live editor, variables, versioning UI; backend save not connected |
| Knowledge Base | ⚠️ Partial | Upload UI, no processing pipeline connected |
| RAG Pipeline | ⚠️ Partial | Embedding API call works; semantic search is mocked |
| Workflow Engine | ⚠️ Partial | Backend node evaluator works; frontend is UI-only |
| Agent System | ❌ Mock | Configurator UI only, no backend integration |
| Human Handoff | ⚠️ Partial | Backend handoff creation works; no channel integration |
| Conversation Intel | ⚠️ Partial | AI analysis called but results not persisted |
| Theme Editor | ⚠️ Partial | Live preview works; save to backend not connected |
| White-label | ⚠️ Partial | Schema ready; custom domains not implemented |
| Business Presets | ✅ Implemented | 14 industry templates with prompts, messages, colors |
| Analytics | ⚠️ Partial | Funnel data from backend works; satisfaction/token tabs mock |
| Billing | ❌ Mock | Plan cards UI; Stripe not integrated |

## Directory Structure

```
chatmbl/
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/        # Login, Register
│   │   │   └── (dashboard)/   # Dashboard layout + 12 pages
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui primitives (18 files)
│   │   │   ├── shared/        # StatCard, EmptyState, PageHeader, etc.
│   │   │   ├── dashboard/     # Shell, Sidebar, Header
│   │   │   ├── chatbot-widget/# Widget component (4 modes)
│   │   │   ├── prompt-studio/ # Prompt editor
│   │   │   ├── knowledge-base/# Document uploader
│   │   │   ├── workflow-builder/ # UI-only canvas
│   │   │   ├── theme-editor/  # Live preview
│   │   │   ├── agents/        # UI-only configurator
│   │   │   ├── config-editor/ # AI, appearance, behavior editors
│   │   │   └── business-presets/ # Preset selector
│   │   ├── hooks/             # 9 hooks (TanStack Query + Zustand)
│   │   ├── stores/            # 4 Zustand stores
│   │   ├── providers/         # Theme + Query + Toast
│   │   ├── lib/               # API client, utilities
│   │   └── styles/            # Global CSS
│   ├── tailwind.config.ts
│   └── next.config.js
├── backend/
│   ├── src/
│   │   ├── modules/           # 11 feature modules
│   │   │   ├── auth/          # Register, login, refresh
│   │   │   ├── chatbots/      # CRUD, appearance, behavior, AI config
│   │   │   ├── chat/          # Chat endpoints
│   │   │   ├── conversations/ # Conversation CRUD
│   │   │   ├── leads/         # Lead CRUD
│   │   │   ├── analytics/     # Dashboard, funnel, tokens
│   │   │   ├── documents/     # Document routes (incomplete)
│   │   │   ├── knowledge/     # Knowledge routes (incomplete)
│   │   │   ├── workflows/     # Workflow routes
│   │   │   ├── webhooks/      # Webhook routes
│   │   │   └── workspaces/    # Workspace routes
│   │   ├── services/          # AI, RAG, Analytics, Workflow, Security
│   │   ├── repositories/      # Data access layer
│   │   ├── common/            # Middleware, errors, logger, guards
│   │   ├── websocket/         # Socket.IO server
│   │   ├── queue/             # BullMQ queue definitions
│   │   └── config/            # Environment config
│   └── package.json
├── db/
│   ├── prisma/
│   │   ├── schema.prisma      # 22 models, 12 enums
│   │   └── migrations/        # Empty — no migrations run yet
│   ├── seeds/                 # seed.ts with demo data
│   └── docs/                  # Database docs + ERD
├── shared/
│   ├── src/
│   │   ├── types/             # TypeScript interfaces (7 files)
│   │   ├── schemas/           # Zod validation schemas (2 files)
│   │   └── constants/         # Business presets, plans (2 files)
│   └── package.json
└── docs/
    ├── architecture.md         # System architecture + Mermaid diagrams
    ├── api.md                  # API reference
    ├── deployment.md           # Deployment guide
    └── security.md             # Security overview
```

## Environment Variables

See `.env.example` for full list. Required variables for development:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chatmbl"
JWT_SECRET="generate-a-random-secret"          # openssl rand -hex 64
ENCRYPTION_KEY="generate-another-random-string"
OPENAI_API_KEY="sk-..."                        # Required for AI features
```

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd chatmbl
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Database
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed demo data

# 4. Start development
npm run dev            # Frontend :3000 + Backend :4000
```

### Demo Credentials
- **Email:** admin@acme.com
- **Password:** Admin123!

## Running

```bash
# All services (root)
npm run dev

# Individual
npm run dev:frontend   # http://localhost:3000
npm run dev:backend    # http://localhost:4000

# Database tools
npm run db:studio      # Prisma Studio
npm run db:migrate     # Run migrations
npm run db:seed        # Seed demo data

# Validation
npm run lint           # ESLint both workspaces
npm run typecheck      # TypeScript check both workspaces
npm run build          # Build all packages
```

## API Health Check

```bash
curl http://localhost:4000/api/health
# {"status":"ok","timestamp":"...","uptime":...,"checks":{"database":"connected","redis":"configured","openai":"configured"}}
```

## Security

> **⚠️ Production Warning:**
> - `JWT_SECRET` and `ENCRYPTION_KEY` must be changed from defaults before production
> - Authentication tokens are stored in localStorage (XSS risk — migrate to httpOnly cookies)
> - No endpoint input validation is enforced yet (Zod middleware exists but is not applied to all routes)
> - AI API keys are read from `process.env` in multiple services — centralize before scaling

### Current protections
- Helmet.js security headers (CSP not configured)
- CORS restricted to frontend origin
- Rate limiting (100 req / 15 min, global — needs per-endpoint)
- bcryptjs password hashing (12 rounds)
- Basic prompt injection detection
- Basic input sanitization
- RBAC roles (owner, admin, member, viewer)

## Limitations

1. **AI Provider Lock-in**: Only OpenAI implemented. Anthropic, OpenRouter credentials exist in config but have no integration code.
2. **Mock RAG**: Semantic search uses `simpleEmbedding()` which generates random vectors — not real embeddings. The RAG pipeline is not functional.
3. **No Migrations**: The `db/prisma/migrations/` directory contains no migration files. `prisma db push` is required for schema sync.
4. **Frontend Mock Components**: AgentConfigurator, WorkflowCanvas, DocumentUploader (process buttons), ThemeEditor (save), and PromptEditor (save) have no backend connection.
5. **No Real-time Chat**: The PremiumWidget uses `setTimeout` to simulate AI responses. Streaming is not connected.
6. **No Multi-tenant Enforcement**: WebSocket rooms do not verify organization access (fixed in recent update). Several API endpoints lack org-scoped query verification.
7. **No Tests**: Zero test files across the entire project.
8. **No PWA / Offline Support**: All pages are client-side rendered with no service worker.
9. **No Internationalization**: All UI text is hardcoded in English.
10. **No Mobile Responsiveness**: Dashboard sidebar uses fixed 260px padding that breaks on mobile.

## Roadmap

### Short-term (pre-production)
- [ ] Centralize AI API keys in config service
- [ ] Apply Zod validation middleware to all API routes
- [ ] Implement real embedding storage and semantic search with pgvector
- [ ] Connect UI components to backend APIs (AgentConfigurator, WorkflowCanvas, etc.)
- [ ] Migrate auth tokens to httpOnly cookies
- [ ] Add comprehensive error boundaries and loading states
- [ ] Implement proper RAG pipeline with document parsing workers

### Medium-term
- [ ] AI provider abstraction (OpenAI + Anthropic + OpenRouter)
- [ ] Real-time chat streaming with Vercel AI SDK
- [ ] Multi-channel integration (WhatsApp, Telegram, Slack, Email)
- [ ] Team inbox with conversation routing
- [ ] Unit and integration test suite
- [ ] Mobile-responsive dashboard

### Long-term
- [ ] SSO/SAML enterprise authentication
- [ ] i18n support
- [ ] PWA with offline capabilities
- [ ] Mobile native apps
- [ ] Marketplace for chatbot templates

## Development Conventions

- **Modularity**: Each feature is a self-contained module. No cross-module imports between frontend and backend.
- **Shared Types**: Use `@chatmbl/shared` for types/schemas shared between frontend and backend.
- **Backend First**: All sensitive logic (API keys, business rules) lives in backend. Frontend contains zero secrets.
- **No Monolith**: Frontend and backend are separate npm workspaces. No mixing.
- **Database Isolation**: All DB access is scoped to the `db` workspace via Prisma.
- **Naming**: Files use kebab-case. Classes use PascalCase. Functions use camelCase. Constants use UPPER_SNAKE_CASE.
- **Imports**: Use path aliases (`@/` for frontend src, no relative `../../` hell).
- **Error Handling**: Services throw `AppError`. Error handler middleware converts to JSON response. Controllers catch and forward.
- **State**: Zustand for client state. TanStack Query for server state. Never mix both for the same data.

## Contributing

1. Follow the [Development Conventions](#development-conventions)
2. Check the [Limitations](#limitations) and [Roadmap](#roadmap) for current priorities
3. Run `npm run typecheck` and `npm run lint` before committing
4. Write clear commit messages following conventional commits:
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `docs:` — Documentation
   - `refactor:` — Code restructuring
   - `chore:` — Maintenance
   - `security:` — Security fix

## Commit Convention

```bash
git add <files>
git commit -m "<type>: <brief description>"
```

This project uses conventional commits. Example:
```
feat: add chatbot CRUD endpoints
fix: correct WebSocket room access control
docs: add API reference for analytics module
security: centralize JWT secret validation
```

## License

Private — All rights reserved.
