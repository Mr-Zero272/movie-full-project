import { format } from 'date-fns';
import { movieRequest } from '@/utils/request';

export const getAllScreeningByGreaterThanCurrentDate = async (size, cPage) => {
    const today = new Date();
    const todayFormat = format(today, "yyyy-MM-dd'T'HH:mm:ss");
    try {
        const res = await movieRequest.get(`/screening/date`, {
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
