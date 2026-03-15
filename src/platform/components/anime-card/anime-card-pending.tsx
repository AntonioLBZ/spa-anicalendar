import clsx from 'clsx';

import type { AnimeCardPendingProps } from './anime-card.types';

const AnimeCardPending = (props: AnimeCardPendingProps) => {
    const { children, className, ...rest } = props;
    const pendingClsx = clsx('anime-card__pending', 'body-2', className);

    return (
        <span className={pendingClsx} {...rest}>
            {children}
        </span>
    );
};

export { AnimeCardPending };
