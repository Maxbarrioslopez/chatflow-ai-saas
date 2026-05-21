# Database Seeds

Demo data seed script for development.

## File

| File | Purpose |
|------|---------|
| `seed.ts` | Creates demo organization, user, chatbot with configs, conversations, and messages |

## What It Creates

1. **Organization** — "Acme Corp" with free plan
2. **User** — `admin@acme.com` with password `Admin123!` (role: owner)
3. **Chatbot** — "Support Bot" with:
   - AI configuration (GPT-4o-mini, system prompt)
   - Appearance (indigo theme, gradient header)
   - Behavior (welcome message, suggested messages)
4. **Sample conversations** and messages

## Running

```bash
npm run db:seed
```

## What Goes Here

- Development seed scripts
- Demo data generators
- Test data factories

## Status

✅ **Implemented.** Creates consistent demo data for local development.
