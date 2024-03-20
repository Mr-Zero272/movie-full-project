import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarDays, faFileLines, faMessage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';

import styles from './Payment.module.scss';
import Button from '~/components/Button';
import FormInputText2 from '~/components/Form/FormInput/FormInputText2';
import Loading from '~/components/Loading';
import { cartService } from '~/apiServices';
import useToken from '~/hooks/useToken';

let VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const maskPrivateString = (inputString) => {
    // Extract the first three characters
    const firstThreeCharacters = inputString.slice(0, 3);

    // Create a string of asterisks of the same length as the original string
    const asterisks = '*'.repeat(inputString.length - 3);

    // Concatenate the first three characters with the asterisks
    const maskedString = firstThreeCharacters + asterisks;

    return maskedString;
};

const notify = (message, type = 'success') => {
    toast(message, {
        type: type,
        style: { fontSize: '1.4rem' },
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: true,
        autoClose: 1500,
        className: 'foo-bar',
    });
};

const cx = classNames.bind(styles);

function Payment() {
    let [searchParams] = useSearchParams();
    const location = window.location.href;
    const navigate = useNavigate();
    const today = new Date();
    const { token } = useToken();
    const [paymentInfo, setPaymentInfo] = useState({
        username: maskPrivateString('username'),
        phone: maskPrivateString('0999999999'),
        content: 'MOONMOVIE',
    });

    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');

    const handleInputChange = (e) => {
        setPaymentInfo((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    useEffect(() => {
        const invoiceId = searchParams.get('invoiceId');
        const createNewZalopPayOrder = async () => {
            const res = await cartService.createNewZaloPayOrder(
                invoiceId,
                amount,
                'Pay for service in MoonMovie',
                location,
            );
            // console.log(res);
            window.open(res.data.order_url, '_self');
        };

        const createNewPayment = async (status) => {
            await cartService.createNewPayment(amount, provider, invoiceId, status, token);

            setTimeout(() => {
                window.close();
            }, 1500);
        };
        if (status && +status !== 0) {
            if (+status === 1) {
                Swal.fire({
                    title: 'This order is paid!',
                    text: 'Thanks for your order.',
                    icon: 'success',
                    preConfirm: () => createNewPayment('paid'),
                    allowOutsideClick: false,
                    showConfirmButton: 'Agree!',
                });
            } else {
                Swal.fire({
                    title: 'This order was not paid!',
                    text: 'Something went wrong!',
                    icon: 'error',
                    preConfirm: () => createNewPayment('unpaid'),
                    allowOutsideClick: false,
                    showConfirmButton: 'Agree!',
                });
            }
        } else {
            createNewZalopPayOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const handleSubmit = () => {
        console.log('Submit');
    };

    //console.log(paymentInfo);

    return (
        <div className={cx('wrapper')}>
            <Loading title="Loading..." />
            <div className={cx('payment-detail')}>
                <div className={cx('payment-detail-top')}>
                    <p className={cx('total')}>{VND.format(amount)}</p>
                    <div className={cx('detail')}>
                        <div className={cx('detail-item')}>
                            <p>Commission:</p>
                            <p>{VND.format(0)}</p>
                        </div>
                        <div className={cx('detail-item')}>
                            <p>Total:</p>
                            <p>{VND.format(amount)}</p>
                        </div>
                        <div className={cx('end-line-part')}></div>
                    </div>
                    <div className={cx('sub-detail')}>
                        <div className={cx('sub-detail-item')}>
                            <div className={cx('sdi-label')}>
                                <FontAwesomeIcon icon={faFileLines} />
                                <p>Invoice ID:</p>
                            </div>
                            <p>{maskPrivateString('UI0873F3')}</p>
                        </div>
                        <div className={cx('sub-detail-item')}>
                            <div className={cx('sdi-label')}>
                                <FontAwesomeIcon icon={faCalendarDays} />
                                <p>Date</p>
                            </div>
                            <p>
                                {today.toLocaleDateString('en-us', { month: 'short' })} {today.getDate()},{' '}
                                {today.getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('support')}>
                    <div className={cx('sp-label')}>
                        <h2>Customer support:</h2>
                        <p>Online 24/7</p>
                    </div>
                    <div className={cx('support-icon')}>
                        <FontAwesomeIcon icon={faMessage} />
                    </div>
                </div>
            </div>
            <div className={cx('payment-info')}>
                <div className={cx('payment-info-header')}>
                    <Tippy content="Back!">
                        <FontAwesomeIcon className={cx('back-icon')} icon={faArrowLeft} onClick={() => navigate(-1)} />
                    </Tippy>
                    <h1>Payment methods</h1>
                </div>
                <div className={cx('payment-info-body')}>
                    <div className={cx('payment-methods')}>
                        <div className={cx('payment-method', 'activem')}>
                            <p>VN Pay</p>
                        </div>
                        <div
                            className={cx('payment-method')}
                            onClick={() => notify('This payment method is in development.', 'warning')}
                        >
                            <p>Moon Pay</p>
                        </div>
                        <div className={cx('payment-method', 'more')}>
                            <p>
                                <FontAwesomeIcon icon={faPlus} className={cx('more-icon')} /> More
                            </p>
                        </div>
                    </div>
                    <div className={cx('form-payment')}>
                        <FormInputText2 disabled label={'Your payment account: ' + paymentInfo.phone} value="" />
                        <FormInputText2
                            label={'Content'}
                            name="content"
                            value={paymentInfo.content}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <FormInputText2
                            label={'Name'}
                            name="username"
                            value={paymentInfo.username.toUpperCase()}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                </div>
                <div className={cx('payment-info-footer')}>
                    <Button primary onClick={handleSubmit}>
                        Pay {VND.format(amount)};
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
