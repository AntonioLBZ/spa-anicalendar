'use client';

import clsx from 'clsx';
import { Link } from 'react-aria-components';

import type { AnimeCardRootProps } from './anime-card.types';

import './anime-card.css';

const AnimeCardRoot = (props: AnimeCardRootProps) => {
    const { children, className, ...rest } = props;
    const animeCardClsx = clsx('anime-card', className);

    return (
        <Link className={animeCardClsx} {...rest}>
            {children}
        </Link>
    );
};

export { AnimeCardRoot };
