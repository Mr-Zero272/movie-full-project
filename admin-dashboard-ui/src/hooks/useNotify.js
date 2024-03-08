import { toast } from 'react-toastify';

function useNotify() {
    const notify = (message, type = 'success') => {
        toast(message, {
            type: type,
            style: { fontSize: '1rem' },
            position: 'top-right',
            closeOnClick: true,
            autoClose: 1500,
            className: 'foo-bar',
        });
    };
    return notify;
}

export default useNotify;
