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
