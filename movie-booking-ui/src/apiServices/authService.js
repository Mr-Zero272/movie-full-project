import * as request from '~/utils/request';

export const register = async (username, password, email, avatar = '', phoneNumber = '') => {
    // console.log(username, password, email, avatar);
    try {
        const res = await request.postAuth(
            '/register',
            {
                username: username,
                password: password,
                email: email,
                avatar: avatar,
                phoneNumber: phoneNumber,
            },
            {},
        );
        return res;
    } catch (error) {
        return error;
    }
};

export const login = async (username, password) => {
    //console.log(username, password);
    try {
        const res = await request.postAuth(
            '/authenticate',
            {
                username: username,
                password: password,
            },
            {},
        );
        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const getUserInfo = async (token) => {
    try {
        const res = await request.getAuth('/user', {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Get user information error!');
    }
};

export const updateUserInfo = async (token = '', formData) => {
    //console.log(token, newUsername, newEmail, 'sadfasdfasdfasdf');
    try {
        const res = await request.updateUser('/user', formData, {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log(error);
        alert('update userinfo error!');
    }
};
