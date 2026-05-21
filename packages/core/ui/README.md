# @lanceflow/ui

Shared LanceFlow design system (Tailwind + shadcn-style primitives).

## Exports

- `AppShell` — sidebar, header, role-aware navigation
- `StatusBadge` — green / yellow / red operational status
- `GlassCard`, `BrandHighlight` — glass surfaces and hero icon frames
- `Button`, `cn`, `getNavItemsForRole`
- `@lanceflow/ui/globals.css` — Tailwind layers + theme tokens
- `@lanceflow/ui/tailwind-preset` — shared `tailwind.config` preset

## Usage (apps/web)

```tsx
import '@lanceflow/ui/globals.css';
import { AppShell, StatusBadge } from '@lanceflow/ui';
```

Import UI only from this package — do not duplicate shadcn components in `apps/web`.
