import PropTypes from 'prop-types';
import { format } from 'date-fns';
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
const defF = () => {};
function ScreeningItem({ id, screeningStart, price, active, onClick = defF }) {
    return (
        <div
            className={`px-10 py-7 border rounded-2xl text-center ${active && 'border-black'}`}
            onClick={() => onClick(id)}
        >
            <p className="font-bold text-3xl">{format(screeningStart, 'h:mm a')}</p>
            <p>{VND.format(price)}</p>
        </div>
    );
}

ScreeningItem.prototype = {
    id: PropTypes.string,
    screeningStart: PropTypes.string,
    price: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ScreeningItem;
