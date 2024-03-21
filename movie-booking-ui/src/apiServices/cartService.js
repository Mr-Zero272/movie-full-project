import * as request from '~/utils/request';
import { movieApiRequest } from '~/utils/requests';

export const getAllTicketInActiveCart = async (token = '') => {
    try {
        const res = await movieApiRequest.getRequest('/reservation', {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log('Get ticket error!');
        console.log(error);
    }
};

export const addListTicketToCart = async (token = '', ticketInfos = []) => {
    //console.log(ids);
    try {
        const res = await movieApiRequest.postRequest(
            '/reservation',
            { ticketInfos },
            {
                headers: { Authorization: 'Bearer ' + token },
            },
        );
        return res;
    } catch (error) {
        console.log('Add to cart error!');
        console.log(error);
    }
};

export const getAllOrders = async (token = '') => {
    //console.log(ids);
    try {
        const res = await movieApiRequest.getRequest('/reservation/order', {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log('Get all orders error!');
        console.log(error);
    }
};

export const checkout = async (token = '', invoiceId = '', totalTickets = '', listTickets = []) => {
    //console.log(ids);
    try {
        const res = await request.postOrderRequest(
            '',
            {
                invoiceId,
                totalTickets,
                listTickets,
            },
            { headers: { Authorization: 'Bearer ' + token } },
        );
        return res;
    } catch (error) {
        console.log('Checkout error!');
        console.log(error);
    }
};

export const deleteTicketById = async (token = '', seatId) => {
    //console.log(ids);
    try {
        const res = await movieApiRequest.deleteRequest(`/reservation/${seatId}`, {
            headers: { Authorization: 'Bearer ' + token },
        });
        return res;
    } catch (error) {
        console.log('Delete seat error!');
        console.log(error);
    }
};

export const createNewZaloPayOrder = async (app_trans_id, amount, description, redirectUrl) => {
    //console.log(ids);
    try {
        const res = await request.postOrderRequest(
            '/creat-zalopay-payment',
            {
                app_trans_id,
                amount,
                description,
                redirectUrl,
            },
            {},
        );
        return res;
    } catch (error) {
        alert(error);
    }
};

export const createNewPayment = async (amount, provider, invoiceId, status, token) => {
    //console.log(ids);
    try {
        const res = await request.postOrderRequest(
            '/payment',
            {
                amount,
                provider,
                invoiceId,
                status,
            },
            { headers: { Authorization: 'Bearer ' + token } },
        );
        return res;
    } catch (error) {
        alert(error);
    }
};
