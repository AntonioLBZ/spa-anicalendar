# Drawer

Compound component: `DrawerTrigger` (re-exported aria `DialogTrigger`) wraps a trigger element plus `Drawer.Root`, `Drawer.Root` wraps aria `ModalOverlay` + `Modal` + `Dialog`, `Drawer.Header` and `Drawer.Body` are layout wrappers for the dialog content. A right/left edge-pinned, full-height side sheet used for self-contained panels opened from a trigger (e.g. Settings, Seasonal Filters).

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
