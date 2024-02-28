import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';
import styles from './Step1.module.scss';
import SeatSection from './SeatSection';
import { fetchQuantityCart } from '~/store/cart-quantity';
import { addToCartActions, fetchInfoAddToCart } from '~/store/add-to-cart-slice';
import MyCustomDatePicker from '~/components/MyCustomDatePicker';
import ScreeningItemPicker from './ScreeningItemPicker';
import ScreeningPicker from './ScreeningPicker';
import Seat from './Seat';

const cx = classNames.bind(styles);
const defaultF = () => {};
function Step1({ onNextStep = defaultF, nextBtn = false, addToCartBtn = false, onSubmit = defaultF }) {
    const dispatch = useDispatch();
    const activeDate = useSelector((state) => state.addToCart.activeDate);
    const movieId = useSelector((state) => state.addToCart.activeMovie);
    const movieInfo = useSelector((state) => state.addToCart.movieInfo);

    const handleSubmit = () => {
        // dispatch(fetchQuantityCart());
        onSubmit();
    };
    //console.log(addToCartInfo);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChooseDate = (date) => {
        dispatch(addToCartActions.setActiveDate(date));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-top')}>
                <div className="w-full mb-5 flex place-content-between items-center">
                    <div className="text-4xl font-bold">{movieInfo.title}</div>
                    <div>
                        <FontAwesomeIcon icon={faClock} /> {movieInfo.duration_min} minutes
                        <Button className="ml-3" outline>
                            MM-01
                        </Button>
                    </div>
                </div>
                <div className="py-3 flex flex-col place-content-between items-start xl:flex-row">
                    <div className="mb-10 w-full xl:mb-0 xl:w-1/2">
                        <MyCustomDatePicker key={activeDate} value={activeDate} onChooseDate={handleChooseDate} />
                    </div>
                    <div className="w-full xl:w-[45%]">
                        <ScreeningPicker activeDate={activeDate} movieId={movieId} />
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="flex flex-col md:flex-row">
                    <div className="hidden md:block md:w-2/6"></div>
                    <SeatSection className="w-full md:w-4/6" />
                    <div className="w-full pb-20 md:pb-0 md:w-2/6">
                        <div className="mb-5">
                            <h3 className="mb-3 text-4xl text-gray-500 font-semibold">Note</h3>
                            <ol>
                                <li>
                                    <FontAwesomeIcon className="text-primary-normal mr-3" icon={faCircleNotch} />
                                    This is a form of real-time seat selection, but you will not be able to reserve a
                                    seat if you just add it to your cart!
                                </li>
                                <li>
                                    <FontAwesomeIcon className="text-primary-normal mr-3" icon={faCircleNotch} />
                                    Below are the specific status symbols of the seats.
                                </li>
                            </ol>
                        </div>
                        <div className="mb-10 grid grid-cols-2 w-80 gap-y-5 gap-x-16">
                            <div className="flex items-center w-72">
                                <Seat available />
                                <p className="ml-5">Available</p>
                            </div>
                            <div className="flex items-center w-72">
                                <Seat selected />
                                <p className="ml-5">Selected</p>
                            </div>
                            <div className="flex items-center w-72">
                                <Seat choosing />
                                <p className="ml-5">Choosing</p>
                            </div>
                            <div className="flex items-center w-72">
                                <Seat booked />
                                <p className="ml-5">Booked</p>
                            </div>
                        </div>
                        {nextBtn && (
                            <button className={cx('control-btn-nextStep')} onClick={() => onNextStep(2)}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )}
                        {addToCartBtn && (
                            <Button className={cx('control-btn-add-to-cart')} onClick={handleSubmit} primary>
                                Add to cart
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Step1;
