import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ScreeningItemPicker from './ScreeningItemPicker';
import { screeningService } from '~/apiServices';
import Skeleton from 'react-loading-skeleton';
import { addToCartActions } from '~/store/add-to-cart-slice';

const defaultFunc = (e) => {};
function ScreeningPicker({ movieId, activeDate, onChooseScreening = defaultFunc, onChooseAuditorium = defaultFunc }) {
    const dispatch = useDispatch();
    const [listAuditorium, setListAuditorium] = useState([]);
    const [activeAuditorium, setActiveAuditorium] = useState();
    const [listScreenings, setListScreenings] = useState([]);
    const activeScreening = useSelector((state) => state.addToCart.activeScreening);
    useEffect(() => {
        const fetchAuditorium = async () => {
            const res = await screeningService.getAllAuditorium();
            if (res) {
                setActiveAuditorium(res.data[0]);
                setListAuditorium(res.data);
            }
        };

        fetchAuditorium();
    }, []);

    useEffect(() => {
        const fetchScreening = async () => {
            const res = await screeningService.getScreeningsByTimeAndTypeAndMovie(null, activeDate, movieId);
            if (res) {
                setListScreenings(res);
            }
        };

        fetchScreening();
    }, [movieId, activeDate]);

    const handleChooseAuditorium = (auditorium) => {
        onChooseAuditorium(auditorium);
        setActiveAuditorium(auditorium);
    };

    const handleChooseScreening = (screening) => {
        dispatch(addToCartActions.setActiveScreening(screening));
        onChooseScreening(screening);
    };
    return (
        <div className={`w-full relative`}>
            <div className="w-full mb-3 flex place-content-between items-center">
                <h4>Show time</h4>
                <div className="group w-64">
                    {activeAuditorium ? (
                        <>
                            <button
                                className="text-black rounded-lg text-xl px-5 py-2.5 text-left inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                type="button"
                            >
                                Auditorium: {activeAuditorium.name}
                                <FontAwesomeIcon className="size-3 ms-3 text-right" icon={faChevronDown} />
                            </button>
                        </>
                    ) : (
                        <Skeleton className="w-48" />
                    )}

                    <div className="z-10 absolute hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 group-hover:block">
                        <ul className="py-2 text-xl text-gray-700 dark:text-gray-200">
                            {listAuditorium &&
                                listAuditorium.map(({ id, name }) => (
                                    <li key={id} onClick={() => handleChooseAuditorium({ id, name })}>
                                        <button className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            {name}
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex">
                {listScreenings?.length !== 0 ? (
                    listScreenings.map((screening) => (
                        <ScreeningItemPicker
                            key={screening.id}
                            {...screening}
                            active={activeScreening.id === screening.id}
                            onClick={handleChooseScreening}
                        />
                    ))
                ) : (
                    <ScreeningItemPicker type="Empty" />
                )}
            </div>
        </div>
    );
}

export default ScreeningPicker;
