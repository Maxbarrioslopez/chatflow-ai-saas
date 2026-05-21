# Backend Repositories

Data access layer that wraps Prisma queries. Provides a clean API for services to interact with the database without direct Prisma dependency.

## Structure

| File | Repository | Base CRUD | Custom Methods |
|------|-----------|-----------|----------------|
| `base.repository.ts` | Abstract | findById, findMany, create, update, delete, count | |
| `chatbot.repository.ts` | ChatbotRepository | ✅ | findByOrganization, findByIdAndOrganization, countByOrganization |
| `conversation.repository.ts` | ConversationRepository | ✅ | findByChatbot, findByIdWithMessages |
| `lead.repository.ts` | LeadRepository | ✅ | findByChatbot |
| `message.repository.ts` | MessageRepository | ✅ | findByConversation |
| `user.repository.ts` | UserRepository | ✅ | findByEmail, findByOrganization |

## Usage

```typescript
import { chatbotRepository } from '../../repositories';

export class ChatbotService {
  async findAll(organizationId: string) {
    return chatbotRepository.findByOrganization(organizationId);
  }
}
```

## What Goes Here

- Prisma query wrappers
- Complex queries with joins and aggregations
- Multi-tenant scoped queries (orgId filtering)
- Raw SQL queries (if needed)

## What Does NOT Go Here

- Business logic (goes in services/)
- HTTP handling (goes in controllers/)
- Third-party API calls (goes in services/)

## Status

⚠️ **Initial implementation.** Basic repositories exist but services have not been migrated from direct `prisma` usage. Migration is in progress.
