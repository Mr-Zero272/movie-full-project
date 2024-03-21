import { useState, useEffect } from 'react';
import { useFormatVndCurrency, useToken } from '~/hooks';
import { Disclosure } from '@headlessui/react';

import { cartService } from '~/apiServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';
import classNames from 'classnames';
import MovieTicket from '~/components/MovieTicket';
import images from '~/assets/images';

function Orders() {
    const [listOrders, setListOrders] = useState([]);
    const { isTokenValid, token } = useToken();
    const VND = useFormatVndCurrency();
    useEffect(() => {
        const fetchApi = async () => {
            if (isTokenValid) {
                const res = await cartService.getAllOrders(token);
                // console.log(res);
                setListOrders(res);
            }
            // setListOrders(resultListTickets);
        };

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTokenValid]);
    return (
        <div>
            <div className="w-full px-4">
                {listOrders ? (
                    <div className="mx-auto w-full rounded-2xl bg-white p-2">
                        {listOrders.map(({ id, total, createdAt, paymentDetail, listTickets }) => (
                            <Disclosure key={id} as="div" className="mt-2">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between items-start bg-white rounded-xl border border-l-2 border-l-green-300 shadow-md px-10 py-7  text-left text-md font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                            <div className="flex justify-center items-center">
                                                <div className="border-r">
                                                    <img className="size-14" src={images.logo} alt="logo" />
                                                </div>
                                                <div className="flex flex-col ml-7">
                                                    <span className="font-semibold text-black text-3xl">
                                                        <span className="text-gray-500"> Order:</span> {id}
                                                    </span>
                                                    <span className="font-semibold text-black">
                                                        <span className="text-gray-500"> Method:</span>{' '}
                                                        {paymentDetail.provider}
                                                    </span>
                                                    <span className="font-semibold text-black">
                                                        <span className="text-gray-500"> Order:</span>{' '}
                                                        {format(createdAt, 'MMM dd, yyy')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="mb-5">Total: {VND.format(total)}</span>
                                                <div>
                                                    <span className="me-5 font-semibold ">
                                                        State:{' '}
                                                        <span
                                                            className={classNames(
                                                                'uppercase',
                                                                paymentDetail.status === 'paid'
                                                                    ? 'text-green-400'
                                                                    : 'text-red-400',
                                                            )}
                                                        >
                                                            {paymentDetail.status}
                                                        </span>
                                                    </span>
                                                    <FontAwesomeIcon
                                                        className={`transition ease-in-out ${
                                                            open ? 'rotate-180 transform' : ''
                                                        } size-7 text-gray-500`}
                                                        icon={faChevronDown}
                                                    />
                                                </div>
                                            </div>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                                            {listTickets.map((ticket) => (
                                                <MovieTicket key={ticket.id} {...ticket} />
                                            ))}
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Skeleton count={3} className="mb-3" />
                        <Skeleton count={3} className="mb-3" />
                        <Skeleton count={3} className="mb-3" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
