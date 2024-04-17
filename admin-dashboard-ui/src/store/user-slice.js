import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/apiServices';

export const fetchUserInfo = createAsyncThunk('fetchUserInfo/fetch', async (token = '') => {
    if (token === '') {
        console.log('Token is null!');
        return;
    }
    const response = await authService.getUserInfo(token);
    return response;
});

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
    extraReducers: (builder) => {
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.status = 'online';
            state.avatar = action.payload.avatar;
            state.username = action.payload.username;
            state.phone = action.payload.phoneNumber;
            state.email = action.payload.email;
            state.role = action.payload.authorities[0].authority;
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            console.log('error');
        });
    },
});

export const userActions = userSlice.actions;
export default userSlice;
