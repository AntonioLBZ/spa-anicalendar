# Divider

A visual separator between two sections of content. Wraps react-aria-components' `Separator`, so it renders with `role="separator"` and the correct `aria-orientation` out of the box.

## Import

```tsx
import { Divider } from '@/components';
```

## Basic usage

```tsx
<div className="weekly-calendar__section">Section A</div>
<Divider />
<div className="weekly-calendar__section">Section B</div>
```

## Vertical orientation

`Divider` accepts all `SeparatorProps` from react-aria-components, including `orientation`:

```tsx
<Divider orientation="vertical" />
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Passed straight to aria `Separator`. |
| `className` | `string` | — | Merged with the base `divider` class via `clsx`; never replaces it. |
| ...rest | `SeparatorProps` | — | Anything else is forwarded to the underlying `<hr>`-equivalent element. |

## When to use

Use `Divider` between distinct sections in a layout (e.g. between the weekly calendar and the "no upcoming episodes" list). Don't use it for spacing alone — that's a CSS `gap`/margin concern, not a semantic separator.
