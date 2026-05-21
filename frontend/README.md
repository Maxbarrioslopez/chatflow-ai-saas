# ChatMBL Frontend

Next.js 14 (App Router) SaaS dashboard and embeddable chatbot widget.

## Stack

- **Next.js 14** — App Router, React 18, TypeScript
- **Tailwind CSS** — Utility-first with custom design tokens
- **shadcn/ui + Radix UI** — Accessible primitive components (18 files)
- **Framer Motion** — Animations and transitions
- **Zustand** — Client-side state (4 stores)
- **TanStack Query** — Server state and caching (6 query hooks)
- **Socket.IO Client** — Real-time WebSocket
- **Recharts** — Data visualization
- **Lucide React** — Icons
- **Sonner** — Toast notifications

## Structure

```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout (providers, fonts)
│   ├── page.tsx               # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx         # DashboardShell wrapper
│       └── dashboard/
│           ├── page.tsx               # Home / metrics
│           ├── chatbots/              # Chatbot list + detail (6 tabs)
│           ├── conversations/         # Conversation list
│           ├── leads/                 # Lead list
│           ├── analytics/             # Overview, funnel, tokens, satisfaction
│           ├── knowledge/             # Knowledge base
│           ├── workflows/             # Workflow builder
│           ├── agents/                # Agent configurator
│           ├── prompts/               # Prompt studio
│           ├── theme/                 # Theme editor
│           ├── settings/              # Account settings
│           └── billing/               # Subscription plans
├── components/
│   ├── ui/                    # shadcn/ui primitives (18 files)
│   ├── shared/                # StatCard, EmptyState, PageHeader, etc.
│   ├── dashboard/             # Shell, Sidebar, Header
│   ├── chatbot-widget/        # Widget (4 modes: floating/inline/fullscreen/standalone)
│   ├── prompt-studio/         # Prompt editor with test preview
│   ├── knowledge-base/        # Document uploader (drag-drop, URL, text, FAQ)
│   ├── workflow-builder/      # UI-only canvas (not connected to backend)
│   ├── theme-editor/          # Live preview with PremiumWidget
│   ├── agents/                # UI-only configurator (not connected to backend)
│   ├── config-editor/         # AI, appearance, behavior editors
│   ├── chatbot-preview/       # Create modal + preview
│   └── business-presets/      # 14 industry presets selector
├── hooks/                     # Custom hooks
├── stores/                    # Zustand stores
├── providers/                 # ThemeProvider, QueryProvider, ToastProvider
├── lib/                       # API client, utility functions
└── styles/                    # Global CSS with Tailwind
```

## Routes

| Path | Page | Status |
|------|------|--------|
| `/` | Landing | Static |
| `/login` | Login | Connected |
| `/register` | Register | Connected |
| `/dashboard` | Metrics overview | Partial (some mock data) |
| `/dashboard/chatbots` | Chatbot list | Connected |
| `/dashboard/chatbots/[id]` | Chatbot detail (6 tabs) | Connected |
| `/dashboard/conversations` | Conversations | Needs backend |
| `/dashboard/leads` | Leads | Needs backend |
| `/dashboard/analytics` | Analytics (4 tabs) | Partial (funnel mock) |
| `/dashboard/knowledge` | Knowledge base | Needs backend |
| `/dashboard/workflows` | Workflow builder | UI only |
| `/dashboard/agents` | Agent configurator | UI only |
| `/dashboard/prompts` | Prompt studio | Needs backend |
| `/dashboard/theme` | Theme editor | UI only |
| `/dashboard/settings` | Settings | Needs backend |
| `/dashboard/billing` | Billing | UI only |

## Components — Connection Status

| Component | Backend Connected | Notes |
|-----------|------------------|-------|
| PremiumWidget | ❌ No | Uses `setTimeout` mock for AI responses |
| PromptEditor | ❌ No | "Save Version" and "Test" are mock |
| DocumentUploader | ❌ No | "Process Text", "Fetch", "Save FAQs" have no handlers |
| WorkflowCanvas | ❌ No | Pure UI, no API calls |
| AgentConfigurator | ❌ No | Pure UI, no API calls |
| ThemeEditor | ❌ No | "Apply Theme" has no handler |
| PresetSelector | ⚠️ Partial | Creates chatbot with preset data |
| CreateChatbotModal | ✅ Yes | Calls POST /api/chatbots |

## Hooks

| Hook | Type | Purpose |
|------|------|---------|
| `use-query.ts` | Provider | TanStack Query client setup with defaults |
| `use-chatbots-query.ts` | TanStack | Chatbot CRUD queries |
| `use-conversations-query.ts` | TanStack | Conversation queries |
| `use-leads-query.ts` | TanStack | Lead queries |
| `use-analytics.ts` | Custom | Dashboard metrics fetch |
| `use-auth.ts` | Custom | Auth actions (register, login, logout) |
| `use-chatbots.ts` | Custom | Local chatbot fetch (duplicates query) |
| `use-conversations.ts` | Custom | Local conversation fetch (duplicates query) |
| `use-leads.ts` | Custom | Local lead fetch (duplicates query) |
| `use-websocket.ts` | Custom | Socket.IO connection + subscriptions |

> **Note:** `use-chatbots.ts`, `use-conversations.ts`, and `use-leads.ts` duplicate functionality provided by the TanStack Query hooks (`use-*-query.ts`). These should be consolidated.

## Stores (Zustand)

| Store | Persisted | Purpose |
|-------|-----------|---------|
| `auth-store.ts` | ✅ localStorage | User + tokens |
| `chatbot-store.ts` | ❌ | Bot list, CRUD operations |
| `analytics-store.ts` | ❌ | Dashboard metrics |
| `ui-store.ts` | ❌ | Sidebar, theme, command palette state |

> **Security note:** Auth tokens are stored in localStorage. For production, migrate to httpOnly cookies to mitigate XSS risk.

## Environment Variables

```bash
NEXT_PUBLIC_API_URL="http://localhost:4000/api"  # Backend API URL
NEXT_PUBLIC_WS_URL="http://localhost:4000"        # WebSocket URL
```

## Running

```bash
npm run dev        # Development server on :3000
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## API Client

All API calls go through `src/lib/api.ts`. Usage:

```typescript
import { api } from '@/lib/api';

const chatbots = await api.get('/chatbots');
const newBot = await api.post('/chatbots', { name: 'Support Bot', businessPreset: 'support' });
```

## Known Technical Debt

1. **Auth tokens in localStorage** — XSS vulnerability; migrate to httpOnly cookies
2. **Duplicate data fetching** — Zustand stores and TanStack Query both fetch chatbot/conversation/lead data
3. **Sidebar active route detection** — Uses `startsWith` which can match incorrect paths
4. **DashboardShell responsive** — Fixed 260px sidebar padding breaks on mobile
5. **Missing error boundaries** — No `error.tsx` or `loading.tsx` in dashboard routes
6. **Mock UI components** — 5+ components are decorative with no backend connection
7. **No pagination** — Conversations and leads lists fetch all data at once
8. **WebSocket hook** — Subscription emit API is incorrect (sends event as channel)
9. **No debounced search** — No debounce on lead/conversation search inputs

## UI/UX Conventions

- Use `cn()` from `@/lib/utils` for conditional className merging
- Import icons from `lucide-react` — avoid inline SVGs
- Use shadcn/ui components for all form controls (Button, Input, Select, etc.)
- Use Framer Motion `motion.div` for enter/exit animations
- Use `PageHeader` for consistent page titles with action buttons
- Use `StatCard` for metric displays
- Use `EmptyState` for empty lists with CTA
- Use `Skeleton` for loading states (apply consistently)
- Dark mode via `next-themes` with Tailwind `dark:` variant
