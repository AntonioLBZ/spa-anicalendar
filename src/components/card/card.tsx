import type { CardProps } from './card.types';
import './card.css';
import { CardTitle } from './card-title/card-title';

const Card = (props: CardProps) => {
    const { children, ...rest } = props;
    const cardClsx = 'ac-card';
    return (
        <div {...rest} className={cardClsx}>
            <CardTitle />
            <div>Image</div>
            <div>Description</div>
            {children}
        </div>
    );
};

export { Card };
