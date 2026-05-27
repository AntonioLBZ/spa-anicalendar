import type { User } from '@/services';

type UserContextValue = {
    user?: User;
    setUser?: (user: User) => void;
};

export type { UserContextValue };
