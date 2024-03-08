import classNames from 'classnames/bind';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Skeleton from 'react-loading-skeleton';

import { MovieItemWithDesc } from '~/components/MovieItem';
import NavStepper from '~/components/NavStepper';
import { Step1 } from './FormBooking';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addToCartActions, fetchInfoAddToCart } from '~/store/add-to-cart-slice';
import * as cartService from '~/apiServices/cartService';
import { fetchQuantityCart } from '~/store/cart-quantity';
import { screeningService } from '~/apiServices';

const NAV_PURCHASE_TICKET = ['Add to cart'];
function AddToCart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [searchParams] = useSearchParams();
    // const [screeningInfo, setScreeningInfo] = useState(null);
    const addToCartInfo = useSelector((state) => state.addToCart);
    const movieId = addToCartInfo.activeMovie;
    //console.log(id);
    //console.log(addToCartInfo);
    useEffect(() => {
        const listScreenings = searchParams.get('screeningIds').split(',');
        const screeningId = listScreenings[0];
        dispatch(fetchInfoAddToCart(screeningId));
        dispatch(addToCartActions.setListScreening(listScreenings));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(addToCartInfo);

    const handleSubmit = useCallback(() => {
        if (addToCartInfo.listSeatSelected?.length === 0) {
            alert('You have choose at least one seat!');
        } else {
            const callApiAddToCart = async () => {
                const token = localStorage.getItem('token');
                const ids = addToCartInfo.listSeatSelected.map((item) => {
                    return item.seatId;
                });
                const response = await cartService.addListTicketToCart(token, ids);
                if (response && response.message) {
                    const id = toast.loading('Please wait...');
                    setTimeout(() => {
                        toast.update(id, {
                            render: response.message,
                            type: 'success',
                            isLoading: false,
                            autoClose: 2000,
                        });
                        dispatch(fetchQuantityCart());
                        navigate(-1);
                    }, 1000);
                }
            };

            callApiAddToCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToCartInfo.listSeatSelected]);

    return (
        <div className="p-7 flex md:px-10 md:py-5">
            <div className="hidden xl:mr-7 xl:block xl:w-[20%]">
                <MovieItemWithDesc {...addToCartInfo.movieInfo} />
            </div>
            <div className="w-full xl:w-[80%] xl:pl-4">
                <div className="">
                    <NavStepper items={NAV_PURCHASE_TICKET} activeStep={1} />
                </div>
                <div className="">
                    <Step1 addToCartBtn onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default AddToCart;
