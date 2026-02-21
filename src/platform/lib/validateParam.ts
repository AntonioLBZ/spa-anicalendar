import { ParamValue } from 'next/dist/server/request/params';

const validateParam = (param: ParamValue) => {
    if (typeof param !== 'string' || param.trim() === '') {
        return null;
    }
    return param;
};

export { validateParam };
