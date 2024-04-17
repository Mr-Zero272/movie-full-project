import { movieRequest } from '@/utils/request';
// import qs from 'qs';

export const addGenres = async (genres) => {
    const token = localStorage.getItem('token');
    const dataToSend = JSON.stringify(genres);
    try {
        const res = await movieRequest.post('/genre', dataToSend, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        });
        return res;
    } catch (error) {
        console.log('Add genres error!');
    }
};

export const editGenre = async (id, newName) => {
    const token = localStorage.getItem('token');
    try {
        const res = await movieRequest.put(
            `/genre/${id}`,
            { newName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            },
        );
        return res;
    } catch (error) {
        console.log('Edit genre error!');
    }
};

export const getGenreInfo = async (id) => {
    try {
        const res = await movieRequest.get(`/genre/info/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Get genre info error!');
    }
};

export const getAllGenres = async (q = '', size = 8, cPage = 1) => {
    try {
        const res = await movieRequest.get('/genre/search', {
            params: {
                q,
                size,
                cPage,
            },
        });
        return res;
    } catch (error) {
        console.log('Get all genres error!');
        return {
            data: [],
            pagination: { size: 6, currentPage: 1, totalPage: 12, totalResult: 12 },
        };
    }
};

export const getAllGenresWithoutPagination = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await movieRequest.get('/genre/all', { headers: { Authorization: 'Bearer ' + token } });
        return res;
    } catch (error) {
        console.log('Get all not page genres error!');
        return [];
    }
};

export const searchWithTransformData = async (q = '', size = 8, cPage = 1) => {
    try {
        const res = await movieRequest.get('/genre/search', {
            params: { q, size, cPage },
            transformResponse: [
                function (data) {
                    let newData = JSON.parse(data);
                    let rData = newData.data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }));

                    return rData;
                },
            ],
        });
        return res;
    } catch (error) {
        console.log('Get list genre error!');
        console.log(error);
    }
};
