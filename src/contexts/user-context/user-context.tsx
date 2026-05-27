'use client';

import { useState, useMemo, type ReactNode } from 'react';

import { createContext } from '@/lib/context';

import type { UserContextValue } from './user-context.types';
import type { User } from '@/services';


const [UserContext, useUserContext] = createContext<UserContextValue>();

const UserContextProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    const [user, setUser] = useState<User>();

    const value = useMemo<UserContextValue>(
        () => ({ user, setUser }),
        [user]
    );

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export { UserContextProvider, useUserContext };
