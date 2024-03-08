import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const deF = (e) => {};

function SideBarMenuItem({
    title,
    icon,
    value,
    separate,
    dropdownMenu,
    active,
    onClick = deF,
    openDropDownMenu = false,
    ...passProps
}) {
    // const [isnDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

    // const handleMenuClick = () => {
    //     setIsDropdownMenuOpen((prev) => !prev);
    // };
    const handleClick = () => {
        onClick(value);
    };

    const props = {
        onClick,
        ...passProps,
    };

    let MyLi = 'button';
    if (dropdownMenu?.length === 0) {
        MyLi = Link;
        props.to = '/admin/' + value;
    }

    return (
        <li className={`relative ${separate && 'pb-2 border-b'}`} onClick={handleClick}>
            <MyLi
                className={`relative flex items-center w-full text-3xl px-4 py-3 text-gray-900 transition duration-75 rounded-lg group hover:bg-primary-hover dark:text-white dark:hover:bg-gray-700`}
                {...props}
            >
                <div
                    className={`flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white ${
                        active && 'text-primary-normal'
                    }`}
                >
                    {icon}
                </div>
                <span className="absolute left-20 p-1 px-1.5 rounded-md whitespace-nowrap text-xl text-white bg-gray-800 hidden group-hover:inline-block group-focus:hidden duration-150 lg:group-hover:hidden">
                    {title}
                </span>
                <span
                    className={`block sm:hidden lg:block flex-1 ms-7 text-left rtl:text-right whitespace-nowrap group-hover:text-white ${
                        active && 'text-primary-normal'
                    }`}
                >
                    {title}
                </span>
                {dropdownMenu?.length !== 0 && (
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`hidden lg:block size-4 group-hover:text-white ${active && 'text-white'}`}
                    />
                )}
            </MyLi>
            {dropdownMenu?.length !== 0 && openDropDownMenu && (
                <ul className="relative top-0 left-0  rounded-none bg-transparent shadow-none sm:absolute sm:top-12 sm:left-24 sm:rounded-lg sm:bg-white sm:shadow-md py-3 space-y-2 text-2xl lg:relative lg:top-0 lg:left-0  lg:rounded-none lg:bg-transparent lg:shadow-none lg:text-3xl text-gray-400">
                    {dropdownMenu.map((item, index) => (
                        <li key={index + 272 + item.value}>
                            <Link
                                to={'/admin/' + value + '/' + item.value}
                                className={`flex items-center w-full p-3 text-3xl text-gray-900 transition duration-75 rounded-lg group hover:bg-primary-hover dark:text-white dark:hover:bg-gray-700`}
                            >
                                <div
                                    className={`block sm:hidden lg:block flex-shrink-0 size-7 text-gray-500 transition duration-75 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white ${
                                        active && 'text-primary-normal'
                                    }`}
                                ></div>
                                <span
                                    className={`flex-1 ms-0 xl:ms-7 text-gray-500 text-left rtl:text-right whitespace-nowrap group-hover:text-white ${
                                        active && 'text-primary-normal'
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

SideBarMenuItem.defaultProps = {
    onClick: deF,
};

SideBarMenuItem.prototype = {
    title: PropTypes.string,
    icon: PropTypes.node,
    value: PropTypes.string,
    separate: PropTypes.bool,
    dropdownMenu: PropTypes.array,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};

export default SideBarMenuItem;
