import clsx from 'clsx';
import { CardContentProps } from './card-content.types';
import { StopPropagation } from '../stop-propagation';

const CardContent = (props: CardContentProps) => {
    const { children, className, ...rest } = props;
    const cardContentClsx = clsx('card__content', className);
    return (
        <StopPropagation className={cardContentClsx} {...rest}>
            {children}
        </StopPropagation>
    );
};

export { CardContent };
