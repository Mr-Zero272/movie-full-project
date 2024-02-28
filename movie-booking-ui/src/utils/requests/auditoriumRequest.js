import axios from 'axios';

// auditoriumRequest
const auditoriumRequest = axios.create({
    baseURL: 'http://localhost:8272/api/v1/auditorium',
});

export const getRequest = async (path, options = {}) => {
    const response = await auditoriumRequest.get(path, options);

    return response;
};

export const postRequest = async (path, data = {}, options = {}) => {
    const response = await auditoriumRequest.post(path, data, options);

    return response.data;
};

export const putRequest = async (path, data = {}, options = {}) => {
    const response = await auditoriumRequest.put(path, data, options);

    return response.data;
};

export const deleteRequest = async (path, options = {}) => {
    const response = await auditoriumRequest.delete(path, options);

    return response.data;
};
