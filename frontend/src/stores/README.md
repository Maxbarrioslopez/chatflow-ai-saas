# Zustand Stores

Client-side state management with Zustand. Used for UI state, authentication, and local data caching.

## Stores

| Store | File | Persisted | Key State |
|-------|------|-----------|-----------|
| Auth | `auth-store.ts` | ✅ localStorage | user, tokens, isAuthenticated |
| UI | `ui-store.ts` | ❌ | sidebarOpen, sidebarCollapsed, theme, commandPaletteOpen |
| Chatbot | `chatbot-store.ts` | ❌ | chatbots, currentChatbot, isLoading |
| Analytics | `analytics-store.ts` | ❌ | metrics, conversationsData, leadsData, satisfactionData |

## Usage

```typescript
import { useAuthStore } from '@/stores/auth-store';

// Read
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Write
const { setAuth, clearAuth } = useAuthStore.getState();
setAuth(userData, tokens);
```

## What Goes Here

- Client-only state (UI preferences, current selections)
- Auth state (persisted to localStorage)
- Local data caches

## What Does NOT Go Here

- Server state (use TanStack Query hooks instead)
- Business logic
- API calls (use `api` from `lib/api.ts`)

## Known Issues

1. **Auth tokens in localStorage** — XSS vulnerability. Migrate to httpOnly cookies for production.
2. **Chatbot store duplicates TanStack Query** — Use `useChatbotsQuery()` from hooks instead.
3. **Analytics store duplicates TanStack Query pattern** — Should use React Query for server data.
4. **`partialize` in auth-store** is unnecessary since `persist` middleware already handles serialization.
