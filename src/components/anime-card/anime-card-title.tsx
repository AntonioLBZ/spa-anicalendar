import clsx from 'clsx';

import type { AnimeCardTitleProps } from './anime-card.types';

const AnimeCardTitle = (props: AnimeCardTitleProps) => {
    const { children, className, ...rest } = props;
    const titleClsx = clsx('anime-card__title', 'label-m', className);

    return (
        <span className={titleClsx} {...rest}>
            {children}
        </span>
    );
};

export { AnimeCardTitle };
