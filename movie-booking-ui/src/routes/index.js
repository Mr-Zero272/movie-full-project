//Layouts
import { AdminDefaultLayout, HeaderOnly } from '~/Layout';

//Pages
import Home from '~/pages/Home';
import Booking from '~/pages/Booking';
import Blog from '~/pages/Blog';
import Schedule from '~/pages/Schedule';
import Detail from '~/pages/Detail';
import Login from '~/pages/Login';
import Ticket from '~/pages/Ticket';
import Search from '~/pages/Search';
import Register from '~/pages/Register';
import AddToCart from '~/pages/Booking/AddToCart';
import Profile from '~/pages/Profile';
import Payment from '~/pages/Payment';
import Notify from '~/pages/Notify';
import Dashboard from '~/pages/AdminPage/dashboard';

//Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/blog', component: Blog },
    { path: '/schedule', component: Schedule },
    { path: '/detail/:movieId', component: Detail, layout: HeaderOnly },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/notify', component: Notify },
    { path: '/admin', component: Dashboard, layout: AdminDefaultLayout },
];

const privateRoutes = [
    { path: '/booking', component: Booking, layout: HeaderOnly },
    { path: '/cart', component: AddToCart, layout: HeaderOnly },
    { path: '/ticket', component: Ticket },
    { path: '/profile', component: Profile },
    { path: '/payment', component: Payment, layout: HeaderOnly },
];

export { publicRoutes, privateRoutes };