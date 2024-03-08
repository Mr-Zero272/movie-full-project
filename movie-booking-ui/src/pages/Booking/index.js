import classNames from 'classnames/bind';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast } from 'react-toastify';

import { MovieItemWithDesc } from '~/components/MovieItem';
import NavStepper from '~/components/NavStepper';
import { Step1, Step2, Step3 } from './FormBooking';
import { addToCartActions, fetchInfoAddToCart } from '~/store/add-to-cart-slice';
import useNotify from '~/hooks/useNotify';

const getUniqueArray = (array) => {
    var uniqueArray = array.filter(
        (item, index) =>
            array.findIndex(
                (other) =>
                    other.screeningId === item.screeningId &&
                    other.auditoriumId === item.auditoriumId &&
                    other.movieId === item.movieId,
            ) === index,
    );
    return uniqueArray;
};

const NAV_PURCHASE_TICKET = ['choose seats', 'purchase', 'complete'];
function Booking() {
    let [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const screeningIds = searchParams.get('screeningIds');
    // console.log(tab);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(+tab);
    const checkoutInfo = useSelector((state) => state.addToCart);
    const [userInfo, setUserInfo] = useState({ username: '', email: '' });
    let sliderRef = useRef(null);

    const notify = useNotify();

    useEffect(() => {
        const listScreenings = screeningIds.split(',');
        const screeningId = listScreenings[0];
        console.log(screeningId);
        dispatch(fetchInfoAddToCart(screeningId));
        dispatch(addToCartActions.setListScreening(listScreenings));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(checkoutInfo);

    const handleActiveStep = useCallback(
        (stepIndex) => {
            if (checkoutInfo.listSeatSelected?.length === 0) {
                if (stepIndex === 2 || stepIndex === 3) {
                    notify('You must select at least one seat to continue!', 'error');
                    return;
                }
            }

            if (stepIndex === 1 && checkoutInfo.paymentStatus) {
                notify('You have already paid so you cannot go back to step 1!!', 'info');
                return;
            }

            if (stepIndex === 3) {
                //console.log(checkoutInfo.paymentStatus, 'asdfasdf');
                if (checkoutInfo.paymentStatus === false) {
                    notify('You must complete payment to go to the next step!!', 'error');
                    return;
                }

                if (userInfo.username === '' || userInfo.email === '') {
                    notify('You cannot leave either or both of the username and email fields blank.', 'error');
                    return;
                }
            }
            sliderRef.current.slickGoTo(stepIndex - 1);
            setSearchParams({ screeningIds: screeningIds, tab: stepIndex });
            setActiveStep(stepIndex);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [checkoutInfo.listSeatSelected, checkoutInfo.paymentStatus, userInfo.username, userInfo.email],
    );

    var settings = {
        infinite: false,
        arrows: false,
        dots: false,
        draggable: false,
        lazyLoad: true,
        initialSlide: tab - 1,
        //fade: true,
        adaptiveHeight: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    let uniqueListScreeningActive = useMemo(() => {
        return getUniqueArray(checkoutInfo.listScreeningsAreActive);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //console.log(movieId);
    //console.log(checkoutInfo);
    // useEffect(() => {
    //     //console.log('pagegoi', id);
    //     dispatch(fetchInfoAddToCart(movieId));
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const getCurrentMoviePosition = () => {
        const currentMoviePosition = uniqueListScreeningActive.findIndex(
            (ele) => ele.movieId === checkoutInfo.activeMovie,
        );
        return currentMoviePosition;
    };
    const handleNextBooking = useCallback(async () => {
        const currentIndexScreening = checkoutInfo.screenings.findIndex(
            (item) => item === checkoutInfo.activeScreening.id,
        );
        let nextScreening = 0;
        if (currentIndexScreening + 1 > checkoutInfo.screenings?.length - 1) {
            nextScreening = 0;
        } else {
            nextScreening = currentIndexScreening + 1;
        }
        console.log(nextScreening);
        console.log(checkoutInfo.screenings[nextScreening]);
        dispatch(fetchInfoAddToCart(checkoutInfo.screenings[nextScreening]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutInfo]);

    const handlePrevBooking = useCallback(async () => {
        const currentIndexScreening = checkoutInfo.screenings.findIndex(
            (item) => item === checkoutInfo.activeScreening.id,
        );
        let prevScreening = 0;
        if (currentIndexScreening - 1 < 0) {
            prevScreening = checkoutInfo.screenings?.length - 1;
        } else {
            prevScreening = currentIndexScreening - 1;
        }
        console.log(checkoutInfo.screenings[prevScreening]);

        dispatch(fetchInfoAddToCart(checkoutInfo.screenings[prevScreening]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutInfo]);

    // for step 2
    const handleChangeInput = useCallback((e) => {
        setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    return (
        <div className="p-7 flex md:px-10 md:py-5">
            <div className="hidden xl:mr-7 xl:block xl:w-[20%]">
                <MovieItemWithDesc
                    {...checkoutInfo.movieInfo}
                    arrows={true}
                    onNext={handleNextBooking}
                    onPrev={handlePrevBooking}
                />
            </div>
            <div className="w-full xl:w-[80%] xl:pl-4">
                <div className="">
                    <NavStepper items={NAV_PURCHASE_TICKET} activeStep={activeStep} onClick={handleActiveStep} />
                </div>
                <div className="">
                    <Slider {...settings} ref={sliderRef}>
                        <Step1 nextBtn onNextStep={handleActiveStep} />
                        <Step2 onNextStep={handleActiveStep} onChangeInfo={handleChangeInput} />
                        <Step3 userInfo={userInfo} />
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Booking;
