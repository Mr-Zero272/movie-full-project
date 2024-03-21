//Layouts
import { HeaderOnly } from '~/Layout';

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
    { path: '/payment', component: Payment, layout: HeaderOnly },
];

const privateRoutes = [
    { path: '/booking', component: Booking, layout: HeaderOnly },
    { path: '/cart', component: AddToCart, layout: HeaderOnly },
    { path: '/ticket', component: Ticket },
    { path: '/profile', component: Profile },
];

export { publicRoutes, privateRoutes };
