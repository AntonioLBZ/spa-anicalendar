import { getUserByName, IUserData } from './api';

const fetchUser = (name: string, handleData: (userData: IUserData) => void) => {
    getUserByName(name).then((userData) => {
        handleData(userData);
    });
};

export { fetchUser };
