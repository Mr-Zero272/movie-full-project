import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { faArrowRightLong, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';

import { screeningService } from '~/apiServices';
import MyCustomDatePicker from '~/components/MyCustomDatePicker';
import ScreeningItem from './ScreeningItem';
import useNotify from '~/hooks/useNotify';

function MovieScheduleItem2({ movieId }) {
    const [searchParams] = useSearchParams();
    const [screeningTypes, setScreeningTypes] = useState();
    const notify = useNotify();
    const [screeningInfoFetch, setScreeningInfoFetch] = useState(() => {
        const ADate = searchParams.get('date');
        if (ADate !== null) {
            return { type: '', date: ADate, movieId: movieId };
        }
        return { type: '', date: format(new Date(), 'yyyy-MM-dd') + 'T00:00:00', movieId: movieId };
    });
    const [listScreenings, setListScreenings] = useState();
    const [activeScreening, setActiveScreening] = useState();
    useEffect(() => {
        const fetchApi = async () => {
            const res = await screeningService.getAllScreeningTypes();
            setScreeningTypes(res);
            if (res) {
                setScreeningInfoFetch((prev) => ({
                    ...prev,
                    type: res[0],
                }));
            }
        };

        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await screeningService.getScreeningsByTimeAndTypeAndMovie(
                screeningInfoFetch.type,
                screeningInfoFetch.date,
                screeningInfoFetch.movieId,
            );
            setListScreenings(res);
            setActiveScreening('');
        };

        fetchApi();
    }, [screeningInfoFetch]);

    const handleSelectChange = (e) => {
        setScreeningInfoFetch((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDateChange = (date) => {
        setScreeningInfoFetch((prev) => ({
            ...prev,
            date: date,
        }));
    };

    const handleChooseScreening = (screening) => {
        setActiveScreening(screening);
    };

    const handleAddToCart = () => {
        if (activeScreening === '' || activeScreening === undefined) {
            notify('You need to choose screening first!!', 'error');
            return;
        }
    };

    const handleBookingNow = () => {
        if (activeScreening === '' || activeScreening === undefined) {
            notify('You need to choose screening first!!', 'error');
            return;
        }
    };

    return (
        <div>
            <div className="flex flex-col border-b pb-6 md:flex-row">
                <MyCustomDatePicker
                    className="md:mr-6"
                    value={screeningInfoFetch.date}
                    onChooseDate={handleDateChange}
                />
                <div className="mt-3 w-full md:mt-0 md:ml-5 md:border-l md:pl-7">
                    <h4 className="mb-3 dark:text-white">Screening type</h4>
                    <select
                        className="bg-transparent border-none text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="type"
                        value={screeningInfoFetch.type}
                        onChange={handleSelectChange}
                    >
                        {screeningTypes &&
                            screeningTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 pt-10 pb-7 border-b">
                {listScreenings &&
                    listScreenings.map((screening) => (
                        <ScreeningItem
                            key={screening.id}
                            {...screening}
                            active={screening.id === activeScreening}
                            onClick={handleChooseScreening}
                        />
                    ))}
                {listScreenings && listScreenings?.length === 0 && <div>No screening available!!</div>}
            </div>
            <div className="mt-5 flex">
                <button
                    type="button"
                    className="text-white bg-primary-normal hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-primary-focus font-medium rounded-lg text-2xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-primary-normal dark:hover:bg-primary-hover dark:focus:ring-primary-focus"
                    onClick={handleAddToCart}
                >
                    <FontAwesomeIcon className="mr-3" icon={faCartPlus} />
                    Add to cart
                </button>
                <button
                    type="button"
                    className="text-white bg-primary-normal hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-primary-focus font-medium rounded-lg text-2xl px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-primary-normal dark:hover:bg-primary-hover dark:focus:ring-primary-focus"
                    onClick={handleBookingNow}
                >
                    Booking now
                    <FontAwesomeIcon className="ml-3" icon={faArrowRightLong} />
                </button>
            </div>
        </div>
    );
}

MovieScheduleItem2.prototype = {
    movieId: PropTypes.string.isRequired,
};

export default MovieScheduleItem2;