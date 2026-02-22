import clsx from 'clsx';
import Image from 'next/image';

import type { AnimeCardImageProps } from './anime-card.types';

const AnimeCardImage = (props: AnimeCardImageProps) => {
    const { src, alt, className, ...rest } = props;
    const imageClsx = clsx('anime-card__image', className);

    return (
        <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            className={imageClsx}
            loading="lazy"
            {...rest}
        />
    );
};

export { AnimeCardImage };
