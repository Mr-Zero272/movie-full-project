import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        status: 'logout',
        username: '',
        avatar: '',
        lastUpdate: '',
        phone: '',
        email: '',
        role: '',
    },
    reducers: {
        setLastUpdate(state, action) {
            return {
                ...state,
                lastUpdate: action.payload,
            };
        },
        haveChange(state) {
            return state;
        },
        setAvatar(state, action) {
            return {
                ...state,
                avatar: action.payload,
            };
        },
        setUserStatus(state, action) {
            return {
                ...state,
                status: action.payload,
            };
        },
        setUsername(state, action) {
            return {
                ...state,
                username: action.payload,
            };
        },
        setRole(state, action) {
            return {
                ...state,
                role: action.payload,
            };
        },
        setUserNecessaryInfo(state, action) {
            return {
                ...state,
                status: action.payload.status,
                username: action.payload.username,
                avatar: action.payload.avatar,
                phone: action.payload.phone,
                email: action.payload.email,
                role: action.payload.role,
            };
        },
        clearUserInfo(state) {
            localStorage.setItem('token', '');
            return {
                ...state,
                status: 'logout',
                avatar: '',
                username: '',
                phone: '',
                email: '',
                role: '',
            };
        },
        logout(state) {
            localStorage.setItem('token', '');
            return {
                ...state,
                status: 'logout',
                avatar: '',
                username: '',
                phone: '',
                email: '',
                role: '',
            };
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice;
