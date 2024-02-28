import * as request from '~/utils/request';
import { auditoriumRequest } from '~/utils/requests';
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
