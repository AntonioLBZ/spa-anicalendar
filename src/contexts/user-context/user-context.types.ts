import { UserData } from '@/services/api';

type UserContextValue = {
    user?: UserData;
    setUser?: (user: UserData) => void;
};

export type { UserContextValue };
