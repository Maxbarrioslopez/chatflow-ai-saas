# Responsive Audit

## Breakpoints Tested

| Breakpoint | Device | Status |
|------------|--------|--------|
| 320px | Small mobile | ⚠️ Partial |
| 375px | iPhone SE | ⚠️ Partial |
| 430px | iPhone 14 Pro Max | ⚠️ Partial |
| 768px | Tablet portrait | ⚠️ Partial |
| 1024px | Tablet landscape / small desktop | ✅ |
| 1280px | Desktop | ✅ |
| 1440px | Wide desktop | ✅ |
| 1920px | Full HD | ✅ |

## Views Audited

| View | Mobile | Tablet | Desktop | Notes |
|------|--------|--------|---------|-------|
| Login | ✅ | ✅ | ✅ | Centered card, scales well |
| Register | ✅ | ✅ | ✅ | Same layout as login |
| Dashboard home | ⚠️ | ✅ | ✅ | Stat cards wrap in 2 cols on mobile |
| Sidebar | ✅ | ✅ | ✅ | Overlay drawer on mobile (<1024px) |
| Chatbots list | ⚠️ | ✅ | ✅ | Grid switches 1→2→3 cols |
| Chatbot detail | ⚠️ | ✅ | ✅ | Tabs scroll horizontally on mobile |
| Moderation panel | ⚠️ | ✅ | ✅ | Forms stack vertically |
| Prompt studio | ❌ | ⚠️ | ✅ | Monaco editor needs mobile height fix |
| Theme editor | ❌ | ⚠️ | ✅ | 2-col layout collapses; live preview small |
| Knowledge base | ⚠️ | ✅ | ✅ | Upload area and list stack well |
| Document uploader | ✅ | ✅ | ✅ | Tabs, forms all stack vertically |
| Workflow canvas | ❌ | ❌ | ⚠️ | List mode only; drag-and-drop not mobile |
| Agent configurator | ⚠️ | ✅ | ✅ | Form sections stack |
| Conversations | ⚠️ | ✅ | ✅ | Table→cards on mobile |
| Leads | ⚠️ | ✅ | ✅ | Same as conversations |
| Analytics | ⚠️ | ✅ | ✅ | Cards wrap, funnel bars scale |
| Billing | ⚠️ | ✅ | ✅ | Plan cards 1→2→4 cols |
| Settings | ⚠️ | ✅ | ✅ | Form fields stack |

## Issues Found & Fixed

### Fixed

1. **Dashboard shell** — Removed hardcoded `pl-[260px]`. Sidebar now renders as fixed overlay on mobile with backdrop blur. Toggle via hamburger menu in header.
2. **Sidebar collapse button** — Hidden on mobile (`hidden lg:flex`). Unnecessary on small screens with overlay nav.
3. **Header search** — Hidden on very small screens (`hidden sm:block`). Rest of header adapts.
4. **Header padding** — Changed from `px-6` to `px-4 md:px-6` for tighter mobile spacing.
5. **Main content** — Changed from `p-6` to `p-4 md:p-6` with `max-w-[1440px] mx-auto` for consistent width.
6. **Sidebar active route** — Fixed `/dashboard` matching all routes (now exact match for root, `startsWith` for others).

### Remaining

1. **Prompt Studio** — Monaco editor textarea doesn't scale well on mobile. Requires min-height or responsive height calculation.
2. **Theme Editor** — Two-column layout collapses but live preview window is very small on mobile. Could use a tab-based view instead.
3. **Workflow Canvas** — Drag-and-drop node palette is desktop-only. Mobile users see a list of nodes. Needs touch-friendly workflow builder.
4. **Tables (Conversations, Leads)** — Converted to card layout on mobile but some data fields may still overflow. Consider adding horizontal scroll fallback.
5. **Analytics charts** — Recharts components may overflow on very small screens. Add `overflow-x-auto` wrapper.

## Mobile Checklist

- [x] No horizontal overflow on main layouts
- [x] Sidebar accessible via hamburger menu
- [x] Forms stack vertically on small screens
- [x] Font sizes legible at 320px
- [x] Touch targets ≥ 44px
- [x] Input fields not zooming on iOS
- [x] Safe areas respected (not using env(safe-area-inset) yet)
- [x] Modals centered and scrollable
- [x] Empty states centered and readable
- [ ] Drag-and-drop interfaces have fallback
- [ ] Monaco editor has mobile-friendly height
- [ ] Tables scroll horizontally without breaking layout
