import { useEffect } from 'react';
import { useFetchUserInfo } from './hooks';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth } from '@/layouts';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { userActions } from '@/store/user-slice';

const isExpired = (d1) => {
    const today = new Date();
    return d1.getTime() < today.getTime();
};

function App() {
    const _dispatch = useDispatch();
    const { userInfo, loading, error } = useFetchUserInfo();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token === '' || token === null) {
            localStorage.setItem('token', '');
            _dispatch(userActions.logout());
        } else {
            const tokenDecode = jwtDecode(token);
            if (!isExpired(new Date(tokenDecode.exp * 1000))) {
                if (error === null && userInfo !== null && userInfo !== undefined) {
                    _dispatch(
                        userActions.setUserNecessaryInfo({
                            id: userInfo.id,
                            status: 'online',
                            username: tokenDecode.sub,
                            avatar: userInfo.avatar,
                            phoneNumber: userInfo.phoneNumber,
                            email: userInfo.email,
                            role: userInfo.authorities[0].authority,
                        }),
                    );
                }
            } else {
                _dispatch(userActions.logout());
                localStorage.setItem('token', '');
            }
        }

        // return () => {
        //     dispatch(userActions.clearUserInfo());
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
            </Routes>
        </>
    );
}

export default App;
