import { format } from 'date-fns';
import * as request from '~/utils/request';
import { auditoriumRequest } from '~/utils/requests';
import { movieApiRequest } from '~/utils/requests';

export const getAllScreeningTypes = async () => {
    try {
        const res = await request.get(`/screening/type`);
        return res;
    } catch (error) {
        alert('Get screening type error!');
        console.log(error);
    }
};

export const getScreeningsByTimeAndTypeAndMovie = async (type, date, movieId) => {
    try {
        const res = await request.get(`/screening/search`, {
            params: {
                type,
                date,
                movieId,
            },
        });
        return res;
    } catch (error) {
        alert('Get screening error!');
        console.log(error);
    }
};

export const getScreeningsById = async (screeningId) => {
    try {
        const res = await request.get(`/screening/${screeningId}`, {});
        return res;
    } catch (error) {
        alert('Get screening error!');
        console.log(error);
    }
};

export const getAllAuditorium = async (screeningId) => {
    try {
        const res = await auditoriumRequest.getRequest(`/all`, {});
        return res;
    } catch (error) {
        alert('Get all auditorium error!');
        console.log(error);
    }
};

export const getAllScreeningByGreaterThanCurrentDate = async (size, cPage) => {
    const today = new Date();
    const todayFormat = format(today, "yyyy-MM-dd'T'HH:mm:ss");
    try {
        const res = await movieApiRequest.getRequest(`/movie/screening/date`, {
            params: {
                date: todayFormat,
                size,
                cPage,
            },
        });
        return res;
    } catch (error) {
        console.log('Get all screening by date error!');
        console.log(error);
    }
};
