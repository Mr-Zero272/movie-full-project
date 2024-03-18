import { auditoriumRequest } from '~/utils/requests';

export const getListSeatStatusByScreeningId = async (screeningId) => {
    try {
        const res = await auditoriumRequest.getRequest(`/seat-status/${screeningId}`);
        return res.data;
    } catch (error) {
        alert('Get list seat status error!');
        console.log(error);
    }
};

export const refreshSeatState = async (listSeatIds) => {
    try {
        const res = await auditoriumRequest.postRequest(`/seat-status/refresh-state`, listSeatIds);
        return res;
    } catch (error) {
        alert('Refresh seat status error!');
        console.log(error);
    }
};

export const checkoutSeat = async (listSeatInfos) => {
    try {
        const res = await auditoriumRequest.postRequest(`/seat-status`, listSeatInfos);
        return res;
    } catch (error) {
        alert('Check out seat status error!');
        console.log(error);
    }
};
