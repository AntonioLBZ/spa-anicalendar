# Checkbox

Compound component: `Checkbox.Group` wraps aria `CheckboxGroup`, `Checkbox.Option` wraps aria `Checkbox`. Used for multi-select filters (e.g. the seasonal media-format filter) and standalone boolean toggles.

## Import

```tsx
import { Checkbox } from '@/components';
```

## Basic usage (controlled, multi-select)

```tsx
const [formats, setFormats] = useState<MediaFormat[]>(['TV']);

<Checkbox.Group aria-label="Format" value={formats} onChange={setFormats}>
    <Checkbox.Option value="TV">TV</Checkbox.Option>
    <Checkbox.Option value="MOVIE">Movie</Checkbox.Option>
</Checkbox.Group>
```

`onChange` receives the plain array already typed as `T[]` — no `(v) => setFormats(v as MediaFormat[])` cast needed at call sites, same rationale as `Radio` (see its docs).

## Standalone boolean checkbox

`Checkbox.Option` also works outside a group as a single controlled boolean:

```tsx
<Checkbox.Option isSelected={onlyNewSeason} onChange={setOnlyNewSeason}>
    New this season only
</Checkbox.Option>
```

## Props

**`Checkbox.Group`**

| Prop | Type | Notes |
|---|---|---|
| `value` / `defaultValue` | `T[]` (`T extends string`) | Generic over the option value type. |
| `onChange` | `(value: T[]) => void` | |
| `aria-label` | `string` | **Required** for accessibility — there's no visible group label in this app's usage; always pass one. |
| ...rest | `CheckboxGroupProps` (minus `onChange`/`value`/`defaultValue`) | |

**`Checkbox.Option`**

| Prop | Type | Notes |
|---|---|---|
| `value` | `string` | Only needed inside a `Checkbox.Group`; omit for a standalone boolean checkbox. |
| `isSelected` / `onChange` | `boolean` / `(isSelected: boolean) => void` | Used for the standalone (non-group) case. |
| `className` | `string` | Merged with the base `checkbox` class. |
| ...rest | `CheckboxProps` | |

## Why the wrapper exists

Same rationale as `Radio`: raw react-aria-components' `CheckboxGroup` types `value`/`onChange` as plain `string[]`, so consumers would otherwise cast at every call site. `Checkbox.Group` narrows both to a generic `T extends string`.
