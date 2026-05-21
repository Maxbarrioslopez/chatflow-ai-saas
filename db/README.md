# ChatMBL Database

PostgreSQL 15+ with Prisma ORM. Contains the complete data schema for the multi-tenant chatbot platform.

## Stack

- **PostgreSQL 15+** — Relational database
- **Prisma 5.x** — Type-safe ORM and migrations
- **pgvector** — Extension for vector embeddings (required for RAG)
- **Node.js** — Seed scripts (tsx)

## Schema Overview

**22 models**, **12 enums**, covering organizations, chatbots, conversations, AI, workflows, knowledge, billing, and audit.

### Core Models

| Model | Table | Description | Key Relations |
|-------|-------|-------------|---------------|
| Organization | `organizations` | Top-level tenant | Users, Chatbots, Subscription, ApiKeys |
| Workspace | `workspaces` | Sub-organization grouping | Organization |
| User | `users` | Team members | Organization, Conversations |
| Chatbot | `chatbots` | AI chatbot instance | Organization, Appearance, Behavior, AIConfig, Whitelabel, Conversations, Leads, Knowledge, Workflows |
| ChatbotAppearance | `chatbot_appearances` | Widget styling (1:1) | Chatbot |
| ChatbotBehavior | `chatbot_behaviors` | Widget behavior config (1:1) | Chatbot |
| AIConfig | `ai_configs` | AI model settings (1:1) | Chatbot |
| WhitelabelConfig | `whitelabel_configs` | White-label settings (1:1) | Chatbot |
| Prompt | `prompts` | Reusable prompt templates | Chatbot, PromptVersions |
| PromptVersion | `prompt_versions` | Version history | Prompt |
| Workflow | `workflows` | Automation workflows | Chatbot |
| KnowledgeSource | `knowledge_sources` | Documents, websites, text, FAQs | Chatbot, Embeddings |
| Embedding | `embeddings` | Vector embeddings | KnowledgeSource |
| Conversation | `conversations` | Visitor conversations | Chatbot, Messages, Lead, Handoffs |
| Message | `messages` | Chat messages | Conversation |
| Lead | `leads` | Captured leads | Chatbot, Conversation |
| Handoff | `handoffs` | Human handoff requests | Conversation |
| Subscription | `subscriptions` | Plan subscriptions (1:1) | Organization |
| Integration | `integrations` | Third-party integrations | Organization, Chatbot |
| ApiKey | `api_keys` | API access keys | Organization |
| TokenUsage | `token_usage` | AI token consumption logs | Organization |
| AuditLog | `audit_logs` | Admin action audit trail | Organization |

### Enums

- `UserRole` — owner, admin, member, viewer
- `ConversationStatus` — active, waiting, resolved, closed, spam
- `LeadStatus` — new, qualified, contacted, converted, lost, spam
- `LeadSource` — chatbot, widget, api, manual, import, integration
- `KnowledgeSourceType` — document, website, text, faq, qapairs
- `KnowledgeSourceStatus` — processing, ready, error
- `MessageRole` — user, assistant, system
- `SubscriptionStatus` — active, canceled, past_due, trialing, incomplete
- `HandoffChannel` — email, whatsapp, slack, discord, telegram, ticket, live
- `HandoffStatus` — pending, accepted, resolved, rejected

## Files

```
db/
├── prisma/
│   ├── schema.prisma        # Full schema (22 models, 12 enums)
│   └── migrations/
│       └── README.md        # No migrations run yet
├── seeds/
│   └── seed.ts              # Demo data (organization, user, chatbot)
├── docs/
│   ├── database-overview.md # Model descriptions and relationships
│   └── erd.md               # Mermaid ERD diagram
├── package.json
└── tsconfig.json
```

## pgvector Requirement

The `Embedding` model uses `Unsupported("vector(1536)")` for vector storage.

```sql
-- Required before first migration:
CREATE EXTENSION IF NOT EXISTS vector;
```

> **⚠️ Important:** The `vector` type in Prisma is marked as `Unsupported`, which means `prisma generate` may produce warnings or require special handling. See [Prisma docs on unsupported types](https://www.prisma.io/docs/orm/reference/unsupported).

## Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate     # prisma generate

# Push schema to DB (development — no migration file)
npm run db:push         # prisma db push

# Create migration
npm run db:migrate      # prisma migrate dev

# Apply migrations (production)
npm run db:deploy        # prisma migrate deploy

# Reset database
npm run db:reset

# Seed demo data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Seed Data

`seeds/seed.ts` creates:

1. **Organization** — Acme Corp
2. **User** — admin@acme.com / Admin123! (role: owner)
3. **Chatbot** — "Support Bot" with AI config, appearance, and behavior
4. **Sample conversations** and messages

Run with: `npm run db:seed`

## Known Limitations

1. **No migration files exist** — Migration history is empty. Use `prisma db push` for development schema sync.
2. **pgvector extension required** — Must be installed in PostgreSQL before migrations work.
3. **No composite indexes** on key query patterns (orgId + chatbotId + status).
4. **`knowledge_sources.content`** has no size constraint.
5. **Lead email is not unique** — Duplicate leads possible.
6. **TokenUsage** lacks chatbotId index for per-bot queries.
7. **BusinessPreset is a free string** — No enum enforcement in DB.
