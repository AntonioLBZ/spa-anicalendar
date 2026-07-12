# Pill

A small badge/label. Plain `<div>` wrapper — not aria-wired to anything, since it's decorative/informational, not interactive.

## Import

```tsx
import { Pill } from '@/components';
```

## Basic usage

```tsx
<Pill>Today</Pill>
<Pill className="card__next-airing">Next</Pill>
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Merged with the base `pill` class via `clsx`; never replaces it. |
| ...rest | `React.HTMLAttributes<HTMLDivElement>` | — | Any standard div attribute (e.g. `title`, `aria-label`) is forwarded. |

## When to use

Use `Pill` for short, glanceable status labels (e.g. "Today" badge on the calendar, "Next" airing indicator on a card). If the content needs to be interactive (clickable, focusable), don't use `Pill` — reach for `Button` instead.
