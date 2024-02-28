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
