import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { screeningService } from '~/apiServices';

export const fetchInfoAddToCart = createAsyncThunk('addToCart/fetch', async (screeningId) => {
    //console.log(id);
    //console.log('asdfasd', q, size, cpage, genres, type, manufacturers);
    const response = await screeningService.getScreeningsById(screeningId);
    //console.log(response);
    return response;
});

// const getListSeatsSelected = (listSeats) => {
//     let listSeatsSelected = [];
//     listSeatsSelected = listSeats.map((item) => {
//         return item.seatId;
//     });
//     return listSeatsSelected;
// };

const addToDistinctArray = (array, value) => {
    let temp = [];
    if (array.some((item) => item.id === value.id)) {
        temp = array.filter((it) => it.id !== value.id);
    } else {
        temp = [...array, value];
    }
    return temp;
};

const addToCartSlice = createSlice({
    name: 'formBookingTicket',
    initialState: {
        loading: false,
        activeMovie: null,
        listScreeningsAreActive: [],
        activeDate: '2023-10-13T09:00:00', // tren day df la ''
        activeScreening: 0, // mac dinh de la 0 di :v
        activeAuditorium: 0,
        screenings: [],
        movieInfo: {},
        listSeatSelected: [],
        totalPayment: 0,
        paymentInfo: {
            invoiceId: '',
            status: '',
            provider: '',
        },
    },
    reducers: {
        setLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
        setPaymentStatus(state, action) {
            return {
                ...state,
                paymentInfo: action.payload,
            };
        },
        setTotalPayment(state, action) {
            return {
                ...state,
                totalPayment: action.payload,
            };
        },
        onChangeBooking(state, action) {
            return {
                ...state,
                activeMovie: action.payload.activeMovie,
                activeDate: action.payload.activeDate,
                activeShowtime: action.payload.activeShowtime,
                activeAuditorium: action.payload.activeAuditorium,
            };
        },
        refreshState(state) {
            return {
                loading: false,
                activeMovie: null,
                listScreeningsAreActive: [],
                activeDate: '2023-10-13T09:00:00', // tren day df la ''
                activeScreening: 0, // mac dinh de la 0 di :v
                activeAuditorium: 0,
                screenings: [],
                movieInfo: {},
                listSeatSelected: [],
                totalPayment: 0,
                paymentInfo: {
                    invoiceId: '',
                    status: '',
                    provider: '',
                },
            };
        },
        setListScreeningsAreActive(state, action) {
            return {
                ...state,
                listScreeningsAreActive: action.payload,
            };
        },
        chooseAuditorium(state, action) {
            return {
                ...state,
                activeAuditorium: action.payload,
            };
        },
        checkout(state, action) {
            return {
                ...state,
                activeMovie: action.payload.activeMovie,
                listScreeningsAreActive: [...action.payload.listScreeningsAreActive],
                activeDate: action.payload.activeDate,
                activeShowtime: action.payload.activeShowtime,
                listSeatSelected: [...action.payload.listSeatSelected],
            };
        },
        addToCart(state, action) {
            return {
                ...state,
                activeMovie: action.payload.activeMovie,
                listScreeningsAreActive: [action.payload.screening],
                activeDate: action.payload.activeDate,
                activeShowtime: action.payload.activeShowtime,
                listSeatSelected: [],
            };
        },
        chooseSeat(state, action) {
            const tempListSeatSelected = addToDistinctArray(state.listSeatSelected, action.payload);
            let totalPayment = tempListSeatSelected.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price;
            }, 0);
            return {
                ...state,
                listSeatSelected: tempListSeatSelected,
                totalPayment: totalPayment,
            };
        },
        setListSelected(state, action) {
            const tempListSeatSelected = action.payload;
            let totalPayment = tempListSeatSelected.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price;
            }, 0);
            return {
                ...state,
                listSeatSelected: tempListSeatSelected,
                totalPayment: totalPayment,
            };
        },
        setActiveDate(state, action) {
            // const screeningArr = state.movieInfo.screenings.filter((item) =>
            //     checkActiveDate(action.payload, item.screening_start),
            // );
            return {
                ...state,
                activeDate: action.payload,
            };
        },
        setActiveScreening(state, action) {
            return {
                ...state,
                activeScreening: action.payload,
            };
        },
        setNecessaryInfoAddToCart(state, action) {
            return {
                ...state,
                activeDate: action.payload.activeDate,
                activeShowtime: action.payload.activeShowtime,
            };
        },
        setListScreening(state, action) {
            return {
                ...state,
                screenings: action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInfoAddToCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchInfoAddToCart.fulfilled, (state, action) => {
            console.log(action.payload);
            state.activeMovie = action.payload.movie.id;
            state.movieInfo = action.payload.movie;
            state.activeAuditorium = action.payload.auditoriumId;
            state.activeScreening = {
                id: action.payload.id,
                type: action.payload.type,
                screeningStart: action.payload.screeningStart,
            };
            // state.screenings = [action.payload.id];
            state.activeDate = action.payload.screeningStart.split('T')[0] + 'T00:00:00';
            state.loading = false;
        });
        builder.addCase(fetchInfoAddToCart.rejected, (state, action) => {
            console.log('Fetch add to cart info error!');
            state.loading = false;
        });
    },
});

export const addToCartActions = addToCartSlice.actions;
export default addToCartSlice;
