import { toast } from 'react-toastify';

function useNotify() {
    const notify = (message, type = 'success', autoCloseTime = 1500) => {
        toast(message, {
            type: type,
            style: { fontSize: '1rem' },
            position: 'top-right',
            closeOnClick: true,
            autoClose: autoCloseTime,
            className: 'foo-bar',
        });
    };
    return notify;
}

export default useNotify;
