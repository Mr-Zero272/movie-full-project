import { authRequest } from '@/utils/request';

export const getUserInfo = async (token) => {
    try {
        const res = await authRequest.get('/user', {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log('Get user information error!');
    }
};

export const login = async (username, password) => {
    //console.log(username, password);
    try {
        const res = await authRequest.post(
            '/authenticate',
            {
                username,
                password,
            },
            {},
        );
        return res;
    } catch (error) {
        return error;
    }
};
