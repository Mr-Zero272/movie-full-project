import { seatRequest } from '@/utils/request';

export const getAuditoriumInfo = async (id) => {
    try {
        const res = await seatRequest.get(`/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Get auditorium info error!');
    }
};

export const search = async (q = '', size = 8, cPage = 1) => {
    try {
        const res = await seatRequest.get(`/search`, {
            params: {
                q,
                size,
                cPage,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        console.log('Get search auditoriums error!');
    }
};

export const editAuditorium = async (id, name, address) => {
    try {
        const res = await seatRequest.put(
            `/${id}`,
            {
                name,
                address,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return res;
    } catch (error) {
        console.log(error);
        console.log('Edit auditorium error!');
    }
};

export const addAuditorium = async (name, address) => {
    try {
        const res = await seatRequest.post(
            ``,
            {
                name,
                address,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return res;
    } catch (error) {
        console.log(error);
        console.log('Edit auditorium error!');
    }
};
