# Frontend Components

All React components organized by domain and reuse level.

## Structure

```
components/
├── ui/                    # shadcn/ui primitives (18 files)
│   ├── button.tsx, card.tsx, input.tsx, etc.
│   └── index.ts           # Re-exports
├── shared/                # Reusable app-level components
│   ├── stat-card.tsx      # Metric card with gradient icon + trend
│   ├── empty-state.tsx    # Empty state with icon + CTA
│   ├── page-header.tsx    # Page title + actions
│   ├── loading-screen.tsx # Full-page loading spinner
│   └── mode-toggle.tsx    # Dark/light/system toggle
├── dashboard/             # App shell
│   ├── dashboard-shell.tsx # Layout wrapper (sidebar + header + main)
│   ├── sidebar.tsx        # Collapsible nav with 6 groups
│   └── header.tsx         # Search, notifications, theme, user menu
├── chatbot-widget/        # Widget components
│   ├── premium-widget.tsx # 4 modes (floating/inline/fullscreen/standalone)
│   └── chatbot-widget.tsx # Simple widget variant
├── prompt-studio/         # Prompt editor
│   └── prompt-editor.tsx  # Live editing, variables, preview, version history
├── knowledge-base/        # Document management
│   └── document-uploader.tsx # Drag-drop, URL, text, FAQ inputs
├── workflow-builder/      # Automation workflow
│   └── workflow-canvas.tsx # Palette + node list (UI only)
├── theme-editor/          # Appearance customization
│   └── theme-editor.tsx   # 4 tabs + live PremiumWidget preview
├── agents/                # AI agent configurator
│   └── agent-configurator.tsx # Tools, memory, reasoning (UI only)
├── config-editor/         # Chatbot configuration editors
│   ├── ai-config-editor.tsx
│   ├── appearance-editor.tsx
│   └── behavior-editor.tsx
├── chatbot-preview/       # Chatbot creation
│   ├── create-chatbot-modal.tsx
│   └── chatbot-preview.tsx
└── business-presets/      # Industry presets
    └── preset-selector.tsx
```

## Component Naming

- `PascalCase.tsx` for component files
- Component name matches file name
- Default export for page components
- Named export for reusable components

## Conventions

- Use `cn()` from `@/lib/utils` for className merging
- Use shadcn/ui primitives from `@/components/ui`
- Import icons from `lucide-react`
- Use Framer Motion for animations (not CSS transitions for enter/exit)
- Use shared components (PageHeader, StatCard, EmptyState) for consistency

## Component Connection Status

| Component | Backend Connected | Notes |
|-----------|------------------|-------|
| ui/* | N/A | Pure UI primitives |
| shared/* | N/A | Pure UI components |
| dashboard/* | N/A | Layout only |
| PremiumWidget | ❌ | setTimeout mock for AI |
| PromptEditor | ❌ | Save, test not connected |
| DocumentUploader | ❌ | Process buttons no-op |
| WorkflowCanvas | ❌ | UI only |
| ThemeEditor | ❌ | Save not connected |
| AgentConfigurator | ❌ | UI only |
| CreateChatbotModal | ✅ | Calls API |
| ConfigEditors | ⚠️ | Read/write from API |

## What Goes Here

- Reusable UI components
- Feature-specific components
- Layout components
- Widget components

## What Does NOT Go Here

- Page-level components (goes in `app/`)
- Data fetching or state logic (goes in `hooks/` or `stores/`)
