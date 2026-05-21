# Shared Zod Schemas

Validation schemas shared between frontend and backend for consistent input validation.

## Files

| File | Schemas | Used By |
|------|---------|---------|
| `auth.ts` | `loginSchema`, `registerSchema` | POST /api/auth/login, POST /api/auth/register |
| `chatbot.ts` | `createChatbotSchema`, `updateChatbotSchema` | POST /api/chatbots, PUT /api/chatbots/:id |
| `index.ts` | Re-exports all | — |

## Usage

```typescript
import { loginSchema, registerSchema } from '@chatmbl/shared';

// Backend middleware
router.post('/register', validate(registerSchema), controller.register);

// Frontend validation
const result = registerSchema.safeParse(formData);
if (!result.success) {
  // handle validation errors
}
```

## Current Coverage

- Auth (login, register) — ✅ Implemented
- Chatbot (create, update) — ✅ Implemented
- Chat, Lead, Analytics, Billing — ❌ Not yet implemented

## What Goes Here

- Zod validation schemas
- Input validation rules
- Type inference from schemas

## What Does NOT Go Here

- TypeScript interfaces (goes in `types/`)
- Constants (goes in `constants/`)
- Business logic
