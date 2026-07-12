import { clsx } from 'clsx';

import type { ErrorTextProps } from './error-text.types';

import './error-text.css';

const ErrorText = (props: ErrorTextProps) => {
    const { className, ...rest } = props;

    const errorTextClsx = clsx('error-text', className);

    return <p {...rest} role="alert" className={errorTextClsx} />;
};

export { ErrorText };
