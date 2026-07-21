import type { ElementType } from 'react';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';

type LinkProps = Omit<AriaLinkProps, 'href'> & {
    /**
     * The underlying element/component to render as. Defaults to react-aria-components' `Link`
     * (a plain `<a>`). Pass a routing `Link` (e.g. next-intl's) for locale-aware internal
     * navigation while keeping the same variant/size styling.
     */
    as?: ElementType;
    /**
     * Loosened beyond react-aria-components' `string` so `as`-swapped routers (e.g. next-intl's
     * `Link`, which accepts `{ pathname, query }`) can be typed correctly at call sites.
     */
    href?: AriaLinkProps['href'] | Record<string, unknown>;
    /** Forwarded to `as` when it's a locale-aware router `Link` (e.g. next-intl's). */
    locale?: string;
    /**
     * Renders a plain, non-interactive `<span>` instead of `Component`
     */
    isDisabled?: boolean;
    /**
     * `'plain'` renders an anchor-styled link, while the other variants match `Button`'s styling.
     * @default 'plain'
     */
    variant?: 'plain' | 'primary' | 'secondary' | 'ghost';
    /**
     * Only meaningful when `variant` isn't `'plain'` — matches `Button`'s size scale.
     * @default 'm'
     */
    size?: 's' | 'm';
    ref?: React.Ref<HTMLAnchorElement>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

export type { LinkProps };
