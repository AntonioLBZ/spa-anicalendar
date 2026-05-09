import clsx from 'clsx';

import type { AnimeCardCoverProps } from './anime-card.types';

const AnimeCardCover = (props: AnimeCardCoverProps) => {
    const { children, className, ...rest } = props;
    const coverClsx = clsx('anime-card__cover', className);

    return (
        <div className={coverClsx} {...rest}>
            {children}
        </div>
    );
};

export { AnimeCardCover };
