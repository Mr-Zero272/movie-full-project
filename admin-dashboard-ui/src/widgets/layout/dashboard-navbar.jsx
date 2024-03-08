import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Navbar,
    Typography,
    Button,
    IconButton,
    Breadcrumbs,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from '@material-tailwind/react';
import {
    UserCircleIcon,
    Cog6ToothIcon,
    BellIcon,
    ClockIcon,
    CreditCardIcon,
    Bars3Icon,
} from '@heroicons/react/24/solid';
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from '@/context';
import { jwtDecode } from 'jwt-decode';
import useFetchUserInfo from '@/hooks/useFetchUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '@/store/user-slice';

const isExpired = (d1) => {
    const today = new Date();
    return d1.getTime() < today.getTime();
};

export function DashboardNavbar() {
    const _dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);
    const [controller, dispatch] = useMaterialTailwindController();
    const { fixedNavbar, openSidenav } = controller;
    const { pathname } = useLocation();
    const [layout, page] = pathname.split('/').filter((el) => el !== '');
    const { userInfo, loading, error } = useFetchUserInfo();
    // console.log(userInfo);
    // console.log(error);
    // console.log(currentUser);

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
                            status: 'online',
                            username: tokenDecode.sub,
                            avatar: userInfo.avatar,
                            phone: userInfo.phone,
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
        <Navbar
            color={fixedNavbar ? 'white' : 'transparent'}
            className={`rounded-xl transition-all ${
                fixedNavbar ? 'sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5' : 'px-0 py-1'
            }`}
            fullWidth
            blurred={fixedNavbar}
        >
            <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                <div className="capitalize">
                    <Breadcrumbs className={`bg-transparent p-0 transition-all ${fixedNavbar ? 'mt-1' : ''}`}>
                        <Link to={`/${layout}`}>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                            >
                                {layout}
                            </Typography>
                        </Link>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            {page}
                        </Typography>
                    </Breadcrumbs>
                    <Typography variant="h6" color="blue-gray">
                        {page}
                    </Typography>
                </div>
                <div className="flex items-center">
                    <div className="mr-auto md:mr-4 md:w-56">
                        <Input label="Search" />
                    </div>
                    <IconButton
                        variant="text"
                        color="blue-gray"
                        className="grid xl:hidden"
                        onClick={() => setOpenSidenav(dispatch, !openSidenav)}
                    >
                        <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
                    </IconButton>
                    {currentUser.status === 'logout' ? (
                        <Link to="/auth/sign-in">
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="hidden items-center gap-1 px-4 xl:flex normal-case"
                            >
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                                Sign In
                            </Button>
                            <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
                                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                            </IconButton>
                        </Link>
                    ) : (
                        <>
                            <Link to="/dashboard/profile">
                                <Button
                                    variant="text"
                                    color="blue-gray"
                                    className="hidden items-center gap-1 px-4 xl:flex normal-case"
                                >
                                    <Avatar
                                        src={currentUser.avatar}
                                        alt="avatar"
                                        withBorder={true}
                                        className="h-5 w-5 grid"
                                    />
                                    {currentUser.username}
                                </Button>

                                <Avatar
                                    src={currentUser.avatar}
                                    alt="avatar"
                                    withBorder={true}
                                    className="h-5 w-5 grid xl:hidden"
                                />
                            </Link>

                            <Menu>
                                <MenuHandler>
                                    <IconButton variant="text" color="blue-gray">
                                        <BellIcon className="h-5 w-5 text-blue-gray-500" />
                                    </IconButton>
                                </MenuHandler>
                                <MenuList className="w-max border-0">
                                    <MenuItem className="flex items-center gap-3">
                                        <Avatar
                                            src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                                            alt="item-1"
                                            size="sm"
                                            variant="circular"
                                        />
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                                                <strong>New message</strong> from Laur
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="flex items-center gap-1 text-xs font-normal opacity-60"
                                            >
                                                <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                                            </Typography>
                                        </div>
                                    </MenuItem>
                                    <MenuItem className="flex items-center gap-4">
                                        <Avatar
                                            src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                                            alt="item-1"
                                            size="sm"
                                            variant="circular"
                                        />
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                                                <strong>New album</strong> by Travis Scott
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="flex items-center gap-1 text-xs font-normal opacity-60"
                                            >
                                                <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                                            </Typography>
                                        </div>
                                    </MenuItem>
                                    <MenuItem className="flex items-center gap-4">
                                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                                            <CreditCardIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                                                Payment successfully completed
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="flex items-center gap-1 text-xs font-normal opacity-60"
                                            >
                                                <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                                            </Typography>
                                        </div>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    )}

                    <IconButton variant="text" color="blue-gray" onClick={() => setOpenConfigurator(dispatch, true)}>
                        <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                    </IconButton>
                </div>
            </div>
        </Navbar>
    );
}

DashboardNavbar.displayName = '/src/widgets/layout/dashboard-navbar.jsx';

export default DashboardNavbar;
