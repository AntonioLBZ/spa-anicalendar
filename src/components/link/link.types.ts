import type { ElementType } from 'react';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';

type LinkProps = AriaLinkProps & {
    /**
     * The underlying element/component to render as. Defaults to react-aria-components' `Link`
     * (a plain `<a>`). Pass a routing `Link` (e.g. next-intl's) for locale-aware internal
     * navigation while keeping the same variant/size styling.
     */
    as?: ElementType;
    /**
     * `'plain'` renders no extra styling — just interaction states, for links styled entirely via
     * `className` (e.g. a text link). The other variants reuse `Button`'s look-and-feel classes.
     * @default 'plain'
     */
    variant?: 'plain' | 'primary' | 'secondary' | 'ghost';
    /**
     * Only meaningful when `variant` isn't `'plain'` — matches `Button`'s size scale.
     * @default 'm'
     */
    size?: 's' | 'm';
    ref?: React.Ref<HTMLAnchorElement>;
};

export type { LinkProps };
