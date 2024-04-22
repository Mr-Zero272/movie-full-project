import { movieRequest } from '@/utils/request';

export const addMovie = async (formData, token) => {
    try {
        const res = await movieRequest.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
            },
        });
        return res;
    } catch (error) {
        console.log('Add movie error!');
    }
};

export const editMovie = async (movieId, formData, token) => {
    try {
        const res = await movieRequest.put(`/${movieId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Edit movie error!');
    }
};

export const editRequirement = async (requirementId, data, token) => {
    try {
        const res = await movieRequest.put(`/requirement/${requirementId}`, data, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Edit requirement error!');
    }
};

export const searchMovie = async (q, size = 6, cPage = 1, token) => {
    try {
        const res = await movieRequest.get('/business/search', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: {
                q,
                size,
                cPage,
            },
        });
        return res;
    } catch (error) {
        console.log('Fetch list business movie error!');
        console.log(error);
    }
};

export const getMovieInfo = async (movieId) => {
    try {
        const res = await movieRequest.get(`/info/${movieId}`, {});
        return res;
    } catch (error) {
        console.log('Get movie info error!');
        console.log(error);
    }
};

export const doSchedule = async (startDate, token) => {
    try {
        const res = await movieRequest.post(`/schedule`, startDate, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        });
        return res;
    } catch (error) {
        console.log('Schedule error info error!');
        console.log(error);
    }
};
