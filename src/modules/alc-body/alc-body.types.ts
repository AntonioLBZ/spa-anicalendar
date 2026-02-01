import { IUserData } from '@/services/api';

type TAlcBodyProps = React.ComponentPropsWithRef<'body'>;

type TUserContext = {
    user?: IUserData;
    setUser?: (user: IUserData) => void;
};

export type { TAlcBodyProps, TUserContext };
