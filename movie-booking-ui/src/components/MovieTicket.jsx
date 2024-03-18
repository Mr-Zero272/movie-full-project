import { format } from 'date-fns';
import images from '~/assets/images';
let VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

function MovieTicket({ movieTitle, screeningStart, seat, id, price }) {
    return (
        <div className="mb-7 p-5 flex items-center w-full rounded-xl border shadow-md h-80">
            <div className="p-5 border-r w-3/12">
                <h3 className="mb-2 text-md text-gray-400 font-medium">Title</h3>
                <h1 className="text-black text-5xl font-bold">{movieTitle}</h1>
            </div>
            <div className="p-5 flex flex-col w-5/12 border-r border-dashed">
                <div className="flex items-center place-content-around mb-5">
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Date</h3>
                        <p className="text-2xl text-black font-bold">{format(new Date(screeningStart), 'MMM dd')}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Begins</h3>
                        <p className="text-2xl text-black font-bold">{format(new Date(screeningStart), 'hh:mm aa')}</p>
                    </div>
                </div>
                <div className="flex items-center place-content-around">
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Hall</h3>
                        <p className="text-2xl text-black font-bold">{seat.auditorium.name}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Row</h3>
                        <p className="text-2xl text-black font-bold">{seat.rowSeat}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Seat</h3>
                        <p className="text-2xl text-black font-bold">{seat.numberSeat}</p>
                    </div>
                </div>
            </div>
            <div className="w-4/12">
                <div className="flex items-center place-content-around mb-5">
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">TicketID</h3>
                        <p>{id.slice(0, 7) + '...'}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-md text-gray-400 font-medium">Price</h3>
                        <p>{VND.format(price)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <img className="size-28" src={images.paymentQrCode} alt="qr-code" />
                </div>
            </div>
        </div>
    );
}

export default MovieTicket;
