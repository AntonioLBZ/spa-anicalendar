import { getUserByName } from './api';

const fetchUser = (name: string) => {
    return getUserByName(name);
};

export { fetchUser };
