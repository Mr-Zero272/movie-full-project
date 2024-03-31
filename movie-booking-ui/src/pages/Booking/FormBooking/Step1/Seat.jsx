import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { useDispatch, useSelector } from 'react-redux';
import { addToCartActions } from '~/store/add-to-cart-slice';
const deF = (a, b) => {};
function Seat({ seatInfo, available, booked, selected, choosing, className, onClick = deF }) {
    const dispatch = useDispatch();
    const addToCartInfo = useSelector((state) => state.addToCart);
    const handleChooseSeat = () => {
        if (seatInfo.status === 'booked') return;
        if (!addToCartInfo.listSeatSelected.some((seat) => seat.id === seatInfo.id) && seatInfo.status === 'choosing')
            return;
        // console.log(seatInfo);
        onClick(seatInfo.id, seatInfo.status);
        seatInfo.movieTitle = addToCartInfo.movieInfo.title;
        seatInfo.screeningStart = addToCartInfo.activeScreening.screeningStart;
        seatInfo.provider = addToCartInfo.movieInfo.whoAdd;
        dispatch(addToCartActions.chooseSeat(seatInfo));
    };
    return (
        <div
            className={classNames('m-1 w-9 h-7 rounded-t-lg', {
                [className]: className,
                'bg-gray-300 cursor-pointer': available,
                'bg-red-500 cursor-not-allowed': booked,
                'bg-green-500 cursor-pointer': selected,
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
