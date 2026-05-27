import clsx from 'clsx';
import { Button as AriaButton } from 'react-aria-components';

import type { ButtonProps } from './button.types';

import './button.css';

const Button = (props: ButtonProps) => {
    const { className, variant = 'primary', ...rest } = props;

    const buttonClsx = clsx('button', `button--${variant}`, className);

    return <AriaButton {...rest} className={buttonClsx} />;
};

export { Button };
