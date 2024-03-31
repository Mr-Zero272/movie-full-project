import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MovieItemWithDesc } from '~/components/MovieItem';
import NavStepper from '~/components/NavStepper';
import { Step1, Step2, Step3 } from './FormBooking';
import { addToCartActions, fetchInfoAddToCart } from '~/store/add-to-cart-slice';
import useNotify from '~/hooks/useNotify';
import Loading from '~/components/Loading';

const NAV_PURCHASE_TICKET = ['choose seats', 'purchase', 'complete'];
function Booking() {
    let [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const screeningIds = searchParams.get('screeningIds');
    const seatIds = searchParams.get('seatIds');
    // console.log(tab);
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(+tab);
    const checkoutInfo = useSelector((state) => state.addToCart);
    let sliderRef = useRef(null);

    const notify = useNotify();

    useEffect(() => {
        const listScreenings = screeningIds.split(',');
        const screeningId = listScreenings[0];
        dispatch(fetchInfoAddToCart(screeningId));
        dispatch(addToCartActions.setListScreening(listScreenings));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleActiveStep = useCallback(
        (stepIndex) => {
            if (checkoutInfo.listSeatSelected?.length === 0) {
                if (stepIndex === 2 || stepIndex === 3) {
                    notify('You must select at least one seat to continue!', 'error');
                    return;
                }
            }

            if (stepIndex === 1 && checkoutInfo.paymentInfo.status === 'paid') {
                notify('You have already paid so you cannot go back to step 1!!', 'info');
                return;
            }

            if (stepIndex === 3) {
                //console.log(checkoutInfo.paymentStatus, 'asdfasdf');
                if (checkoutInfo.paymentInfo.status !== 'paid') {
                    notify('You must complete payment to go to the next step!!', 'error');
                    return;
                }
            }
            sliderRef.current.slickGoTo(stepIndex - 1);
            setSearchParams({ seatIds: seatIds, screeningIds: screeningIds, tab: stepIndex });
            setActiveStep(stepIndex);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [checkoutInfo.listSeatSelected, checkoutInfo.paymentInfo],
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

    return (
        <>
            {checkoutInfo.loading && <Loading title="Payment..." />}
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
                            <Step2 onNextStep={handleActiveStep} />
                            <Step3 />
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Booking;
