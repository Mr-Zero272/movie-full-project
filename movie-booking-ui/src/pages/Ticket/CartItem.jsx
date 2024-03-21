import PropTypes from 'prop-types';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartActions } from '~/store/add-to-cart-slice';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { cartService } from '~/apiServices';

const defaultFunction = (e) => {};
function CartItem({ cartItemInfo, onCheck = defaultFunction, onDelete = defaultFunction }) {
    const dispatch = useDispatch();
    const listTicketsChecked = useSelector((state) => state.addToCart.listSeatSelected);
    const [checked, setChecked] = useState(() => listTicketsChecked.some((item) => item.id === cartItemInfo.id));
    useEffect(() => {
        setChecked(() => listTicketsChecked.some((item) => item.id === cartItemInfo.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listTicketsChecked]);

    const handleCheck = () => {
        onCheck(cartItemInfo);
        dispatch(addToCartActions.chooseSeat(cartItemInfo));
    };

    const handleDeleteTicket = (id) => {
        Swal.fire({
            title: 'Are you sure to delete this ticket?',
            text: "You won't be able to revert this! ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const callApi = async () => {
                    const token = localStorage.getItem('token');
                    const result = await cartService.deleteTicketById(token, id);
                    //console.log(result); {message: 'success'}
                    if (result && result.state === 'success') {
                        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                        onDelete();
                    } else {
                        Swal.fire('Opps!', 'Some thing went wrong!', 'warning');
                    }
                };

                callApi();
                // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire('Cancelled', 'Your ticket is still available!', 'error');
            }
        });
    };
    return (
        <div
            className={classNames(
                'mb-7 p-5 flex items-center w-full rounded-xl shadow-md h-80',
                checked ? 'border-l-4 border-primary-normal' : 'border',
            )}
        >
            <div className="w-1/12 flex items-center justify-center border-r border-dashed">
                <input
                    checked={checked}
                    type="checkbox"
                    className="cursor-pointer size-7 text-primary-normal bg-primary-normal border-red-300 rounded"
                    onChange={handleCheck}
                />
            </div>

            <div className="p-5 border-r w-4/12">
                <h3 className="mb-2 text-md text-gray-400 font-medium">Title</h3>
                <h1 className="text-black text-5xl font-bold">{cartItemInfo.movieTitle}</h1>
            </div>
            <div className="p-5 flex flex-col w-6/12 border-r border-dashed">
                <div className="flex items-center place-content-around mb-5">
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Date</h3>
                        <p className="text-2xl text-black font-bold">
                            {format(new Date(cartItemInfo.screeningStart), 'MMM dd')}
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Begins</h3>
                        <p className="text-2xl text-black font-bold">
                            {format(new Date(cartItemInfo.screeningStart), 'hh:mm aa')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center place-content-around">
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Hall</h3>
                        <p className="text-2xl text-black font-bold">{cartItemInfo.seat.auditorium.name}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Row</h3>
                        <p className="text-2xl text-black font-bold">{cartItemInfo.seat.rowSeat}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Seat</h3>
                        <p className="text-2xl text-black font-bold">{cartItemInfo.seat.numberSeat}</p>
                    </div>
                </div>
            </div>
            <div
                className="w-1/12 flex items-center justify-center"
                onClick={() => handleDeleteTicket(cartItemInfo.id)}
            >
                <FontAwesomeIcon className="size-7 cursor-pointer text-red-400" icon={faTrashAlt} />
            </div>
        </div>
    );
}

CartItem.prototype = {
    movieTitle: PropTypes.string,
    screeningStart: PropTypes.string,
    seat: PropTypes.object,
    onCheck: PropTypes.func,
};

export default CartItem;
