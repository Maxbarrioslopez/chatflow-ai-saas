# WebSocket Server

Socket.IO server for real-time events: conversation updates, lead capture, analytics broadcasts.

## Architecture

- **Server**: Socket.IO on the same HTTP server as Express
- **Auth**: JWT token via `socket.handshake.auth.token` or `socket.handshake.query.token`
- **Rooms**: Hierarchical channels for targeted event delivery
- **Transport**: WebSocket with long-polling fallback

## Room Structure

| Room Pattern | Scope | Auto-Join |
|-------------|-------|-----------|
| `org:{orgId}` | Organization-wide | ✅ On connect |
| `conversation:{id}` | Per-conversation | ❌ Via `conversation:join` event |
| `chatbot:{id}` | Per-chatbot | ❌ Via `chatbot:subscribe` event |

## Access Control

Server verifies organization ownership before allowing room joins:

```
conversation:join → check conversation.chatbot.organizationId === socket.organizationId
chatbot:subscribe → check chatbot.organizationId === socket.organizationId
```

## Emit Functions

```typescript
import { emitToOrganization, emitToConversation, emitToChatbot } from '../websocket';

// Broadcast to entire organization
emitToOrganization('org-123', 'conversation:new', { id: 'conv-456' });

// Broadcast to specific conversation
emitToConversation('conv-456', 'message:new', { content: 'Hello', role: 'assistant' });

// Broadcast to chatbot subscribers
emitToChatbot('bot-789', 'lead:captured', { name: 'John', email: 'john@example.com' });
```

## Client Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `conversation:join` | Client → Server | `conversationId: string` |
| `conversation:leave` | Client → Server | `conversationId: string` |
| `chatbot:subscribe` | Client → Server | `chatbotId: string` |

## Status

✅ **Implemented.** Recent fix added room access control. Works with frontend `useWebSocket` hook.
