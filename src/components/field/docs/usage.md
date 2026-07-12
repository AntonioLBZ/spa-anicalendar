# Field

Compound text field wrapping react-aria-components' `TextField`, `FieldError`, and `Text[slot=description]`. Used for the AniList username input on the home page.

## Import

```tsx
import { Field } from '@/components';
```

## Basic usage (floating label)

```tsx
<Field.Root value={userName} onChange={setUserName}>
    <Field.Control>
        <Field.Input />
        <Field.Label>AniList username</Field.Label>
    </Field.Control>
</Field.Root>
```

`Field.Control` is **required** whenever `Field.Input` + `Field.Label` are used together — it's the box the floating label centers on. See **Composition rules** below.

## With a validation error

```tsx
<Field.Root value={userName} onChange={setUserName} isInvalid={!!errorMessage}>
    <Field.Control>
        <Field.Input />
        <Field.Label>AniList username</Field.Label>
    </Field.Control>
    <Field.Error>{errorMessage}</Field.Error>
</Field.Root>
```

`Field.Error` only renders while `isInvalid` is `true` on `Field.Root` — passing a message alone does nothing without `isInvalid`. When it renders, react-aria wires `aria-invalid` and `aria-describedby` on the input automatically; no manual ARIA attributes needed.

## With a helper/description

```tsx
<Field.Root value={userName} onChange={setUserName}>
    <Field.Control>
        <Field.Input />
        <Field.Label>AniList username</Field.Label>
    </Field.Control>
    <Field.Helper>Your public AniList username.</Field.Helper>
</Field.Root>
```

`Field.Helper` is always visible (no `isInvalid` gate) and is wired via `aria-describedby` the same way `Field.Error` is. `Field.Error` and `Field.Helper` can both be present — react-aria concatenates their IDs into a single `aria-describedby`.

## Composition rules

`Field.Root`'s only children should be:

1. **One `Field.Control`**, itself containing `Field.Input` + `Field.Label` (in that order — CSS relies on the adjacent-sibling selector `.field__input + .field__label`).
2. Any number of `Field.Error` / `Field.Helper`, **as siblings of `Field.Control`, never inside it**.

```
Field.Root
├── Field.Control
│   ├── Field.Input
│   └── Field.Label
├── Field.Error      (optional, isInvalid-gated)
└── Field.Helper     (optional, always visible)
```

Putting `Field.Error`/`Field.Helper` **inside** `Field.Control` breaks the floating label: the label centers on `Field.Control`'s height, and if the error/helper live there too, the box grows and the label drifts off-center. This is why the split exists — `Field.Control` stays sized to the input alone (the label is `position: absolute`, so it doesn't add height); the error/helper flow normally below it.

## Props

**`Field.Root`** — all `TextFieldProps` from react-aria-components: `value`/`defaultValue`, `onChange`, `isInvalid`, `isDisabled`, `isRequired`, `type`, etc.

**`Field.Control`** — plain `div` wrapper, `className` + standard div attributes.

**`Field.Input`** — all `InputProps`. Renders with `placeholder=" "` fixed (required for the `:not(:placeholder-shown)` CSS trick that floats the label on non-empty values — don't override `placeholder`).

**`Field.Label`** — all `LabelProps`.

**`Field.Error`** — all `FieldErrorProps`. Renders only while `Field.Root`'s `isInvalid` is `true`.

**`Field.Helper`** — all `TextProps` except `slot` (fixed internally to `"description"`).
