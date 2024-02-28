import * as request from '~/utils/request';

export const search = async (q, type = '', genreIds = [], manufacturers = [], size = 6, cPage = 1) => {
    try {
        const res = await request.get('/search', {
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

export const pagination = async (q = '', size = 6, cpage = 1, genres = null, type = '', manufacturers = null) => {
    try {
        const res = await request.get('/pagination', {
            params: {
                q: q,
                size: size,
                cpage: cpage,
                genres: genres,
                type: type,
                manufacturers: manufacturers,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const schedule = async (q = '', size = 6, cpage = 1, genre = '') => {
    try {
        const res = await request.get('/schedule', {
            params: {
                q: q,
                size: size,
                cpage: cpage,
                genre: genre,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getMovieInfo = async (movieId) => {
    try {
        const res = await request.get(`/info/${movieId}`);
        return res;
    } catch (error) {
        console.log(error);
        // alert('Get movie info error!');
    }
};

export const getAllGenres = async () => {
    try {
        const res = await request.get(`/genre/all`);
        return res;
    } catch (error) {
        console.log(error);
        //alert('Get movie info error!');
    }
};

export const getScreeningTypes = async () => {
    try {
        const res = await request.get(`/screening/type`);
        return res;
    } catch (error) {
        console.log(error);
        //alert('Get movie info error!');
    }
};

export const getManufactures = async () => {
    try {
        const res = await request.get(`/manufacture`);
        return res;
    } catch (error) {
        console.log(error);
        //alert('Get movie info error!');
    }
};
