import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuantityCart } from '~/store/cart-quantity';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './Step3.module.scss';
import FormInputText2 from '~/components/Form/FormInput/FormInputText2';
import Button from '~/components/Button';
import { cartService } from '~/apiServices';
import MovieTicket from '~/components/MovieTicket';
import { useNotify } from '~/hooks';

const cx = classNames.bind(styles);

function Step3({ userInfo }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notify = useNotify();
    const addToCartInfo = useSelector((state) => state.addToCart);
    const [email, setEmail] = useState({ email: '' });
    const token = localStorage.getItem('token');

    const handleChangeInput = (e) => {
        setEmail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isValidEmail = (email) => {
        const regex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
        return regex.test(email);
    };

    const handleSendEmail = () => {
        if (email.email === '') {
            notify('The email field is empty so you will not receive tickets via email!', 'warning');
            return;
        }
        if (!isValidEmail(email.email)) {
            notify('This email is not valid!', 'error');
            return;
        }
        const sendTicketsToMail = async () => {
            const id = toast.loading('Please wait...');
            const ticketsMail = addToCartInfo.listSeatSelected.map((it) => ({
                title: it.movieTitle,
                date: it.screeningStart,
                hall: it.seat.auditorium.name,
                row: it.seat.rowSeat,
                seat: it.seat.numberSeat,
                id: it.id,
                price: it.price,
            }));

            const res = await cartService.sendTicketsToCart(email.email, ticketsMail, token);
            if (res && res.state === 'success') {
                toast.update(id, {
                    render: 'Tickets have been sent to your email ^o^!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 1500,
                });
            } else {
                toast.update(id, {
                    render: 'Something went wrong!',
                    type: 'error',
                    isLoading: false,
                    autoClose: 1500,
                });
            }
        };

        sendTicketsToMail();
    };

    const handleSubmit = () => {
        const callApi = async () => {
            const listTickets = addToCartInfo.listSeatSelected.map((seat) => {
                return {
                    seatId: seat.id,
                    movieTitle: seat.movieTitle,
                    screeningStart: seat.screeningStart,
                    provider: seat.provider,
                    price: seat.price,
                };
            });
            //console.log(ids);
            const invoiceId = addToCartInfo.paymentInfo.invoiceId;
            const result = await cartService.checkout(token, invoiceId, listTickets?.length, listTickets);
            console.log(result);
            if (result && result.state === 'success') {
                notify('Complete checkout! Thank for you order WUW!', 'success');
                dispatch(fetchQuantityCart());
                navigate('/ticket?_type=ticket&tab=2');
            } else {
                notify(result.message, 'warning');
                dispatch(fetchQuantityCart());
                navigate('/ticket?_type=ticket&tab=2');
            }
        };

        callApi();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-tickets')}>
                {addToCartInfo.listSeatSelected.map((seatInfo) => (
                    <MovieTicket key={seatInfo.id} {...seatInfo} />
                ))}
            </div>
            <div className={cx('left-side')}>
                <div className={cx('send-email')}>
                    <p>Send tickets to your email?</p>
                    <FormInputText2
                        label={'Your email:'}
                        name={'email'}
                        value={email.email}
                        onChange={(e) => handleChangeInput(e)}
                    />
                    <Button primary onClick={handleSendEmail}>
                        SEND
                    </Button>
                </div>
                <div className={cx('last-check')}>
                    <h1>Last step</h1>
                    <p>
                        This is the final step. Please check the information again. If there are any errors, please go
                        back to the previous step and edit. If there are no errors, press the finish button here to
                        complete the booking.
                    </p>
                    <Button primary onClick={handleSubmit}>
                        Finish
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Step3;
