import type { CardProps } from './card.types';
import { CardTitle } from './card-title/card-title';

import './card.css';

const Card = (props: CardProps) => {
    const { children, ...rest } = props;
    const cardClsx = 'alc-card';
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
