import { cn } from '@/helpers';
import type { CardTitleProps } from './card-title.types';
import './card-title.css';

const CardTitle = (props: CardTitleProps) => {
    const { children, className } = props;
    const cardTitleClsx = cn('alc-card__title', className);
    return (
        <div className={cardTitleClsx}>
            {children}titulo kjdh ajkh sjdkf hsjkdhf jk
        </div>
    );
};

export { CardTitle };
