import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

function useToken() {
    let isTokenValid = true;
    let [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        setToken(() => localStorage.getItem('token'));
    }, [token]);

    const isExpired = (d1) => {
        const today = new Date();
        return d1.getTime() < today.getTime();
    };

    if (token === '' || token === null) {
        // localStorage.setItem('token', '');
        isTokenValid = false;
    } else {
        const tokenDecode = jwtDecode(token);
        if (isExpired(new Date(tokenDecode.exp * 1000))) {
            isTokenValid = false;
            // localStorage.setItem('token', '');
        }
    }
    return { isTokenValid, token };
}

export default useToken;
