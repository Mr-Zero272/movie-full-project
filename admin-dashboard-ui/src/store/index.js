import { configureStore } from '@reduxjs/toolkit';
import manageSlice from '@/store/manage-slice';
import userSlice from '@/store/user-slice';

const store = configureStore({
    reducer: {
        manage: manageSlice.reducer,
        user: userSlice.reducer,
    },
});

export default store;
