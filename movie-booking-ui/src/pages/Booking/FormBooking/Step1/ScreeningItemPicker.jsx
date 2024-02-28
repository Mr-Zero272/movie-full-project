import PropTypes from 'prop-types';
import { format } from 'date-fns';

const deF = () => {};

function ScreeningItemPicker({ id, type, screeningStart, price, active, onClick = deF }) {
    // const [_date, setDate] = useState(() => {
    //     const tDate = new Date(date);
    //     return tDate;
    // });
    const handleClick = (id) => {
        onClick(id);
    };
    return (
        <div
            className={`w-36 px-4 py-3 mr-3 cursor-pointer border text-center rounded-xl text-gray-500 hover:border-black hover:text-black ${
                active && 'border-black text-black'
            }`}
            onClick={() => handleClick(id)}
        >
            <div className="line-clamp-1">{type}</div>
            {screeningStart !== '' && <div>{format(new Date(screeningStart), 'h:mm a')}</div>}
        </div>
    );
}

ScreeningItemPicker.defaultProps = {
    screeningStart: '',
};

ScreeningItemPicker.prototype = {
    active: PropTypes.bool,
    screeningStart: PropTypes.string,
    onClick: PropTypes.func,
};

export default ScreeningItemPicker;
