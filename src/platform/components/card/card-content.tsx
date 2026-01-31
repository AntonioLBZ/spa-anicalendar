import clsx from 'clsx';
import { TCardContentProps } from './card-content.types';
import { StopPropagation } from '../stop-propagation';

const CardContent = (props: TCardContentProps) => {
    const { children, className, ...rest } = props;
    const cardContentClsx = clsx('alc-card__content', className);
    return (
        <StopPropagation className={cardContentClsx} {...rest}>
            {children}
        </StopPropagation>
    );
};

export { CardContent };
