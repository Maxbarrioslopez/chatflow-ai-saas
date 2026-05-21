# Database Overview

## Technology
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL 15+
- **Migrations**: Prisma Migrate

## Core Models

### Organization
Top-level tenant entity. All data is scoped to an organization.

### User
Team members belonging to an organization. Roles: owner, admin, member, viewer.

### Chatbot
Each chatbot has its own configuration, appearance, behavior, and AI settings.

### Conversation & Message
Visitor conversations with messages. Each message has role (user/assistant/system).

### Lead
Captured leads from conversations with scoring and status tracking.

### KnowledgeSource
Documents, websites, or text used as knowledge base for chatbots.

### Subscription
Plan subscriptions linked to Stripe.

## Key Relationships
- Organization -> Users (1:N)
- Organization -> Chatbots (1:N)
- Chatbot -> Appearance (1:1)
- Chatbot -> Behavior (1:1)
- Chatbot -> AIConfig (1:1)
- Chatbot -> Conversations (1:N)
- Conversation -> Messages (1:N)
- Chatbot -> Leads (1:N)
- Chatbot -> KnowledgeSources (1:N)
- Organization -> Subscription (1:1)

## Migrations
```bash
# Development
npm run db:migrate

# Production
npm run db:migrate:prod

# Seed
npm run db:seed

# Open Prisma Studio
npm run db:studio
```
