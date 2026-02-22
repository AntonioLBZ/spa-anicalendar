import clsx from 'clsx';

import type { AnimeCardStatusProps } from './anime-card.types';

const AnimeCardStatus = (props: AnimeCardStatusProps) => {
    const { children, className, variant, ...rest } = props;
    const statusClsx = clsx(
        'anime-card__status',
        variant && `anime-card__status--${variant}`,
        className
    );

    return (
        <span className={statusClsx} {...rest}>
            {children}
        </span>
    );
};

export { AnimeCardStatus };
