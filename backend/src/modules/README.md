# Backend Modules

Feature modules following a controller → service → repository pattern.

## Structure

Each module contains:
- `*.controller.ts` — HTTP request handling (parse, delegate, respond)
- `*.routes.ts` — Route definitions with middleware
- `*.service.ts` — Business logic (optional, can use shared services)

## Modules

| Module | Files | Status |
|--------|-------|--------|
| `auth/` | controller, routes, service | ✅ Implemented |
| `chatbots/` | controller, routes, service | ✅ Implemented |
| `chat/` | controller, routes, service | ⚠️ Partial (send not connected) |
| `conversations/` | controller, routes, service | ✅ Implemented |
| `leads/` | controller, routes, service | ✅ Implemented |
| `analytics/` | controller, routes, service | ⚠️ Partial (some mock data) |
| `documents/` | routes only | ❌ Incomplete |
| `knowledge/` | routes only | ❌ Incomplete |
| `workflows/` | routes only | ❌ Service exists in services/ |
| `webhooks/` | routes only | ❌ Incomplete |
| `workspaces/` | routes only | ❌ Incomplete |

## What Goes Here

- Request/response handling (controllers)
- Route definitions with middleware chains (routes)
- Module-specific business logic (services)

## What Does NOT Go Here

- Shared business logic (goes in `services/`)
- Data access (goes in `repositories/`)
- Cross-cutting concerns (goes in `common/`)
- Infrastructure (goes in `websocket/`, `queue/`)
