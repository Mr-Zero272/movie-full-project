import React from 'react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown, faMailReply, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Menu, Transition } from '@headlessui/react';

function AdminHeader() {
    return (
        <header className="fixed w-10/12 top-0 py-5 px-6 bg-gray-50 h-24 flex place-content-between">
            <div className="relative w-1/3">
                <FontAwesomeIcon className="absolute top-5 w-6 h-6 my-auto text-gray-400 left-3" icon={faSearch} />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-primary-normal"
                />
            </div>

            <div className="flex w-1/2 justify-end">
                <div className="flex items-center">
                    <div className="relative py-1 ml-2 group">
                        <Menu>
                            <Menu.Button className="inline-flex w-full justify-center px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src="https://down-vn.img.susercontent.com/file/vn-11134233-7r98o-lnjefuceb33uc2_tn"
                                    alt="avatar"
                                />
                                <div className="ms-5 flex justify-center items-center cursor-pointer text-gray-500">
                                    <span>pitithuong</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="ml-5 size-5 text-gray-500" />
                                </div>
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    <ul
                                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownMenuIconHorizontalButton"
                                    >
                                        <Menu.Item>
                                            <button className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Profile
                                            </button>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <button className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Upgrade
                                            </button>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <button className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                Logout
                                            </button>
                                        </Menu.Item>
                                    </ul>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
                <div className="flex items-center w-36 place-content-evenly text-purple-500">
                    <div>
                        <FontAwesomeIcon icon={faMailReply} className="w-6 h-6" />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;
