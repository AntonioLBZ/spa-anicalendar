'use client';

import React from 'react';

const createContext = <T extends Object>(): [React.Context<T | null>, () => T] => {
    const context = React.createContext<T | null>(null);
    const useContext = () => {
        const ctx = React.useContext(context);
        if (ctx === null) {
            throw new Error('useContext must be used within a Provider with a value.');
        }
        return ctx;
    };
    return [context, useContext];
};

export { createContext };
