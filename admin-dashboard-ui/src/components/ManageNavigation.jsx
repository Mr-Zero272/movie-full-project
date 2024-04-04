import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@material-tailwind/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ManageNavigation({ data }) {
    const [animate, setAnimate] = useState('animate-fade-down');
    const navigate = useNavigate();
    const { pathname } = useLocation();
    // console.log(pathname.slice(pathname.lastIndexOf('/') + 1));
    const [activePage, setActivePage] = useState(() => {
        const name = pathname.slice(pathname.lastIndexOf('/') + 1);
        let indexPath = 0;
        data.forEach((element, index) => {
            if (element.name === name) {
                indexPath = index;
            }
        });
        return indexPath;
    });
    const cPathName = pathname.slice(0, pathname.lastIndexOf('/'));

    const handleUpClick = () => {
        setActivePage((prev) => {
            if (prev - 1 < 0) {
                navigate(cPathName + data[data.length - 1].path);
                return data.length - 1;
            }
            navigate(cPathName + data[prev - 1].path);
            return prev - 1;
        });
        setAnimate('animate-fade-up');
    };

    const handleDownClick = () => {
        setActivePage((prev) => {
            if (prev + 1 > data.length - 1) {
                navigate(cPathName + data[0].path);
                return 0;
            }
            navigate(cPathName + data[prev + 1].path);
            return prev + 1;
        });
        setAnimate('animate-fade-down');
    };
    return (
        <div className="absolute top-20 w-40 right-0 z-20 p-3 bg-transparent">
            <div className="flex flex-col items-center">
                <Tooltip content="Prev page" placement="top">
                    <div className="p-2 rounded-full hover:bg-gray-200" onClick={handleUpClick}>
                        <ChevronUpIcon className="w-7 h-7 cursor-pointer" />
                    </div>
                </Tooltip>
                <p
                    key={data[activePage].name}
                    className={`capitalize text-lg font-semibold select-none py-2 text-gray-500 ${animate}`}
                >
                    {data[activePage].name}
                </p>
                <Tooltip content="Next page" placement="bottom">
                    <div className="p-2 rounded-full hover:bg-gray-200" onClick={handleDownClick}>
                        <ChevronDownIcon className="w-7 h-7 cursor-pointer" />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}

export default ManageNavigation;
