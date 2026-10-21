# Drawer

Compound component: `DrawerTrigger` (re-exported aria `DialogTrigger`) wraps a trigger element plus `Drawer.Root`, `Drawer.Root` wraps aria `ModalOverlay` + `Modal` + `Dialog`, `Drawer.Header` and `Drawer.Body` are layout wrappers for the dialog content. An edge-pinned sheet used for self-contained panels opened from a trigger (e.g. Settings, Seasonal Filters): a full-height side sheet for `right`/`left`, or a full-width bottom sheet (rounded top, capped at 85% of the viewport height) for `bottom`.

## Import

```tsx
import { Drawer, DrawerTrigger } from '@/components';
```

## Basic usage

```tsx
<DrawerTrigger>
    <Button aria-label="Settings" size="s" variant="ghost">
        <GearIcon />
    </Button>
    <Drawer.Root placement="right">
        <Drawer.Header>
            <span>Settings</span>
            <Button slot="close" aria-label="Close" slot="close" size="s" variant="ghost">
                <DismissIcon />
            </Button>
        </Drawer.Header>
        <Drawer.Body>{/* panel content */}</Drawer.Body>
    </Drawer.Root>
</DrawerTrigger>
```

## Placement

```tsx
const layoutMode = useLayoutMode();

<Drawer.Root placement={layoutMode === 'mobile' ? 'bottom' : 'right'}>...</Drawer.Root>;
```

Default: `placement="right"`. Seasonal Filters and Settings switch to `bottom` on phones.

## Motion

The sheet slides in with `--ease-enter` over `--duration-slow` and leaves faster (`--duration-base`, `--ease-exit`); the overlay fades with it. Durations come from the motion tokens, so `prefers-reduced-motion` makes both instant.
