# Radio

Compound component: `Radio.Group` wraps aria `RadioGroup`, `Radio.Option` wraps aria `Radio`. Used for the settings panel (theme, content filter, week start, etc.) and the home page's API provider picker.

## Import

```tsx
import { Radio } from '@/components';
```

## Basic usage (controlled)

```tsx
const [value, setValue] = useState<'sfw' | 'plus16' | 'plus18'>('sfw');

<Radio.Group aria-label="Content" value={value} onChange={setValue}>
    <Radio.Option value="sfw">SFW</Radio.Option>
    <Radio.Option value="plus16">+16</Radio.Option>
    <Radio.Option value="plus18">+18</Radio.Option>
</Radio.Group>
```

`onChange` receives the plain string value already typed as `T` — no `(v) => setValue(v as MyType)` cast needed at call sites, unlike raw react-aria-components (see **Why the wrapper exists** below).

## Orientation

```tsx
<Radio.Group aria-label="Content" orientation="vertical" value={value} onChange={setValue}>
    ...
</Radio.Group>
```

Default: `orientation="horizontal"`.

## Props

**`Radio.Group`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `T extends string` | — | Generic over the option value type. |
| `onChange` | `(value: T) => void` | — | |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `aria-label` | `string` | — | **Required** for accessibility — there's no visible group label in this app's usage; always pass one. |
| ...rest | `RadioGroupProps` (minus `onChange`/`value`/`defaultValue`) | — | |

**`Radio.Option`**

| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | The option's value, matched against the group's `value`. |
| `className` | `string` | Merged with the base `radio-option` class. |
| ...rest | `RadioProps` | |

## Why the wrapper exists

Raw react-aria-components' `RadioGroup` types `value`/`onChange` as plain `string`, so consumers typically write `onChange={(v) => setProvider(v as Provider)}` at every call site. `RadioOptionGroup` narrows both to a generic `T extends string`, so the cast happens once (in the type declaration) instead of at every usage.
