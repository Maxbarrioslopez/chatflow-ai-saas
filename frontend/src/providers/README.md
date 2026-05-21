# Frontend Providers

React context providers that wrap the application root.

## Providers

| Provider | File | Purpose |
|----------|------|---------|
| ThemeProvider | `theme-provider.tsx` | Dark/light/system mode via `next-themes` |
| QueryProvider | `providers/index.tsx` | TanStack Query client with defaults |
| ToastProvider | `providers/index.tsx` | Sonner toast notifications |
| Providers | `providers/index.tsx` | Composition root — wraps all providers |

## Provider Order

```typescript
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  <QueryProvider>
    {children}
    <ToastProvider />
  </QueryProvider>
</ThemeProvider>
```

## Query Defaults

- `staleTime`: 30 seconds
- `retry`: 2 attempts
- `refetchOnWindowFocus`: false

## What Goes Here

- Context providers
- Third-party provider wrappers
- Provider composition

## What Does NOT Go Here

- Components
- State stores
- API client configuration
