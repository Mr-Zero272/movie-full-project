import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatisticsCard } from '@/widgets/cards';
import {
    ChartBarIcon,
    PlusCircleIcon,
    DocumentChartBarIcon,
    UserCircleIcon,
    ArrowPathRoundedSquareIcon,
    PresentationChartBarIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/solid';
import { Typography, Alert } from '@material-tailwind/react';
import hash from 'object-hash';

import CustomTabs from '@/components/CustomTabs';
import { GenreForm } from '@/components/form';
import { GenreCustomTable } from '@/components/CustomTable';
import { fetchPaginationGenre, manageActions } from '@/store/manage-slice';
import { manageData } from '@/data';
import ManageNavigation from '@/components/ManageNavigation';
import { manageRoutes } from '@/routes';
import EditMovie from './movie/editMovie';

export function Manage() {
    const [notification, setNotification] = React.useState({ type: '', message: '' });
    const [isManagePage, setIsManagePage] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        // if (manageInfo.notifyInfo.message !== '' && manageInfo.notifyInfo.from !== '') {
        //     switch (manageInfo.notifyInfo.from) {
        //         case 'genre':
        //             const fetchInfo = {
        //                 size: 6,
        //                 q: '',
        //                 cPage: 1,
        //             };
        //             dispatch(fetchPaginationGenre({ ...fetchInfo }));
        //             break;
        //         case 'movie':
        //             break;
        //         default:
        //             throw new Error('From notify error!');
        //     }

        //     setNotification({ type: manageInfo.notifyInfo.type, message: manageInfo.notifyInfo.message });
        //     setTimeout(() => {
        //         setNotification({ type: '', message: '' });
        //         dispatch(manageActions.clearNotify());
        //     }, 2000);
        // }
        navigate('/dashboard/manage/movie');
        // return () => {
        //     setCurrentAction('');
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const listPartPath = location.pathname.split('/');
        if (listPartPath?.length > 4) {
            setIsManagePage(false);
        } else {
            setIsManagePage(true);
        }
    }, [location.pathname]);

    return (
        <div className="mt-12">
            <Alert
                className="mb-3"
                color={notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'orange' : 'red'}
                open={notification.message !== ''}
                icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
                onClose={() => setNotification({ type: '', message: '' })}
            >
                {notification.message}
            </Alert>
            {isManagePage && <ManageNavigation data={manageRoutes} />}
            {/* <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {manageDataWidgets.map(({ icon, title, footer, value, ...rest }) => (
                    <StatisticsCard
                        key={title}
                        {...rest}
                        value={value}
                        title={title}
                        icon={React.createElement(icon, {
                            className: 'w-6 h-6 text-white',
                        })}
                        footer={
                            <Typography className="font-normal text-blue-gray-600">
                                <strong className={footer.color}>{footer.value}</strong>
                                &nbsp;{footer.label}
                            </Typography>
                        }
                        onClick={() => handleActionClick(value)}
                    />
                ))}
            </div>
            <div className="mt-2">
                {currentAction !== '' && (
                    <CustomTabs key={hash(manageData[currentAction])} data={manageData[currentAction]} />
                )}
            </div> */}

            <Routes>
                {manageRoutes.map(({ name, path, element }) => (
                    <Route key={name} exact path={path} element={element} />
                ))}
                <Route exact path="/movie/edit/:movieId" element={<EditMovie />} />
            </Routes>
        </div>
    );
}

export default Manage;
