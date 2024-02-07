import { movieRequest } from '@/utils/request';

export const addMovie = async (formData) => {
    try {
        const res = await movieRequest.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res;
    } catch (error) {
        console.log('Add movie error!');
    }
};
