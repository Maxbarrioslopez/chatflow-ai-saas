# Backend Common

Shared infrastructure: middleware, error handling, logging, guards, and validators.

## Structure

```
common/
├── errors/           # AppError class + error handler middleware
│   ├── error-handler.ts  # Catches AppError, ZodError, PrismaError, SyntaxError
│   └── index.ts
├── middleware/       # Express middleware
│   ├── auth-guard.ts # authenticate() + requireRole()
│   ├── rate-limiter.ts  # Global rate limiter (100 req / 15 min)
│   ├── validate.ts   # Zod schema validation middleware
│   └── index.ts
├── logger/          # Structured JSON logger
│   └── index.ts
├── guards/          # Route guards (placeholder)
│   └── index.ts
└── validators/      # Additional validators (placeholder)
    └── index.ts
```

## What Goes Here

- Cross-cutting concerns used by every module
- Error handling patterns
- Authentication and authorization middleware
- Rate limiting
- Request validation
- Logging

## What Does NOT Go Here

- Module-specific logic (goes in `modules/`)
- Business services (goes in `services/`)
- Data access (goes in `repositories/`)

## Middleware Usage

```typescript
import { authenticate, requireRole } from '../../common/middleware';
import { validate } from '../../common/middleware/validate';
import { createChatbotSchema } from '@chatflow/shared';

router.post('/', authenticate, validate(createChatbotSchema), controller.create);
router.delete('/:id', authenticate, requireRole('owner', 'admin'), controller.delete);
```

## Error Handling Pattern

```typescript
// Service throws
throw new AppError(404, 'Chatbot not found');

// Controller catches and forwards
async method(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.method(req.params.id, req.organizationId!);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// Error handler middleware converts to JSON
// { error: { message: "Chatbot not found", statusCode: 404 } }
```
