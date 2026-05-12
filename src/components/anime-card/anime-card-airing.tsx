import clsx from 'clsx';

import type { AnimeCardAiringProps } from './anime-card.types';

const AnimeCardAiring = (props: AnimeCardAiringProps) => {
    const { children, className, ...rest } = props;
    const airingClsx = clsx('anime-card__airing', 'body-m', className);

    return (
        <span className={airingClsx} {...rest}>
            {children}
        </span>
    );
};

export { AnimeCardAiring };
