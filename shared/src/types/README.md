# Shared Types

TypeScript interfaces and types shared between frontend and backend.

## Files

| File | Types | Status |
|------|-------|--------|
| `auth.ts` | AuthUser, AuthTokens, LoginInput, RegisterInput | ✅ |
| `chatbot.ts` | Chatbot, ChatbotListItem, CreateChatbotInput | ✅ |
| `chat.ts` | ChatMessage, ChatRequest, ChatResponse | ✅ |
| `lead.ts` | Lead, LeadCreate | ✅ |
| `analytics.ts` | AnalyticsEvent, DashboardMetrics | ⚠️ Minimal |
| `billing.ts` | Subscription, Plan | ✅ |
| `index.ts` | Re-exports all | ✅ |

## What Goes Here

- TypeScript interfaces and types
- Input/output types for API calls
- Domain model shapes

## What Does NOT Go Here

- Runtime code or classes
- Zod schemas (goes in `schemas/`)
- Constants (goes in `constants/`)
- Frontend-specific or backend-specific types

## Conventions

- Use `interface` for object shapes
- Use `type` for unions, intersections, and primitives
- Use `import type` when importing types only
- Keep types serializable (no functions, no class instances)
