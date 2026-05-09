import clsx from 'clsx';

import type { AnimeCardInfoProps } from './anime-card.types';

const AnimeCardInfo = (props: AnimeCardInfoProps) => {
    const { children, className, ...rest } = props;
    const infoClsx = clsx('anime-card__info', className);

    return (
        <div className={infoClsx} {...rest}>
            {children}
        </div>
    );
};

export { AnimeCardInfo };
