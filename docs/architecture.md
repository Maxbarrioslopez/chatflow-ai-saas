# Architecture

## System Diagram

```mermaid
graph TB
    Client[Browser] --> FE[Next.js Frontend :3000]
    Client --> Widget[Chat Widget]
    
    FE --> API[Express API :4000]
    Widget --> API
    Widget --> WS[WebSocket :4000]
    FE --> WS
    
    API --> DB[(PostgreSQL)]
    API --> R[Redis]
    API --> AI[OpenAI / Anthropic]
    
    subgraph Queues
        R --> Q1[AI Processing]
        R --> Q2[Embeddings]
        R --> Q3[Document Parse]
        R --> Q4[Analytics]
    end
    
    subgraph Backend Services
        API
        WS
        Q1
        Q2
        Q3
        Q4
    end
```

## Multi-Tenant Flow

```mermaid
sequenceDiagram
    User->>FE: Login
    FE->>API: POST /auth/login
    API->>DB: Validate credentials
    DB-->>API: User + Organization
    API-->>FE: JWT + User data
    FE->>WS: Connect with JWT
    WS->>WS: Join org:room
    
    Note over FE,WS: All subsequent requests scoped to organization
    
    FE->>API: GET /chatbots (JWT)
    API->>API: Extract orgId from JWT
    API->>DB: WHERE organizationId = :orgId
    DB-->>API: Scoped results
    API-->>FE: Response
```

## AI Chat Flow with RAG

```mermaid
sequenceDiagram
    Visitor->>Widget: Send message
    Widget->>API: POST /chat/send
    API->>DB: Lookup chatbot config
    API->>RAG: Semantic search
    RAG->>AI: Query embeddings
    AI-->>RAG: Relevant docs
    RAG-->>API: Context + prompt
    API->>AI: Chat completion with context
    AI-->>API: Generated response
    API->>DB: Store messages
    API-->>Widget: Response + metadata
    API->>WS: Broadcast to dashboard
```

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `conversation:new` | Server → Client | New conversation created |
| `conversation:message` | Server → Client | New message in conversation |
| `conversation:status` | Server → Client | Status changed |
| `lead:new` | Server → Client | New lead captured |
| `analytics:update` | Server → Client | Real-time metrics update |

## Workflow Engine

```mermaid
flowchart LR
    T[Trigger] --> C{Condition}
    C -->|True| A1[AI Action]
    C -->|False| A2[Fallback]
    A1 --> W[Webhook]
    A1 --> E[Send Email]
    A1 --> H[Human Handoff]
```

## Data Flow

```
Widget / Web App
    ↓ HTTP / WebSocket
API Gateway (Express + Socket.IO)
    ↓
Auth → Rate Limit → Validation → RBAC
    ↓
Service Layer (AI, RAG, Workflow, Analytics)
    ↓
Repository Layer (Prisma)
    ↓
PostgreSQL + Redis
```
