import { useLocation, Link, useNavigate } from 'react-router-dom';
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
    List,
    ListItem,
    Card,
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
import { useSelector } from 'react-redux';
import { pathNavAdmin, pathNavBusiness } from '@/data';
import { useEffect, useRef, useState } from 'react';

export function DashboardNavbar() {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialTailwindController();
    const { fixedNavbar, openSidenav } = controller;
    const { pathname } = useLocation();
    const [layout, ...pages] = pathname.split('/').filter((el) => el !== '');
    const currentUser = useSelector((state) => state.user);
    const searchData = currentUser.role === 'ADMIN' ? pathNavAdmin : pathNavBusiness;
    const menuSearchRef = useRef(null);
    const [searchInfo, setSearchInfo] = useState(() => ({
        q: '',
        data: [],
        isFocus: false,
    }));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuSearchRef.current && !menuSearchRef.current.contains(event.target)) {
                setSearchInfo((prev) => ({
                    ...prev,
                    isFocus: false,
                })); // Replace setIsMenuOpen with your state setter
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterSearchResults = (inputValue) => {
        if (inputValue === '') return [];
        return searchData.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    const handleSearchInputChange = (e) => {
        setSearchInfo((prev) => {
            const data = filterSearchResults(e.target.value);
            return {
                ...prev,
                q: e.target.value,
                data: data,
                isFocus: true,
            };
        });
    };

    const handleSearchMenuItemClick = (navigateTo) => {
        navigate(navigateTo);
        setSearchInfo(() => ({
            q: '',
            data: [],
            isFocus: false,
        }));
    };

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
                        <Link to={`/${layout}/${pages[0] === 'manage' ? 'manage/' + pages[1] : pages[0]}`}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                                {pages[0]}
                            </Typography>
                        </Link>
                        {pages.slice(1, pages.length).map((page) => (
                            <Typography key={page} variant="small" color="blue-gray" className="font-normal">
                                {page}
                            </Typography>
                        ))}
                    </Breadcrumbs>
                    <Typography variant="h6" color="blue-gray">
                        {pages[0]}
                    </Typography>
                </div>
                <div className="flex items-center">
                    <div className="relative mr-auto md:mr-4 md:w-60">
                        <Input
                            label="search"
                            value={searchInfo.q}
                            onChange={handleSearchInputChange}
                            onFocus={() => setSearchInfo((prev) => ({ ...prev, isFocus: true }))}
                        />
                        {searchInfo.data?.length !== 0 && searchInfo.isFocus && (
                            <Card ref={menuSearchRef} className="w-full absolute z-50">
                                <List>
                                    {searchInfo.data.map((it) => (
                                        <ListItem
                                            key={it.label}
                                            className="w-full"
                                            onClick={() => handleSearchMenuItemClick(it.value)}
                                        >
                                            {it.label}
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        )}
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
