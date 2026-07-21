import clsx from 'clsx';
import { Link as AriaLink } from 'react-aria-components';

import type { LinkProps } from './link.types';

import '../button/button.css';
import './link.css';

const Link = (props: LinkProps) => {
    const { as, variant = 'plain', size = 'm', className, isDisabled, href, locale, style, children, ...rest } = props;

    const Component = as ?? AriaLink;

    const linkClsx = clsx('link', `link--size-${size}`, `label-${size}`, className);

    const buttonClsx = clsx(
        'button',
        'button-link',
        `button--${variant}`,
        `button--size-${size}`,
        `label-${size}`,
        className
    );

    const variantClsx = variant === 'plain' ? linkClsx : buttonClsx;

    if (isDisabled) {
        return (
            <span className={variantClsx} style={style} aria-disabled="true">
                {children}
            </span>
        );
    }

    return (
        <Component className={variantClsx} href={href} locale={locale} style={style} {...rest}>
            {children}
        </Component>
    );
};

export { Link };
