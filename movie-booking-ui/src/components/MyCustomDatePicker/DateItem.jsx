import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useState } from 'react';

function DateItem({ active, date = '2024-02-19T00:00:00', onClick }) {
    // const [_date, setDate] = useState(() => {
    //     const tDate = new Date(date);
    //     return tDate;
    // });
    const handleClick = (date) => {
        onClick(date);
    };
    return (
        <div
            className={`w-auto px-4 py-3 mr-3 cursor-pointer border text-center rounded-xl text-gray-500 hover:border-black hover:text-black ${
                active && 'border-black text-black'
            }`}
            onClick={() => handleClick(date)}
        >
            <div>{format(date, 'MMM')}</div>
            <div>{format(date, 'd')}</div>
        </div>
    );
}

DateItem.prototype = {
    active: PropTypes.bool,
    date: PropTypes.string,
    onClick: PropTypes.func,
};

export default DateItem;
