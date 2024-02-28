import { useEffect, useState } from 'react';
import * as authService from '~/apiServices/authService';
function useFetchUserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            if (token !== '') {
                const data = await authService.getUserInfo(token);
                setUserInfo(data);
                // console.log(data);
            } else {
                setError('User not login!');
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, []);
    return { userInfo, loading, error };
}

export default useFetchUserInfo;
