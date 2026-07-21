import type { User } from '@/services';

type UserContextValue = {
    user?: User;
    setUser?: (user: User | undefined) => void;
};

export type { UserContextValue };
