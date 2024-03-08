import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './Step2.module.scss';
import { addToCartActions } from '~/store/add-to-cart-slice';
const cx = classNames.bind(styles);
function SeatChosen({ numberSeat, rowSeat, price }) {
    const dispatch = useDispatch();
    const addToCartInfo = useSelector((state) => state.addToCart);
    //console.log(seatInfo);

    return (
        <div className={cx('seat-chosen-wrapper')}>
            <div className={cx('seat-chosen-column')}>
                <p>
                    Seat number <strong>{numberSeat}</strong>
                </p>
            </div>
            <div className={cx('seat-chosen-column')}>
                <p>
                    Row <strong>{rowSeat}</strong>
                </p>
            </div>
            <div className={cx('seat-chosen-column', 'price')}>
                <p>
                    <span>&#8363;</span>
                    {price / 1000}k
                </p>
            </div>
            <div className={cx('seat-chosen-column')}>
                <button className={cx('delete-seat-btn')}>
                    <FontAwesomeIcon icon={faFilm} />
                </button>
            </div>
        </div>
    );
}

export default SeatChosen;
