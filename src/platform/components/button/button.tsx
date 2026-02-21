import { ButtonProps } from './button.types';
import { mergeProps } from 'react-aria';
import { createContext } from '@/platform/lib/context';
import clsx from 'clsx';
import './button.css';

const [ButtonContext, useButtonContext] = createContext<ButtonProps>({});

const Button = (props: ButtonProps) => {
    props = mergeProps(props, useButtonContext());
    const { children, className, variant = 'primary', ...rest } = props;
    const buttonClsx = clsx('button', `button--${variant}`, className);

    return (
        <button className={buttonClsx} {...rest}>
            {children}
        </button>
    );
};

Button.displayName = 'Button';
export { Button, ButtonContext };
