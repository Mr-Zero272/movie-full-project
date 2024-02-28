import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Step1.module.scss';
import { useDispatch } from 'react-redux';
import { addToCartActions } from '~/store/add-to-cart-slice';
const deF = (a, b) => {};
function Seat({ seatInfo, available, booked, selected, choosing, className, onClick = deF }) {
    const dispatch = useDispatch();
    const handleChooseSeat = () => {
        if (seatInfo.status === 'booked') return;
        console.log(seatInfo);
        onClick(seatInfo.id, seatInfo.status);
        dispatch(addToCartActions.chooseSeat(seatInfo));
    };
    return (
        <div
            className={classNames('m-1 w-9 h-7 rounded-t-lg cursor-pointer', {
                [className]: className,
                'bg-gray-300': available,
                'bg-red-500 cursor-not-allowed': booked,
                'bg-green-500': selected,
                'bg-blue-500 cursor-not-allowed': choosing,
            })}
            onClick={handleChooseSeat}
        ></div>
    );
}

Seat.prototype = {
    booked: PropTypes.bool,
    selected: PropTypes.bool,
    choosing: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Seat;
