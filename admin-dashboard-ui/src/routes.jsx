import {
    HomeIcon,
    UserCircleIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
    CommandLineIcon,
    FingerPrintIcon,
    UserGroupIcon,
} from '@heroicons/react/24/solid';
import { Home, Profile, Notifications, Customers } from '@/pages/dashboard';
import Manage from './pages/dashboard/manage/manage';
import { SignIn, SignUp } from '@/pages/auth';
import Movie from './pages/dashboard/manage/movie/movie';
import Genre from './pages/dashboard/manage/genre/genre';
import Auditorium from './pages/dashboard/manage/auditorium/auditorium';
import ForgetPass from './pages/auth/forget-pass';

const icon = {
    className: 'w-5 h-5 text-inherit',
};

export const manageAdminRoutes = [
    {
        name: 'movie',
        path: '/movie',
        element: <Movie />,
    },
    {
        name: 'genre',
        path: '/genre',
        element: <Genre />,
    },
    {
        name: 'auditorium',
        path: '/auditorium',
        element: <Auditorium />,
    },
];

export const manageMovieBusinessRoutes = [
    {
        name: 'movie',
        path: '/movie',
        element: <Movie />,
    },
    {
        name: 'genre',
        path: '/genre',
        element: <Genre />,
    },
];

export const manageRoutes = [
    {
        name: 'movie',
        path: '/movie',
        element: <Movie />,
    },
    {
        name: 'genre',
        path: '/genre',
        element: <Genre />,
    },
    {
        name: 'users',
        path: '/users',
        element: <Genre />,
    },
    {
        name: 'auditorium',
        path: '/auditorium',
        element: <Auditorium />,
    },
];

export const routes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'dashboard',
                path: '/home',
                element: <Home />,
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: <Profile />,
            },
            {
                icon: <UserGroupIcon {...icon} />,
                name: 'customers',
                path: '/customers',
                element: <Customers />,
            },
            {
                icon: <CommandLineIcon {...icon} />,
                name: 'Manage',
                path: '/manage/*',
                element: <Manage />,
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: 'notifications',
                path: '/notifications',
                element: <Notifications />,
            },
        ],
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: <SignIn />,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: 'sign up',
                path: '/sign-up',
                element: <SignUp />,
            },
            {
                icon: <FingerPrintIcon {...icon} />,
                name: 'reset password',
                path: '/reset-pass',
                element: <ForgetPass />,
            },
        ],
    },
];

export const adminRoutes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'dashboard',
                path: '/home',
                element: <Home />,
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: <Profile />,
            },
            {
                icon: <UserGroupIcon {...icon} />,
                name: 'customers',
                path: '/customers',
                element: <Customers />,
            },
            {
                icon: <CommandLineIcon {...icon} />,
                name: 'Manage',
                path: '/manage/*',
                element: <Manage routes={manageAdminRoutes} />,
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: 'notifications',
                path: '/notifications',
                element: <Notifications />,
            },
        ],
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: <SignIn />,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: 'sign up',
                path: '/sign-up',
                element: <SignUp />,
            },
            {
                icon: <FingerPrintIcon {...icon} />,
                name: 'reset password',
                path: '/reset-pass',
                element: <ForgetPass />,
            },
        ],
    },
];

export const businessRoutes = [
    {
        layout: 'dashboard',
        pages: [
            {
                icon: <HomeIcon {...icon} />,
                name: 'dashboard',
                path: '/home',
                element: <Home />,
            },
            {
                icon: <UserCircleIcon {...icon} />,
                name: 'profile',
                path: '/profile',
                element: <Profile />,
            },
            {
                icon: <CommandLineIcon {...icon} />,
                name: 'Manage',
                path: '/manage/*',
                element: <Manage routes={manageMovieBusinessRoutes} />,
            },
            {
                icon: <InformationCircleIcon {...icon} />,
                name: 'notifications',
                path: '/notifications',
                element: <Notifications />,
            },
        ],
    },
    {
        title: 'auth pages',
        layout: 'auth',
        pages: [
            {
                icon: <ServerStackIcon {...icon} />,
                name: 'sign in',
                path: '/sign-in',
                element: <SignIn />,
            },
            {
                icon: <RectangleStackIcon {...icon} />,
                name: 'sign up',
                path: '/sign-up',
                element: <SignUp />,
            },
            {
                icon: <FingerPrintIcon {...icon} />,
                name: 'reset password',
                path: '/reset-pass',
                element: <ForgetPass />,
            },
        ],
    },
];

export default routes;
