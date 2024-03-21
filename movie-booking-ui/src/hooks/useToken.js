import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

function useToken() {
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');

        if (tokenFromStorage) {
            const decodedToken = jwtDecode(tokenFromStorage);
            const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

            if (decodedToken.exp > currentTime) {
                setIsTokenValid(true);
                setToken(tokenFromStorage);
            } else {
                setIsTokenValid(false);
                setToken('');
                localStorage.removeItem('token');
            }
        } else {
            setIsTokenValid(false);
            setToken('');
        }
    }, []);

    const checkTokenValidity = () => {
        if (!token) return { isValid: false, token: '' };

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

        if (decodedToken.exp > currentTime) {
            return { isValid: true, token };
        } else {
            localStorage.removeItem('token');
            return { isValid: false, token: '' };
        }
    };

    return { isTokenValid, token, checkTokenValidity };
}

export default useToken;
