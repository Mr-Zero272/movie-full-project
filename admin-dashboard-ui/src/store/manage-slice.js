import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { genreService } from '@/apiServices';

export const fetchPaginationGenre = createAsyncThunk(
    'paginationGenre/fetch',
    async ({ q = '', size = 8, cPage = 1 }) => {
        const response = await genreService.getAllGenres(q, size, cPage);
        return response;
    },
);

const manageSlice = createSlice({
    name: 'manage',
    initialState: {
        notifyInfo: { type: 'success', message: '', from: '' },
        genre: {
            data: [],
            q: '',
            pagination: {
                size: 6,
                currentPage: 1,
                totalPage: 12,
                totalResult: 12,
            },
        },
    },
    reducers: {
        updatePaginationInfo(state, action) {
            return {
                ...state,
                [action.payload.type]: {
                    ...state[action.payload.type],
                    pagination: action.payload.pagination,
                },
            };
        },
        updateQ(state, action) {
            return {
                ...state,
                [action.payload.type]: {
                    ...state[action.payload.type],
                    q: action.payload.q,
                },
            };
        },
        updateGenreItemInData(state, action) {
            let oldGenreData = state.genre.data;
            let newGenreData = oldGenreData.filter((item) => item.id !== action.payload.id);
            return {
                ...state,
                genre: {
                    ...state.genre,
                    data: [...newGenreData, action.payload],
                },
            };
        },
        notify(state, action) {
            return {
                ...state,
                notifyInfo: action.payload,
            };
        },
        clearNotify(state) {
            return {
                ...state,
                notifyInfo: { type: 'success', message: '', from: '' },
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPaginationGenre.fulfilled, (state, action) => {
            state.genre.data = action.payload.data;
            state.genre.pagination = action.payload.pagination;
        });
    },
});

export const manageActions = manageSlice.actions;
export default manageSlice;
