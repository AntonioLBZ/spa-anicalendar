import React from 'react';
import type { TAlcBodyProps, TUserContext } from './alc-body.types';
import { Theme } from '@/components';
import { createContext } from '@/lib/context';
import { IUserData } from '@/services/api';

import './alc-body.css';
import '@/assets/themes.css';
import '@/assets/fonts/fonts.css';

// TODO: Define user type
// TODO: Move to user module
const [UserContext, useUserContext] = createContext<TUserContext>({});

const AlcBody = (props: TAlcBodyProps) => {
    const { children, ...rest } = props;
    const [user, setUser] = React.useState<IUserData>();
    return (
        <body className="alc-body" {...rest}>
            <UserContext.Provider value={{ user, setUser }}>
                <Theme>{children}</Theme>
            </UserContext.Provider>
        </body>
    );
};

export { AlcBody, useUserContext };
