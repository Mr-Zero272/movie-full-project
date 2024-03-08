import { faSquareCheck, faUser } from '@fortawesome/free-regular-svg-icons';
import {
    faChartColumn,
    faLayerGroup,
    faRightFromBracket,
    faRightToBracket,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SidebarAdminMenuData = [
    {
        title: 'Dashboard',
        icon: <FontAwesomeIcon className="size-8" icon={faChartColumn} />,
        value: 'dashboard',
        dropdownMenu: [],
    },
    {
        title: 'Table',
        icon: <FontAwesomeIcon className="size-8" icon={faLayerGroup} />,
        value: 'table',
        dropdownMenu: [
            {
                title: 'Book',
                value: 'book',
            },
            {
                title: 'Author',
                value: 'author',
            },
            {
                title: 'Genre',
                value: 'genre',
            },
            {
                title: 'Voucher',
                value: 'voucher',
            },
        ],
    },
    {
        title: 'Todo',
        icon: <FontAwesomeIcon className="size-8" icon={faSquareCheck} />,
        value: 'todo',
        dropdownMenu: [],
    },
    {
        title: 'Users',
        icon: <FontAwesomeIcon className="size-8" icon={faUser} />,
        value: 'users',
        dropdownMenu: [],
        separate: true,
    },
    {
        title: 'SignIn',
        value: 'signIn',
        icon: <FontAwesomeIcon className="size-8" icon={faRightToBracket} />,
        dropdownMenu: [],
    },
    {
        title: 'SignUp',
        value: 'signUp',
        icon: <FontAwesomeIcon className="size-8" icon={faUserPlus} />,
        dropdownMenu: [],
    },
    {
        title: 'Logout',
        value: 'logout',
        icon: <FontAwesomeIcon className="size-8" icon={faRightFromBracket} />,
        dropdownMenu: [],
    },
];
