'use client';

import clsx from 'clsx';

import { UserContextProvider } from '@/modules/user-context';
import { Theme } from '@/platform/components';

import type { AppBodyProps } from './app-body.types';

import './app-body.css';
import '@/assets/themes.css';
import '@/assets/fonts/fonts.css';

const AppBody = (props: AppBodyProps) => {
    const { children, className, ...rest } = props;
    const appBodyClsx = clsx('app-body', className);
    return (
        <div className={appBodyClsx} {...rest}>
            <div className="app-body__content">
                <UserContextProvider>
                    <Theme>{children}</Theme>
                </UserContextProvider>
            </div>
        </div>
    );
};

export { AppBody };
