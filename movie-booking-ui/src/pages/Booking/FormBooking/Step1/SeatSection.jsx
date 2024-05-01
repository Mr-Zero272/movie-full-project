import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import RowOfSeats from './RowOfSeats';
import { seatService } from '~/apiServices';
import { addToCartActions } from '~/store/add-to-cart-slice';

function SeatSection({ className }) {
    const dispatch = useDispatch();
    const activeScreening = useSelector((state) => state.addToCart.activeScreening);
    const listSeatSelected = useSelector((state) => state.addToCart.listSeatSelected);
    const username = useSelector((state) => state.user.username);
    const [listSeats, setListSeats] = useState([]);
    const [myStompClient, setMyStompClient] = useState(null);
    const filterSeatByRow = (listSeats, row) => {
        return listSeats.filter((ss) => ss.seat.rowSeat === row);
    };

    useEffect(() => {
        const fetchListSeats = async () => {
            const res = await seatService.getListSeatStatusByScreeningId(activeScreening.id);
            setListSeats(res);
        };

        fetchListSeats();
    }, [activeScreening]);

    useEffect(() => {
        const sock = new SockJS('http://localhost:8085/ws');
        const stompClient = Stomp.over(sock);
        stompClient.connect({}, (frame) => {
            setMyStompClient(stompClient);
            console.log('Connected: ' + frame);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (myStompClient !== null) {
            myStompClient.subscribe('/topic/seat-state', (message) => {
                // console.log(listSeats);
                // console.log(message.body);
                // console.log('call sub 1 lan');
                const seatInfo = JSON.parse(message.body);
                setListSeats((prevListSeats) => {
                    let listSeatUpdated = prevListSeats.map((seat) => {
                        if (seat.id === seatInfo.id) {
                            return {
                                ...seat,
                                status: seatInfo.status,
                            };
                        } else {
                            return seat;
                        }
                    });
                    return listSeatUpdated;
                });
                // handleEditListSeat(seatInfo.id, seatInfo.status);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listSeats]);
    //sock.readyState
    useEffect(() => {
        const refreshSState = async () => {
            if (listSeatSelected?.length !== 0) {
                const listSeatIds = listSeatSelected.map((seat) => seat.id);
                // console.log(listSeatIds);
                await seatService.refreshSeatState(listSeatIds);
            }
        };
        const handleBeforeUnload = (event) => {
            refreshSState();
            dispatch(addToCartActions.refreshState());

            event.preventDefault();
            event.returnValue = '';
            // alert('Confirm refresh');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listSeatSelected]);

    const handleChooseSeat = useCallback(
        (seatId, seatStatus) => {
            if (seatStatus === 'booked') return;
            // console.log(!listSeatSelected.some((seat) => seat.id === seatId && seatStatus === 'choosing'));
            if (!listSeatSelected.some((seat) => seat.id === seatId) && seatStatus === 'choosing') return;
            if (myStompClient !== null) {
                myStompClient.publish({
                    destination: '/app/choosing-seat-ws',
                    body: JSON.stringify({ id: seatId, status: seatStatus, username: username }),
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [myStompClient, listSeatSelected],
    );

    return (
        <div className={`${className}`}>
            <div className="mb-10 flex flex-col items-center justify-center">
                <div className="w-96 h-1 bg-gray-400"></div>
                <p className="text-3xl tracking-[3px] text-primary-normal">SCREEN</p>
            </div>
            {listSeats?.length !== 0 ? (
                <div className="p-0 md:py-4 md:px-10 relative flex flex-col items-center">
                    <div className="mb-7 flex flex-col justify-center items-center">
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'A')}
                            totalSeats={6}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'B')}
                            totalSeats={8}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'C')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                    </div>
                    <div className="mb-7 flex flex-col justify-center items-center">
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'D')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'E')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'F')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                    </div>
                    <div className="mb-7 flex flex-col justify-center items-center">
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'G')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'H')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'I')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                        <RowOfSeats
                            listSeats={filterSeatByRow(listSeats, 'K')}
                            totalSeats={10}
                            onChooseSeatInRow={handleChooseSeat}
                        />
                    </div>
                </div>
            ) : (
                <Skeleton height={300} width={500} count={1} />
            )}
        </div>
    );
}

export default SeatSection;
