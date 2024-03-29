import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEarthAsia,
    faRightToBracket,
    faBars,
    faShareFromSquare,
    faUser,
    faTicket,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Search from '../Search';
import { userActions } from '~/store/user-slice';
import { fetchQuantityCart } from '~/store/cart-quantity';
import routes from '~/config/routes';
import useFetchUserInfo from '~/hooks/useFetchUserInfo';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            data: [
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Vietnam',
                },
            ],
        },
    },
];

const userMenu = [
    {
        icon: <FontAwesomeIcon icon={faUser} />,
        title: 'ViewProfile',
        to: '/profile',
    },
    {
        icon: <FontAwesomeIcon icon={faTicket} />,
        title: 'My ticket',
        to: '/ticket?_type=ticket&tab=1',
    },
    ...MENU_ITEMS,
    {
        icon: <FontAwesomeIcon icon={faShareFromSquare} />,
        title: 'Logout',
        action: 'logout',
        separate: true,
    },
];

const isExpired = (d1) => {
    const today = new Date();
    return d1.getTime() < today.getTime();
};
function Header({ onToggleMenu }) {
    const dispatch = useDispatch();
    const quantity = useSelector((state) => state.cartQuantity.quantity);
    const currentUser = useSelector((state) => state.user);
    const { userInfo, error } = useFetchUserInfo();
    //const avatar = useSelector((state) => state.user.avatar);
    const imageRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token === '' || token === null) {
            localStorage.setItem('token', '');
            dispatch(userActions.logout());
        } else {
            const tokenDecode = jwtDecode(token);
            if (!isExpired(new Date(tokenDecode.exp * 1000))) {
                if (error === null && userInfo !== null && userInfo !== undefined) {
                    dispatch(
                        userActions.setUserNecessaryInfo({
                            status: 'online',
                            username: tokenDecode.sub,
                            avatar: userInfo.avatar,
                            phoneNumber: userInfo.phoneNumber,
                            email: userInfo.email,
                            role: userInfo.authorities[0].authority,
                        }),
                    );
                    dispatch(fetchQuantityCart());
                }
            } else {
                dispatch(userActions.logout());
                localStorage.setItem('token', '');
            }
        }
        // return () => {
        //     dispatch(userActions.clearUserInfo());
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    //console.log(currentUser);
    //console.log(currentUser);
    //console.log(useSelector((state) => state.user.status));
    //const currentUser = true;

    const handleMenuChange = (menuItem) => {
        //console.log(menuItem);
        switch (menuItem.action) {
            case 'logout':
                dispatch(userActions.logout());
                break;
            default:
                throw new Error('Something went wrong!!!');
        }
    };

    return (
        <header className={cx('container')}>
            <nav className={cx('wrapper')}>
                <button className={cx('more-btn', 'menu-sidebar')} onClick={onToggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <Link className={cx('logo')} to={routes.home}>
                    <img src={images.logo} alt="logo" height={30} width={30} />
                    <h4 className={cx('logo-heading')}>
                        Moon <span style={{ color: 'var(--primary)' }}>M</span>ovie
                    </h4>
                </Link>
                <div className={cx('body')}>
                    <Search />
                </div>
                <div className={cx('actions')}>
                    {currentUser.status === 'online' ? (
                        <>
                            <div className={cx('action')}>
                                <Button className={cx('cart')} text to="/ticket?_type=ticket&tab=1">
                                    <p className={cx('cart_quantity')}>{quantity}</p>
                                    {/* <FontAwesomeIcon icon={faCartShopping} /> */}
                                    <img src={images.cart} alt="logo" height={30} width={30} />
                                </Button>
                            </div>
                            <div className={cx('action')}>
                                <Menu items={userMenu} onChange={handleMenuChange}>
                                    <Button to="/profile" className={cx('more-btn')}>
                                        {/* <Image className={cx('user-avatar')} src={avatar} alt="avatar" ref={imageRef} /> */}
                                        {/* <img className={cx('user-avatar')} src={avatar} alt="avatar" ref={imageRef} /> */}

                                        <img
                                            className={cx('user-avatar')}
                                            ref={imageRef}
                                            src={currentUser.avatar}
                                            alt="avatar"
                                        />

                                        {/* <img className={cx('user-avatar')} src={images.fakeAvatar} alt="avatar" /> */}
                                    </Button>
                                </Menu>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={cx('action')}>
                                <Button to={'/register'} text>
                                    Register
                                </Button>
                            </div>
                            <div className={cx('action')}>
                                <Button
                                    to={'/login'}
                                    className={cx('login-btn')}
                                    primary
                                    rightIcon={<FontAwesomeIcon icon={faRightToBracket} />}
                                >
                                    Login
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
