import clsx from 'clsx';
import { Button as AriaButton } from 'react-aria-components';

import type { ButtonProps } from './button.types';

import './button.css';

const Button = (props: ButtonProps) => {
    const { className, variant = 'primary', size = 'm', ...rest } = props;

    const buttonClsx = clsx('button', `button--${variant}`, `button--size-${size}`, `label-${size}`, className);

    return <AriaButton {...rest} className={buttonClsx} />;
};

export { Button };
