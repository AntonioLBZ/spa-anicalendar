import clsx from 'clsx';

import type { AnimeCardProgressProps } from './anime-card.types';

const AnimeCardProgress = (props: AnimeCardProgressProps) => {
    const { children, className, ...rest } = props;
    const progressClsx = clsx('anime-card__progress', 'body-2', className);

    return (
        <span className={progressClsx} {...rest}>
            {children}
        </span>
    );
};

export { AnimeCardProgress };
