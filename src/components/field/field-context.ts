import { createContext, useContext } from 'react';

type FieldStateContextValue = {
    value: string;
    clear: () => void;
};

const FieldStateContext = createContext<FieldStateContextValue | null>(null);

const useFieldState = () => useContext(FieldStateContext);

export { FieldStateContext, useFieldState };
