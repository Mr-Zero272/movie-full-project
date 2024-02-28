import { useState } from 'react';
import jwtDecode from 'jwt-decode';

function useToken() {
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const isExpired = (d1) => {
        const today = new Date();
        return d1.getTime() < today.getTime();
    };

    if (token === '' || token === null) {
        localStorage.setItem('token', '');
        setIsTokenValid(false);
    } else {
        const tokenDecode = jwtDecode(token);
        if (isExpired(new Date(tokenDecode.exp * 1000))) {
            setToken('');
            setIsTokenValid(false);
            localStorage.setItem('token', '');
        }
    }
    return { isTokenValid, token };
}

export default useToken;
