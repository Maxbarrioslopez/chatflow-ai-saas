# Frontend Library

Utility functions and the API client.

## Files

| File | Purpose |
|------|---------|
| `api.ts` | HTTP API client (GET, POST, PUT, PATCH, DELETE) with auth token injection and error handling |
| `utils.ts` | Tailwind CSS className merging utility (`cn()`) |

## API Client

The `api` singleton in `api.ts` provides a typed HTTP client for all backend communication.

```typescript
import { api } from '@/lib/api';

// GET with query params
const chatbots = await api.get<any[]>('/chatbots', { status: 'active' });

// POST with body
const newBot = await api.post<any>('/chatbots', { name: 'Support Bot' });

// PUT
await api.put(`/chatbots/${id}`, { name: 'Updated Name' });

// DELETE
await api.delete(`/chatbots/${id}`);
```

### Error Handling

All API errors are thrown as `ApiError` with `message`, `statusCode`, and optional `details`.

```typescript
try {
  await api.post('/chatbots', data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message, error.statusCode);
  }
}
```

### Auth Token

- Token is read from Zustand `chatflow-auth` localStorage key
- Automatic redirect to `/login` on 401 responses
- Content-Type is always `application/json`

## Utils

```typescript
import { cn } from '@/lib/utils';

// Merges Tailwind classes, handling conflicts
<div className={cn('px-4', isActive && 'bg-primary', className)} />
```

Uses `clsx` + `tailwind-merge` for intelligent className merging.

## What Goes Here

- API client configuration
- Utility functions
- Helper libraries

## What Does NOT Go Here

- React hooks (goes in `hooks/`)
- React components (goes in `components/`)
- State stores (goes in `stores/`)
- Types or schemas (goes in `shared/`)
