import React, { useEffect, useState } from 'react';
import SideBarMenuItem from './SideBarMenuItem';
import { SidebarAdminMenuData } from '../../../Data/SidebarAdminMenuData';
import { Link, useLocation } from 'react-router-dom';
import images from '~/assets/images';
import classNames from 'classnames';

function AdminSidebar({ onOpenSideBar, openSidebar }) {
    const [activeDropDownMenu, setActiveDropDownMenu] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const { pathname } = useLocation();
    const handleOpenMenuDropDown = (value) => {
        setActiveDropDownMenu(() => {
            if (activeDropDownMenu === value) {
                return '';
            } else {
                return value;
            }
        });
    };

    useEffect(() => {
        const partOfPathname = pathname.split('/');
        if (partOfPathname[2] !== undefined) {
            setActiveTab(partOfPathname[2]);
        } else {
            setActiveTab('dashboard');
        }
    }, [pathname]);

    return (
        <aside
            className={classNames(
                'fixed top-0 left-0 z-40 w-96 border-r h-screen transition-transform -translate-x-full sm:translate-x-0 lg:w-96 sm:w-24',
                { 'translate-x-0': openSidebar, '-translate-x-full': !onOpenSideBar },
            )}
        >
            <div className="flex flex-col place-content-between h-full px-3 py-4 bg-gray-50 dark:bg-gray-800">
                <div>
                    <div className="py-3 mb-5 flex font-bold text-3xl justify-center items-center">
                        <Link className="flex items-center text-3xl" to="/admin/dashboard">
                            <img className="size-12 lg:size-16" src={images.logo} alt="logo" />
                            <span className="block sm:hidden lg:block ms-5">
                                <span className="text-primary-normal">M</span>oonMovie
                            </span>
                        </Link>
                    </div>
                    <ul className="space-y-2 font-normal">
                        {SidebarAdminMenuData.slice(0, SidebarAdminMenuData.length - 1).map((sidebarItem, index) => (
                            <SideBarMenuItem
                                key={index}
                                {...sidebarItem}
                                active={activeTab === sidebarItem.value}
                                onClick={handleOpenMenuDropDown}
                                openDropDownMenu={sidebarItem.value === activeDropDownMenu}
                            />
                        ))}
                    </ul>
                </div>
                <ul className="space-y-2 font-normal">
                    {SidebarAdminMenuData.slice(SidebarAdminMenuData.length - 1).map((sidebarItem, index) => (
                        <SideBarMenuItem
                            key={index}
                            {...sidebarItem}
                            onClick={handleOpenMenuDropDown}
                            openDropDownMenu={sidebarItem.value === activeDropDownMenu}
                        />
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default AdminSidebar;
