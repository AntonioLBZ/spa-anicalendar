import type { TCardProps } from './card.types';
import { CardTitle } from './card-title';
import { useHover } from 'react-aria';
import clsx from 'clsx';

import './card.css';

const CardRoot = (props: TCardProps) => {
    const { children, backgroundURL, style, ...rest } = props;

    const mergedStyle = { backgroundImage: `url(${backgroundURL})`, ...style };
    const { hoverProps, isHovered } = useHover(props);

    const cardRootClsx = clsx('alc-card', {
        'alc-card--hovered': isHovered,
    });

    return (
        <a
            {...rest}
            {...hoverProps}
            className={cardRootClsx}
            style={mergedStyle}
        >
            {children}
        </a>
    );
};

export { CardRoot };
