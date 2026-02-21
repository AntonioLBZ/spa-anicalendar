import type { CardProps } from './card.types';
import { CardTitle } from './card-title';
import { useHover } from 'react-aria';
import clsx from 'clsx';

import './card.css';

const CardRoot = (props: CardProps) => {
    const { children, backgroundURL, style, ...rest } = props;

    const mergedStyle = { backgroundImage: `url(${backgroundURL})`, ...style };
    const { hoverProps, isHovered } = useHover(props);

    const cardRootClsx = clsx('card', {
        'card--hovered': isHovered,
    });

    return (
        <a {...rest} {...hoverProps} className={cardRootClsx} style={mergedStyle}>
            {children}
        </a>
    );
};

export { CardRoot };
