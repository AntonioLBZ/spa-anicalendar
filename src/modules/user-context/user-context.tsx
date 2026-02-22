'use client';

import { useState, useMemo, type ReactNode } from 'react';

import { createContext } from '@/platform/lib/context';
import { UserData } from '@/platform/services/api';

import type { UserContextValue } from './user-context.types';

const [UserContext, useUserContext] = createContext<UserContextValue>();

const UserContextProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    const [user, setUser] = useState<UserData>();

    const value = useMemo<UserContextValue>(
        () => ({ user, setUser }),
        [user]
    );

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export { UserContextProvider, useUserContext };
