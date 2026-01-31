import type { CardTitleProps } from './card-title.types';
import { clsx } from 'clsx';

const CardTitle = (props: CardTitleProps) => {
    const { children, className } = props;
    const cardTitleClsx = clsx('alc-card__title', className);
    return <div className={cardTitleClsx}>{children}</div>;
};

export { CardTitle };
