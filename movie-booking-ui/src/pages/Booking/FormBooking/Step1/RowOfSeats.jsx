import classNames from 'classnames/bind';
import styles from './Step1.module.scss';
import Seat from './Seat';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);
const deF = (a, b) => {};
function RowOfSeats({ listSeats, totalSeats = 10, onChooseSeatInRow = deF }) {
    const listSeatSelected = useSelector((state) => state.addToCart.listSeatSelected);
    let totalSideSeats = 3;
    if (totalSeats === 6) {
        totalSideSeats = 1;
    }

    if (totalSeats === 8) {
        totalSideSeats = 2;
    }
    //console.log(listSeats);
    // const listSeatSelected = useSelector((state) => state.addToCart.listSeatSelected);
    return (
        <div className="flex">
            <div className="flex justify-end">
                {listSeats.slice(0, totalSideSeats).map((seat) => (
                    <Seat
                        className="col-start-3"
                        key={seat.id}
                        seatInfo={seat}
                        available={seat.status === 'available'}
                        booked={seat.status === 'booked'}
                        choosing={seat.status === 'choosing'}
                        selected={listSeatSelected.some((s) => s.id === seat.id)}
                        onClick={onChooseSeatInRow}
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 mx-10">
                {listSeats.slice(totalSideSeats, totalSideSeats + 4).map((seat) => (
                    <Seat
                        key={seat.id}
                        seatInfo={seat}
                        available={seat.status === 'available'}
                        booked={seat.status === 'booked'}
                        choosing={seat.status === 'choosing'}
                        selected={listSeatSelected.some((s) => s.id === seat.id)}
                        onClick={onChooseSeatInRow}
                    />
                ))}
            </div>
            <div className="flex justify-start">
                {listSeats.slice(totalSideSeats + 4).map((seat) => (
                    <Seat
                        className="col-start-1"
                        key={seat.id}
                        seatInfo={seat}
                        available={seat.status === 'available'}
                        booked={seat.status === 'booked'}
                        choosing={seat.status === 'choosing'}
                        selected={listSeatSelected.some((s) => s.id === seat.id)}
                        onClick={onChooseSeatInRow}
                    />
                ))}
            </div>
        </div>
    );
}

export default RowOfSeats;
