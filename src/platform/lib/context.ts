import React from 'react';

/**
 *
 * @param defaultValue
 * @returns The context and a hook to use the context
 */
const createContext = <T extends Object>(
    defaultValue?: T
): [React.Context<T>, () => T] => {
    const context = React.createContext<T>(defaultValue ?? ({} as T));
    const useContext = () => {
        const ctx = React.useContext(context);
        if (ctx === undefined) {
            throw new Error(
                'useContext must be used within a Provider with a value'
            );
        }
        return ctx;
    };
    return [context, useContext];
};

/**
 * @param context
 * @returns The context value
 */
const useContext = <T>(context: React.Context<T>) => {
    const ctx = React.useContext(context);
    if (ctx === undefined) {
        throw new Error(
            'useContext must be used within a Provider with a value'
        );
    }
    return ctx;
};

export { createContext, useContext };
