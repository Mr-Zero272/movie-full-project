import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faSquareCheck,
    faFileLines,
    faCalendarDays,
    faMessage,
    faSquareXmark,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { RadioGroup } from '@headlessui/react';

import styles from './Step2.module.scss';
import TimeItem from '~/components/TimeItem';
import SeatChosen from './SeatChosen';
import TitleHeadingPage from '~/components/TitleHeadingPage';
import { addToCartActions } from '~/store/add-to-cart-slice';

// const generateRandomString = (length, key) => {
//     const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' + key;
//     let result = '';

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         result += characters[randomIndex];
//     }

//     return result;
// };

let VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const crateRandomTransId = () => {
    const transID = Math.floor(Math.random() * 1000000);
    return `${moment().format('YYMMDD')}_${transID}`;
};

const plans = [
    {
        name: 'Zalopay',
        value: 'zalopay',
        label: 'The most popular e-wallet!',
    },
    {
        name: 'Momo',
        value: 'momo',
        label: 'The most popular e-wallet!',
    },
    {
        name: 'VNPay',
        value: 'vnpay',
        label: 'The most popular e-wallet!',
    },
];

const cx = classNames.bind(styles);
function Step2({ onNextStep }) {
    const dispatch = useDispatch();
    const addToCartInfo = useSelector((state) => state.addToCart);
    const [step2Info, setStep2Info] = useState({
        activeScreening: [{ type: '' }],
        date: new Date(),
        listSeatSelected: [],
    });
    const [totalPaymentForAScreeningId, setTotalPaymentForAScreeningId] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState(() => ({
        app_trans_id: '',
        amount: 0,
        description: 'Pay for movie tickets from MOONMOVIE',
        redirectUrl: 'http://localhost:3001/payment',
    }));
    const [selected, setSelected] = useState(plans[0]);
    //console.log(addToCartInfo);

    useEffect(() => {
        const sock = new SockJS('http://localhost:8085/ws');
        const stompClient = Stomp.over(sock);
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/topic/payment-status', (message) => {
                const paymentInfoReturn = JSON.parse(message.body);
                console.log(paymentInfoReturn);
                if (paymentInfoReturn.invoiceId === paymentInfo.app_trans_id) {
                    console.log(paymentInfoReturn);
                    dispatch(addToCartActions.setPaymentStatus(paymentInfoReturn));
                    dispatch(addToCartActions.setLoading(false));
                }
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentInfo]);

    const totalPayment = useMemo(() => {
        const totalPayment = addToCartInfo.listSeatSelected.reduce(
            (accumulator, currentValue) => accumulator + currentValue.price,
            0,
        );
        return totalPayment;
    }, [addToCartInfo.listSeatSelected]);

    useEffect(() => {
        const activeScreening = addToCartInfo.activeScreening;
        //console.log(activeScreening);
        let date = new Date(activeScreening.screeningStart);

        const listSeatsForThisVV = addToCartInfo.listSeatSelected.filter(
            (seatInfo) => seatInfo.screeningId === activeScreening.id,
        );

        const totalPaymentForThisScreening = listSeatsForThisVV.reduce(
            (accumulator, currentValue) => accumulator + currentValue.price,
            0,
        );
        setTotalPaymentForAScreeningId(totalPaymentForThisScreening);
        setStep2Info((prev) => ({
            ...prev,
            activeScreening,
            date,
            listSeatSelected: listSeatsForThisVV,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToCartInfo.activeScreening, addToCartInfo.listSeatSelected]);

    const handlePaymentSubmit = () => {
        const invoiceId = crateRandomTransId();
        setPaymentInfo((prev) => ({
            ...prev,
            app_trans_id: invoiceId,
        }));
        dispatch(addToCartActions.setLoading(true));

        const paymentUrl = `http://localhost:3001/payment?amount=${totalPayment}&provider=zalopay&invoiceId=${invoiceId}`;
        window.open(paymentUrl, '_blank');
    };
    console.log(addToCartInfo);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-seats')}>
                <div className={cx('list-seats-item')}>
                    {step2Info.listSeatSelected.map((item) => (
                        <SeatChosen
                            key={item.id}
                            price={item.price}
                            {...item.seat}
                            screeningIfo={step2Info.activeScreening}
                        />
                    ))}
                </div>
                <div className={cx('total-price')}>Total: {VND.format(totalPaymentForAScreeningId)}</div>
            </div>
            <div className={cx('user-info')}>
                <TitleHeadingPage title={'Payment detail'} />
                <div className="flex items-start">
                    <div className="w-1/2">
                        <div className="w-full px-4 mb-5">
                            <div className="mx-auto w-full max-w-md">
                                <RadioGroup value={selected} onChange={setSelected}>
                                    <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                                    <div className="space-y-2">
                                        {plans.map((plan) => (
                                            <RadioGroup.Option
                                                key={plan.name}
                                                value={plan}
                                                className={({ active, checked }) =>
                                                    `${
                                                        active
                                                            ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-green-300'
                                                            : ''
                                                    } ${
                                                        checked ? 'bg-primary-normal text-white' : 'bg-white'
                                                    } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                                }
                                            >
                                                {({ active, checked }) => (
                                                    <>
                                                        <div className="flex w-full items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="text-sm">
                                                                    <RadioGroup.Label
                                                                        as="p"
                                                                        className={`font-medium  ${
                                                                            checked ? 'text-white' : 'text-gray-900'
                                                                        }`}
                                                                    >
                                                                        {plan.name}
                                                                    </RadioGroup.Label>
                                                                    <RadioGroup.Description
                                                                        as="span"
                                                                        className={`inline ${
                                                                            checked ? 'text-sky-100' : 'text-gray-500'
                                                                        }`}
                                                                    >
                                                                        <span>{plan.label}</span>
                                                                        <span aria-hidden="true">&middot;</span>{' '}
                                                                    </RadioGroup.Description>
                                                                </div>
                                                            </div>
                                                            {checked && (
                                                                <div className="shrink-0 text-white">
                                                                    <CheckIcon className="h-6 w-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="px-4">
                            {addToCartInfo.paymentInfo.status !== 'paid' && (
                                <button
                                    type="button"
                                    className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                                    onClick={handlePaymentSubmit}
                                >
                                    Pay now
                                </button>
                            )}
                            {addToCartInfo.paymentInfo.status === 'paid' && (
                                <div className={cx('payment-success')}>
                                    <FontAwesomeIcon icon={faSquareCheck} /> Payment successfully!
                                </div>
                            )}
                            {addToCartInfo.paymentInfo.status === 'unpaid' && (
                                <div className="italic text-red-600 py-10">
                                    <FontAwesomeIcon icon={faSquareXmark} /> Payment error!
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 ms-5">
                        <div className="p-5">
                            <div className="mb-20">
                                <p className="text-4xl font-semibold mb-5">{VND.format(totalPayment)}</p>
                                <div className="py-7 text-gray-500 border-b">
                                    <div className="flex place-content-between items-center">
                                        <p>Commission:</p>
                                        <p>0 &#8363;</p>
                                    </div>
                                    <div className="flex place-content-between items-center">
                                        <p>Total:</p>
                                        <p>{VND.format(totalPayment)}</p>
                                    </div>
                                    <div className={cx('end-line-part')}></div>
                                </div>
                                <div className="py-7 text-gray-500 border-b">
                                    <div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faFileLines} />
                                            <p className="ms-3">Invoice ID:</p>
                                        </div>
                                        <p className="flex justify-end font-semibold">{'gdf34F'}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarDays} />
                                            <p className="ms-3">Date</p>
                                        </div>
                                        <p className="flex justify-end font-semibold">
                                            {moment().format('MMM DD, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center place-content-between">
                                <div className={cx('sp-label')}>
                                    <h2>Customer support:</h2>
                                    <p>Online 24/7</p>
                                </div>
                                <div className="flex justify-center items-center size-20 bg-primary-normal rounded-full text-white text-3xl hover:text-primary-normal hover:border hover:bg-transparent cursor-pointer">
                                    <FontAwesomeIcon icon={faMessage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('showtime-info')}>
                <div className={cx('date', 'showtime-info-item')}>
                    <p>Date</p>
                    <TimeItem
                        date={step2Info.date.getDate()}
                        month={step2Info.date.toLocaleDateString('en-us', { month: 'short' })}
                        className={cx('custom-time-item')}
                    />
                </div>
                <div className={cx('time', 'showtime-info-item')}>
                    <p>Time</p>
                    <p>
                        {step2Info.date.getHours() +
                            ':' +
                            (step2Info.date.getMinutes() < 10
                                ? '0' + step2Info.date.getMinutes()
                                : step2Info.date.getMinutes())}
                    </p>
                </div>
                <div className={cx('type', 'showtime-info-item')}>
                    <p>Types</p>
                    <p>{step2Info.activeScreening.type}</p>
                </div>
            </div>
            <button className={cx('control-btn-nextStep')} onClick={() => onNextStep(3)}>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default Step2;
