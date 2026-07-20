# Drawer

Compound component: `Drawer` (root) wraps aria `DialogTrigger`, `Drawer.Trigger` wraps aria `Button`, `Drawer.Panel` wraps aria `ModalOverlay` + `Modal` + `Dialog`. A right/left edge-pinned, full-height side sheet used for self-contained panels opened from a trigger (e.g. Settings, Seasonal Filters).

## Import

```tsx
import { Drawer } from '@/components';
```

## Basic usage

```tsx
<Drawer>
    <Drawer.Trigger aria-label="Settings">
        <GearIcon />
    </Drawer.Trigger>
    <Drawer.Panel placement="right">{/* panel content */}</Drawer.Panel>
</Drawer>
```

## Reacting to dismiss

`Drawer.Panel` exposes `onOpenChange`, forwarded to the underlying `DialogTrigger`. Use it to react when the panel closes — including via Escape or backdrop click, not only an explicit close button:

```tsx
<Drawer.Panel onOpenChange={(isOpen) => !isOpen && resetDraft()}>{form}</Drawer.Panel>
```

This matters because RAC `Modal` **unmounts its children on close**, so any child holding uncommitted local (draft) state loses it on dismiss — `onOpenChange` is how a consumer learns that happened.
