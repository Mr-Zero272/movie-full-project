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

export const search = async (q = '', size = 6, cPage = 1, token) => {
    try {
        const res = await authRequest.get('/user/search', {
            headers: { Authorization: 'Bearer ' + token },
            params: { q, size, cPage },
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

export const mailRequestBusiness = async (email) => {
    try {
        const res = await authRequest.get('/register-business', {
            params: { email },
        });
        return res;
    } catch (error) {
        console.log('Get mail business request error!');
        console.log(error);
    }
};

export const registerBusinessAccount = async (code, email) => {
    try {
        const res = await authRequest.post('/register-business', { code, email }, {});
        return res;
    } catch (error) {
        console.log('Register business account error!');
        console.log(error);
    }
};

export const mailRequestChangePass = async (email) => {
    try {
        const res = await authRequest.get('/change-pass', {
            params: { email },
        });
        return res;
    } catch (error) {
        console.log('Get otp change pass request error!');
        console.log(error);
    }
};

export const validChangePassCode = async (code, email) => {
    try {
        const res = await authRequest.post('/valid-otp', { code, email }, {});
        return res;
    } catch (error) {
        console.log('Valid code change pass error!');
        console.log(error);
    }
};

export const changePass = async (newPassword, email) => {
    try {
        const res = await authRequest.post('/change-pass', { newPassword, email }, {});
        return res;
    } catch (error) {
        console.log('Change passwords error!');
        console.log(error);
    }
};
