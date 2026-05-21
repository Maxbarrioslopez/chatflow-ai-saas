# Next.js App Router Pages

All page routes for the ChatFlow frontend.

## Route Groups

```
app/
├── layout.tsx                     # Root layout (providers, fonts, metadata)
├── page.tsx                       # Landing page
├── (auth)/                        # Auth pages (no sidebar)
│   ├── login/page.tsx
│   └── register/page.tsx
└── (dashboard)/                   # Dashboard pages (with sidebar)
    ├── layout.tsx                 # DashboardShell wrapper
    └── dashboard/
        ├── page.tsx               # Metrics overview
        ├── chatbots/
        │   ├── page.tsx           # Chatbot list with CRUD
        │   └── [id]/
        │       ├── page.tsx       # Detail with 6 tabs
        │       └── analytics/
        │           └── page.tsx   # Per-chatbot analytics
        ├── conversations/page.tsx # Conversation list
        ├── leads/page.tsx         # Lead list with search
        ├── analytics/page.tsx     # 4-tab analytics
        ├── knowledge/page.tsx     # Knowledge base
        ├── workflows/page.tsx     # Workflow builder
        ├── agents/page.tsx        # Agent configurator
        ├── prompts/page.tsx       # Prompt studio
        ├── theme/page.tsx         # Theme editor
        ├── settings/page.tsx      # Account settings
        └── billing/page.tsx       # Subscription plans
```

## Route Conventions

- **Auth group** `(auth)` — No sidebar, centered forms
- **Dashboard group** `(dashboard)` — Sidebar navigation
- **Dynamic routes** `[id]` — Chatbot detail pages

## What Goes Here

- Page components (one per route)
- Layout components (shared by route groups)
- Loading and error states

## What Does NOT Go Here

- Reusable UI components (goes in `components/`)
- Data fetching hooks (goes in `hooks/`)
- State management (goes in `stores/`)

## Status

| Route | Backend Connected | Status |
|-------|-------------------|--------|
| Landing | No (static) | ✅ |
| Login | ✅ | ✅ |
| Register | ✅ | ✅ |
| Dashboard Home | ⚠️ Partial | Metrics loaded, some mock |
| Chatbots List | ✅ | ✅ |
| Chatbot Detail | ✅ | ✅ |
| Conversations | ❌ | Needs backend |
| Leads | ❌ | Needs backend |
| Analytics | ⚠️ Partial | Funnel data mocked |
| Knowledge | ❌ | Needs backend |
| Workflows | ❌ | UI only |
| Agents | ❌ | UI only |
| Prompts | ❌ | Needs backend |
| Theme | ❌ | UI only |
| Settings | ❌ | Needs backend |
| Billing | ❌ | UI only |
