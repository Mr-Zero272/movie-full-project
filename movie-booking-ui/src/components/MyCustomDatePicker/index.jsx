import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DateItem from './DateItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
//MMM. dd
//absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
// const generateDateRange = (inputDate, n) => {
//     const result = [];
//     const currentDate = new Date(inputDate);

//     for (let i = -n; i <= n; i++) {
//         const newDate = new Date(currentDate);
//         newDate.setDate(currentDate.getDate() + i);
//         result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
//     }

//     return result;
// };
const generateDateRangeNext = (inputDate, n) => {
    const result = [];
    const currentDate = new Date(inputDate);

    for (let i = 0; i <= n; i++) {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + i);
        result.push(newDate.toISOString().split('T')[0] + 'T00:00:00');
    }

    return result;
};
// const renderItem = (quantity) => {
//     const items = [];
//     for (let i = 0; i < quantity; i++) {
//         items.push(
//             <div>
//                 <h3>{i}</h3>
//             </div>,
//         );
//     }
//     return items;
// };
const deF = (e) => {};
function MyCustomDatePicker({ className, value, onChooseDate = deF }) {
    const [listDate, setListDate] = useState(() => generateDateRangeNext(format(new Date(value), 'yyyy-MM-dd'), 6));
    const [activeDate, setActiveDate] = useState(value);

    const handleDateClick = (date) => {
        setActiveDate(date);
        onChooseDate(date);
    };

    const handleClickNextDate = () => {
        const nextFirstDate = new Date(listDate[6]);
        nextFirstDate.setDate(nextFirstDate.getDate() + 3);
        const nextFirstDateStr = nextFirstDate.toISOString().split('T')[0] + 'T00:00:00';
        const newListDate = generateDateRangeNext(nextFirstDateStr, 6);
        setListDate(newListDate);
        setActiveDate(newListDate[0]);
        onChooseDate(newListDate[0]);
    };

    const handleClickPreDate = () => {
        const prevFirstDate = new Date(listDate[0]);
        prevFirstDate.setDate(prevFirstDate.getDate() - 5);
        const prevFirstDateStr = prevFirstDate.toISOString().split('T')[0] + 'T00:00:00';
        const newListDate = generateDateRangeNext(prevFirstDateStr, 6);
        setListDate(newListDate);
        setActiveDate(newListDate[6]);
        onChooseDate(newListDate[6]);
    };
    return (
        <div className={`w-fit relative ${className}`}>
            <div className="w-full mb-3 flex place-content-between items-center">
                <h4>{format(new Date(activeDate), 'EEEE, d MMM')}</h4>
                <div className="flex place-content-end text-xl">
                    <div className="cursor-pointer mr-3" onClick={handleClickPreDate}>
                        <FontAwesomeIcon icon={faChevronLeft} className="bg-transparent" />
                    </div>
                    <div className="cursor-pointer" onClick={handleClickNextDate}>
                        <FontAwesomeIcon icon={faChevronRight} className="bg-transparent" />
                    </div>
                </div>
            </div>
            <div className="flex">
                {listDate.map((date) => (
                    <DateItem key={date} date={date} active={date === activeDate} onClick={handleDateClick} />
                ))}
            </div>
        </div>
    );
}

MyCustomDatePicker.defaultProps = {
    value: format(new Date(), 'yyyy-MM-dd') + 'T00:00:00',
};

MyCustomDatePicker.prototype = {
    onChooseDate: PropTypes.func,
};

export default MyCustomDatePicker;
