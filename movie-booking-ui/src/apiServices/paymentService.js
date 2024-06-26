import CryptoJS from 'crypto-js';
import moment from 'moment';
import queryString from 'query-string';

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

export const createVnPayPayment = (
    amount = 1,
    orderInfo = 'Pay for Moon movie tickets',
    returnUrl = 'http://localhost:3001/payment',
    txnRef = 1,
) => {
    let vpnUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const today = new Date();
    const yyyy = today.getFullYear().toString();
    const MM = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const hh = today.getHours().toString().padStart(2, '0');
    const mm = today.getMinutes().toString().padStart(2, '0');
    const ss = today.getSeconds().toString().padStart(2, '0');
    const createdDate = yyyy + MM + dd + hh + mm + ss;
    //const randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
    const secretKey = 'ZPMZQAODTVUEUCEEZGHCMWRRBLHLFBLL';
    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: 'OYDVKJE0',
        vnp_Amount: amount * 100,
        vnp_CreateDate: createdDate,
        vnp_CurrCode: 'VND',
        vnp_IpAddr: '127.0.0.1',
        vnp_Locale: 'vn',
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: returnUrl,
        vnp_TxnRef: txnRef,
    };

    vnp_Params = sortObject(vnp_Params);

    const queryString = require('qs');
    const signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = CryptoJS.HmacSHA512(signData, secretKey);
    const signed = hmac.toString(CryptoJS.enc.Hex);
    console.log(signed);
    vnp_Params['vnp_SecureHash'] = signed;

    vpnUrl += '?' + queryString.stringify(vnp_Params, { encode: false });
    return vpnUrl;
};

export const checkTransactionState = (
    vnp_Amount = 1000000,
    vnp_BankCode = 'NCB',
    vnp_BankTranNo = 'VNP14164840',
    vnp_CardType = 'ATM',
    vnp_OrderInfo = '',
    vnp_PayDate = 20231102214044,
    vnp_ResponseCode = '00',
    vnp_TmnCode = 'OYDVKJE0',
    vnp_TransactionNo = 14164840,
    vnp_TransactionStatus = '00',
    vnp_TxnRef = '1',
    vnp_SecureHash = 'ffc22a662b7bc2c90ea5da463c6d2a988c683a11fb019e2e0f7ec26733cfd9cade8755b287914017dd1e6342d0df5335525c57ecc8b2638e7016ca62e7ea5096',
) => {
    const secretKey = 'ZPMZQAODTVUEUCEEZGHCMWRRBLHLFBLL';
    let vnp_Params = {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
    };

    vnp_Params = sortObject(vnp_Params);

    const queryString = require('qs');
    const signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = CryptoJS.HmacSHA512(signData, secretKey);
    const signed = hmac.toString(CryptoJS.enc.Hex);
    if (vnp_SecureHash === signed) {
        const res = {
            orderId: vnp_TxnRef,
            rspCode: vnp_ResponseCode,
            message: 'success',
        };
        return res;
    } else {
        const res = {
            rspCode: 97,
            message: 'error',
        };
        return res;
    }
};

// APP INFO
// const generateRandomString = (length, key) => {
//     const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' + key;
//     let result = '';

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         result += characters[randomIndex];
//     }

//     return result;
// };

export const createZalopayNewOrder = () => {
    // APP INFO
    const config = {
        app_id: '2554',
        key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
        key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
        endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
    };

    const embed_data = { redirecturl: 'http://localhost:3001/payment' };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'user123',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: '',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    console.log(config.endpoint + '?' + queryString.stringify(order));

    // axios
    //     .post(config.endpoint, null, {
    //         params: order,
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     })
    //     .then((res) => {
    //         console.log(res.data);
    //     })
    //     .catch((err) => console.log(err));
};
