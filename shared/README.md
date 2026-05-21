# ChatFlow Shared Package

Types, Zod validation schemas, and constants shared between frontend and backend.

## Purpose

The `shared` package prevents type duplication and ensures consistent validation between client and server. It is an npm workspace dependency of both `@chatflow/frontend` and `@chatflow/backend`.

## Rules

- **Zero runtime dependencies** — Must not import from frontend, backend, or db packages
- **Zero Node.js APIs** — Must be usable in browser (no `fs`, `path`, `process`)
- **Type-only where possible** — Prefer types over runtime code
- **No secrets** — Never include API keys, passwords, or environment config

## Structure

```
shared/src/
├── types/           # TypeScript interfaces and type definitions
│   ├── index.ts     # Re-exports all types
│   ├── auth.ts      # AuthUser, AuthTokens, LoginInput, RegisterInput
│   ├── chatbot.ts   # Chatbot, ChatbotAppearance, ChatbotBehavior, AIConfig, WhitelabelConfig
│   ├── chat.ts      # ChatMessage, ChatRequest, ChatResponse
│   ├── lead.ts      # Lead, LeadCreate
│   ├── analytics.ts # AnalyticsEvent, DashboardMetrics
│   └── billing.ts   # Subscription, Plan, Invoice
├── schemas/         # Zod validation schemas
│   ├── index.ts     # Re-exports all schemas
│   ├── auth.ts      # loginSchema, registerSchema
│   └── chatbot.ts   # createChatbotSchema, updateChatbotSchema
├── constants/       # Shared constants and configuration
│   ├── index.ts     # Re-exports all constants
│   ├── business-presets.ts  # 14 industry presets
│   └── plans.ts     # Pricing plans (free, starter, pro, enterprise)
└── index.ts         # Package entry point (re-exports everything)
```

## Types

### Auth
- `AuthUser` — id, email, name, role, organizationId, avatarUrl
- `AuthTokens` — accessToken, refreshToken, expiresAt
- `LoginInput` — email, password
- `RegisterInput` — name, email, password, organizationName

### Chatbot
- `CreateChatbotInput` — name, description, businessPreset
- `Chatbot` — Full chatbot model as returned by API
- `ChatbotListItem` — Summary for list views

### Chat
- `ChatMessage` — role, content, id, timestamp
- `ChatRequest` — chatbotId, messages, conversationId
- `ChatResponse` — content, usage, model

### Lead
- `Lead` — Full lead model with scoring
- `LeadCreate` — Minimal lead creation input

### Analytics
- `AnalyticsEvent` — Event types for tracking
- `DashboardMetrics` — Metric shapes returned by analytics API

### Billing
- `Subscription` — Plan subscription model
- `Plan` — Plan definition with features and limits

## Schemas (Zod)

| Schema | Validates | Used By |
|--------|-----------|---------|
| `loginSchema` | email (valid email), password (min 6) | `POST /api/auth/login` |
| `registerSchema` | name, email, password (min 8), organizationName | `POST /api/auth/register` |
| `createChatbotSchema` | name (required), description, businessPreset | `POST /api/chatbots` |
| `updateChatbotSchema` | name, description, isActive (partial) | `PUT /api/chatbots/:id` |

## Constants

### Business Presets (14 industries)

Each preset includes: system prompt, welcome message, suggested messages, quick actions, analytics tags, gradient colors, and accent color.

| ID | Industry |
|----|----------|
| portfolio | Portfolio / Freelance |
| agency | Agency |
| ecommerce | E-commerce |
| clinic | Medical Clinic |
| restaurant | Restaurant |
| legal | Legal |
| hr | Human Resources |
| saas | SaaS |
| education | Education |
| support | Customer Support |
| tourism | Tourism |
| realestate | Real Estate |
| logistics | Logistics |
| agriculture | Agriculture |

### Pricing Plans

| Plan | Monthly Chats | Chatbots | Features |
|------|--------------|----------|----------|
| Free | 500 | 1 | Basic widget, 1 user |
| Starter | 5,000 | 3 | + Analytics, prompt studio |
| Pro | 25,000 | 10 | + RAG, workflows, API access |
| Enterprise | Unlimited | Unlimited | + SSO, white-label, SLA |

## Extending Shared

```typescript
// 1. Add type in types/
// types/widget.ts
export interface WidgetConfig {
  id: string;
  theme: WidgetTheme;
}

// 2. Export from types/index.ts
export { WidgetConfig } from './widget';

// 3. Export from shared/src/index.ts (auto if using barrel export)
```
