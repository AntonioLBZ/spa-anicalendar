# Button

Wraps react-aria-components' `Button`. Use `onPress`, not `onClick` — react-aria normalizes press interactions (mouse, touch, keyboard, screen reader) into a single `onPress` handler.

## Import

```tsx
import { Button } from '@/components';
```

## Basic usage

```tsx
<Button onPress={() => console.log('pressed')}>Go</Button>
```

## Variants

```tsx
<Button variant="primary">Go</Button>
<Button variant="ghost">Cancel</Button>
```

Default: `variant="primary"`.

## Sizes

```tsx
<Button size="m">Go</Button>   {/* default — height: var(--size-300), matches Field.Input */}
<Button size="s">Go</Button>   {/* height: var(--size-250) */}
```

Default: `size="m"`. Use `m` whenever the button sits next to a `Field` (e.g. a "Go" button beside a text input) so the two align without extra CSS.

## Disabled state

```tsx
<Button isDisabled onPress={handlePress}>Go</Button>
```

`onPress` never fires while `isDisabled` is set.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'ghost'` | `'primary'` | |
| `size` | `'s' \| 'm'` | `'m'` | Controls a fixed `height`, not padding — see `field.css`'s `.field__input` for why `m` matches it. |
| `className` | `string` | — | Merged with the base classes via `clsx`. |
| ...rest | `AriaButtonProps` | — | `onPress`, `isDisabled`, `isPending`, `autoFocus`, etc. — anything react-aria's `Button` supports. |

## Overriding size/variant classes at a call site

Some usages (e.g. the Settings gear trigger) apply `all: unset` in their own CSS to fully replace the base button look. If you do this, remember `size`/`variant` classes are still applied to the DOM node — they just won't visually matter once `all: unset` wins the cascade.
