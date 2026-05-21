# Frontend Hooks

Custom React hooks for data fetching, authentication, real-time events, and state management.

## Hooks

| Hook | Type | Purpose | Status |
|------|------|---------|--------|
| `use-query.ts` | Provider | TanStack Query client setup | ✅ |
| `use-chatbots-query.ts` | TanStack | Chatbot list, detail, create, delete | ✅ |
| `use-conversations-query.ts` | TanStack | Conversation list | ✅ |
| `use-leads-query.ts` | TanStack | Lead list | ✅ |
| `use-analytics.ts` | Custom | Dashboard metrics fetch | ✅ |
| `use-auth.ts` | Custom | Register, login, logout actions | ✅ |
| `use-chatbots.ts` | Custom | Local chatbot fetch (legacy) | ❌ Duplicate |
| `use-conversations.ts` | Custom | Local conversation fetch (legacy) | ❌ Duplicate |
| `use-leads.ts` | Custom | Local lead fetch (legacy) | ❌ Duplicate |
| `use-websocket.ts` | Custom | Socket.IO connection + subscriptions | ⚠️ Buggy |

## TanStack Query Hooks

```typescript
// Reading
const { data, isLoading, error } = useChatbotsQuery();
const { data } = useChatbotQuery('bot-123');

// Writing
const createMutation = useCreateChatbot();
await createMutation.mutateAsync({ name: 'Support Bot', businessPreset: 'support' });

const deleteMutation = useDeleteChatbot();
await deleteMutation.mutateAsync('bot-123');
```

## Custom Hooks

```typescript
// Analytics
const { metrics, isLoading, refetch } = useDashboardMetrics('30d');

// Auth
const { register, login, logout, isLoading } = useAuth();

// WebSocket
const { subscribe, emit } = useWebSocket();
const unsubscribe = subscribe('conversation', 'message:new', (data) => {
  console.log('New message:', data);
});
```

## Known Issues

1. **Duplicate hooks**: `use-chatbots.ts`, `use-conversations.ts`, `use-leads.ts` duplicate the TanStack Query hooks in `use-*-query.ts`. These should be consolidated.
2. **WebSocket hook bug**: The `subscribe` function emits `socket.emit(room, event)` instead of `socket.emit(room, channelId)`. The emit API does not match the server's expected format.

## What Goes Here

- Custom React hooks
- Data fetching and mutation hooks
- WebSocket connection hooks
- Auth action hooks

## What Does NOT Go Here

- Component files (goes in `components/`)
- State stores (goes in `stores/`)
- API client configuration (goes in `lib/`)
