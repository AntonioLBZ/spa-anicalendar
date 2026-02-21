'use client';

import React from 'react';

const createContext = <T extends Object>(defaultValue?: T): [React.Context<T>, () => T] => {
    const context = React.createContext<T>(defaultValue ?? ({} as T));
    const useContext = () => {
        const ctx = React.useContext(context);
        if (ctx === undefined) {
            throw new Error('useContext must be used within a Provider with a value');
        }
        return ctx;
    };
    return [context, useContext];
};

export { createContext };
