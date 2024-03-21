import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartFlatbed, faVideo } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import CartItem from './CartItem';
import { cartService, seatService } from '~/apiServices';
import { useFormatVndCurrency, useNotify, useToken } from '~/hooks';
import { addToCartActions } from '~/store/add-to-cart-slice';
import Orders from './Orders';
import { fetchQuantityCart } from '~/store/cart-quantity';

function Ticket() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const VND = useFormatVndCurrency();
    const userInfo = useSelector((state) => state.user);
    const cartStateInfo = useSelector((state) => state.addToCart);
    const [activeTab, setActiveTab] = useState(+tab);
    const [cartInfo, setCartInfo] = useState();
    const [checkAll, setCheckAll] = useState(false);
    const { isTokenValid, token } = useToken();
    const dispatch = useDispatch();
    const notify = useNotify();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            // const { isValid } = checkTokenValidity();
            // if (isValid) {
            if (isTokenValid) {
                const result = await cartService.getAllTicketInActiveCart(token);
                console.log(result);
                setCartInfo(result);
            }
            // } else {
            //     navigate('/login');
            // }
            //console.log(result);
        };
        dispatch(addToCartActions.refreshState());
        fetchTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTokenValid]);

    useEffect(() => {
        const _type = searchParams.get('_type');
        setSearchParams({ _type, tab: activeTab });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    useEffect(() => {
        if (cartInfo) {
            if (
                cartInfo.listTickets?.length === cartStateInfo.listSeatSelected?.length &&
                cartStateInfo.listSeatSelected?.length !== 0
            ) {
                setCheckAll(true);
            } else {
                setCheckAll(false);
            }
        }
    }, [cartStateInfo.listSeatSelected, cartInfo]);

    const handleCheckAllTicket = () => {
        if (checkAll) {
            dispatch(addToCartActions.setListSelected([]));
        } else {
            dispatch(addToCartActions.setListSelected(cartInfo.listTickets));
        }
    };

    const handleDeleteItemInCart = useCallback(() => {
        const fetchApi = async () => {
            const result = await cartService.getAllTicketInActiveCart(token);
            //console.log(result);
            console.log(result);
            setCartInfo(result);
        };

        fetchApi();
        dispatch(fetchQuantityCart());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckout = () => {
        if (cartStateInfo.listSeatSelected?.length === 0) {
            return;
        }

        const checkoutSeat = async () => {
            const listSeatInfos = cartStateInfo.listSeatSelected.map((seat) => ({
                id: seat.id,
                status: seat.status,
                username: userInfo.username,
            }));
            const res = await seatService.checkoutSeat(listSeatInfos);
            // console.log(res);
            if (res) {
                let tempListSeatSelected = [];
                if (res?.length !== 0) {
                    tempListSeatSelected = cartStateInfo.listSeatSelected.filter((itm) => !res.includes(itm.id));
                    if (tempListSeatSelected?.length === 0) {
                        notify('List ticket you checkout is not available right now!', 'warning');
                        return;
                    } else {
                        const listScreenings = tempListSeatSelected.map((it) => it.screeningId);
                        const strListScreening = listScreenings
                            .filter((item, index) => listScreenings.indexOf(item) === index)
                            .join(',');
                        navigate(`/booking?screeningIds=${strListScreening}&tab=1`);
                    }
                } else {
                    const listScreenings = cartStateInfo.listSeatSelected.map((it) => it.screeningId);
                    const strListScreening = listScreenings
                        .filter((item, index) => listScreenings.indexOf(item) === index)
                        .join(',');
                    navigate(`/booking?screeningIds=${strListScreening}&tab=1`);
                }
            }
        };

        checkoutSeat();
    };

    return (
        <div className="w-full px-32 pt-10 flex relative">
            <div className="flex flex-col justify-between mb-48 min-h-[600px]">
                <div className="sticky top-32 z-20 flex pr-3 w-72 mt-2">
                    <div>
                        <img className="w-20 h-20 object-cover rounded-full" src={userInfo.avatar} alt="avatar" />
                    </div>

                    <div className="ml-7">
                        <div className="font-bold">{userInfo.username}</div>
                        <div>
                            <Link to="/profile" className="flex justify-center items-center text-gray-500">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2"
                                >
                                    <path
                                        d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                                        fill="#9B9B9B"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                                Edit profile
                            </Link>
                        </div>
                    </div>
                </div>
                {activeTab === 1 && (
                    <div className="sticky top-96 z-20">
                        <div className="flex items-center justify-center border-r border-dashed mb-5">
                            <input
                                type="checkbox"
                                className="cursor-pointer size-7 text-primary-normal bg-primary-normal border-red-300 rounded"
                                checked={checkAll}
                                onChange={handleCheckAllTicket}
                            />
                            <label className="ms-3 text-gray-500 text-md">Checkout All</label>
                        </div>
                        <div className="flex items-center justify-center flex-col border-r border-dashed mb-5">
                            <p className="text-gray-500">Total</p>
                            <p className="font-semibold text-3xl">{VND.format(cartStateInfo.totalPayment)}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                                onClick={handleCheckout}
                            >
                                Check out
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'text-white font-medium rounded-lg text-md px-5 py-2.5 text-center',
                                    cartStateInfo.listSeatSelected?.length === 0
                                        ? 'bg-red-300 dark:bg-red-500 cursor-not-allowed'
                                        : 'bg-red-500 dark:bg-red-700 cursor-pointer ',
                                )}
                                disabled={cartStateInfo.listSeatSelected?.length === 0}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="ms-10 flex-1">
                <Tab.Group defaultIndex={+tab - 1}>
                    <div className="sticky top-28 z-20  flex items-center place-content-between">
                        <Tab.List className="py-3 rounded-lg flex -mb-px text-2xl font-medium text-center text-gray-500 dark:text-gray-400">
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        'inline-flex items-center justify-center p-4 outline-none',
                                        selected
                                            ? 'text-primary-normal border-b-2 border-primary-normal rounded-t-lg active dark:text-primary-normal dark:border-primary-normal group'
                                            : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group',
                                    )
                                }
                                onClick={() => setActiveTab(1)}
                            >
                                <FontAwesomeIcon className="size-7 me-3" icon={faCartFlatbed} />
                                Cart
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    classNames(
                                        'inline-flex items-center justify-center p-4 outline-none',
                                        selected
                                            ? 'text-primary-normal border-b-2 border-primary-normal rounded-t-lg active dark:text-primary-normal dark:border-primary-normal group'
                                            : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group',
                                    )
                                }
                                onClick={() => setActiveTab(2)}
                            >
                                <FontAwesomeIcon className="size-7 me-3" icon={faVideo} />
                                Orders
                            </Tab>
                        </Tab.List>
                        {activeTab === 1 && (
                            <div className="md:hidden flex items-center gap-x-16">
                                <div className="flex items-center justify-center border-r border-dashed mb-5">
                                    <input
                                        type="checkbox"
                                        className="cursor-pointer size-7 text-primary-normal bg-primary-normal border-red-300 rounded"
                                        checked={checkAll}
                                        onChange={handleCheckAllTicket}
                                    />
                                    <label className="ms-3 text-gray-500 text-md">Checkout All</label>
                                </div>
                                <div className="flex items-center justify-center border-r border-dashed mb-5">
                                    <p className="text-gray-500">Total:</p>
                                    <p className="ms-3 font-semibold text-3xl">
                                        {VND.format(cartStateInfo.totalPayment)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                                        onClick={handleCheckout}
                                    >
                                        Check out
                                    </button>
                                    <button
                                        type="button"
                                        className={classNames(
                                            'text-white font-medium rounded-lg text-md px-5 py-2.5 text-center',
                                            cartStateInfo.listSeatSelected?.length === 0
                                                ? 'bg-red-300 dark:bg-red-500 cursor-not-allowed'
                                                : 'bg-red-500 dark:bg-red-700 cursor-pointer ',
                                        )}
                                        disabled={cartStateInfo.listSeatSelected?.length === 0}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                            )}
                        >
                            <div className="w-full mt-5">
                                {cartInfo === '' ? (
                                    <p className="text-gray-400">You do not have any ticket in your cart!</p>
                                ) : cartInfo ? (
                                    cartInfo.listTickets.map((seat) => (
                                        <CartItem key={seat.id} cartItemInfo={seat} onDelete={handleDeleteItemInCart} />
                                    ))
                                ) : (
                                    <Skeleton />
                                )}
                            </div>
                        </Tab.Panel>
                        <Tab.Panel
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                            )}
                        >
                            <Orders />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}

export default Ticket;
