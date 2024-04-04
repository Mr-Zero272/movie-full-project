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

export const searchMovie = async (q, type = '', genreIds = [], manufacturers = [], size = 6, cPage = 1) => {
    try {
        const res = await movieRequest.get('/search', {
            params: {
                q,
                type,
                genreIds,
                manufacturers,
                size,
                cPage,
            },
        });
        return res;
    } catch (error) {
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
