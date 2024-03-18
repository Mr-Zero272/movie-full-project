import axios from 'axios';

// main request
const movieApiRequest = axios.create({
    baseURL: 'http://localhost:8272/api/v1/',
});

export const getRequest = async (path, options = {}) => {
    const response = await movieApiRequest.get(path, options);

    return response.data;
};

export const postRequest = async (path, data = {}, options = {}) => {
    const response = await movieApiRequest.post(path, data, options);

    return response.data;
};

export const putRequest = async (path, data = {}, options = {}) => {
    const response = await movieApiRequest.put(path, data, options);

    return response.data;
};

export const deleteRequest = async (path, options = {}) => {
    const response = await movieApiRequest.delete(path, options);

    return response.data;
};
