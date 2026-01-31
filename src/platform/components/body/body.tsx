import type { BodyProps } from './body.types';

import './body.css';

const Body = (props: BodyProps) => {
    const { children, ...rest } = props;
    return (
        <div className="alc-body" {...rest}>
            Body Component
            {children}
        </div>
    );
};

export { Body };
