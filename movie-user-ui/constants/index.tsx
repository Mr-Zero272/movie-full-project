import { CalendarCheck2, House, Search, ShoppingCart, UsersRound } from 'lucide-react';

const props = { className: 'size-6' };

export const navbarLinks = [
    {
        icon: <House {...props} />,
        route: '/',
        label: 'Home',
    },
    {
        icon: <Search {...props} />,
        route: '/search',
        label: 'Movies',
    },
    {
        icon: <CalendarCheck2 {...props} />,
        route: '/schedule',
        label: 'Schedule',
    },
    {
        icon: <ShoppingCart {...props} />,
        route: '/tickets',
        label: 'Tickets',
    },
    {
        icon: <UsersRound {...props} />,
        route: '/profile',
        label: 'Profile',
    },
];
