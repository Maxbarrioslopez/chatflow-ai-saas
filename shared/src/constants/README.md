# Shared Constants

Configuration constants shared between frontend and backend.

## Files

| File | Content | Status |
|------|---------|--------|
| `business-presets.ts` | 14 industry presets with prompts, messages, colors | ✅ |
| `plans.ts` | 4 pricing plans with features and limits | ✅ |
| `index.ts` | Re-exports all | ✅ |

## Business Presets

14 industry templates, each with:

- `id` — Unique identifier (e.g., "ecommerce", "clinic")
- `name` — Display name
- `systemPrompt` — AI system prompt optimized for the industry
- `welcomeMessage` — Initial chatbot message
- `suggestedMessages` — Quick reply buttons
- `quickActions` — Action buttons
- `analyticsTags` — Default tags for tracking
- `gradient` — CSS gradient string
- `color` — Accent color hex

Industries: Portfolio, Agency, E-commerce, Medical Clinic, Restaurant, Legal, HR, SaaS, Education, Customer Support, Tourism, Real Estate, Logistics, Agriculture.

## Pricing Plans

| Plan | Monthly Chats | Chatbots | Users | Features |
|------|--------------|----------|-------|----------|
| Free | 500 | 1 | 1 | Basic widget |
| Starter | 5,000 | 3 | 5 | + Analytics, prompt studio |
| Pro | 25,000 | 10 | 20 | + RAG, workflows, API |
| Enterprise | Unlimited | Unlimited | Unlimited | + SSO, white-label, SLA |

Each plan has: `id`, `name`, `price`, `chatsLimit`, `chatbotsLimit`, `usersLimit`, `features` array.

## What Goes Here

- Application constants
- Business configuration
- Feature flags
- Pricing and plan definitions

## What Does NOT Go Here

- API endpoints or secrets
- Database models
- User-specific data
- Environment configuration

## Extending

```typescript
// Add a new preset
export const NEW_PRESET: BusinessPreset = {
  id: 'new-industry',
  name: 'New Industry',
  systemPrompt: '...',
  // ...
};
```
