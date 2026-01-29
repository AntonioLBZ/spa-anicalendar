import React from 'react';
import { cn } from '@/helpers';
import { TButtonProps } from './button.types';
import { mergeProps } from 'react-aria';
import { createContext } from '@/shared';

import './button.css';

const [ButtonContext, useButtonContext] = createContext<TButtonProps>({});

const Button = (props: TButtonProps) => {
    props = mergeProps(props, useButtonContext());
    const { children, className, variant = 'primary', ...rest } = props;
    const bottonClsx = cn('alc-button', `alc-button--${variant}`, className);

    return (
        <button className={bottonClsx} {...rest}>
            {children}
        </button>
    );
};

Button.displayName = 'Button';
export { Button, ButtonContext };
