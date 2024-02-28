import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ProfileInputText from './ProfileInputText';
import TitleHeadingPage from '~/components/TitleHeadingPage';
import Button from '~/components/Button';
import useFetchUserInfo from '~/hooks/useFetchUserInfo';
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu';
import { DropdownMenuProfileData } from '~/Data';
import ProfileDetail from './ProfileDetail';
import { useSelector } from 'react-redux';

function Profile() {
    const userInfo = useSelector((state) => state.user);
    console.log(userInfo);
    // const [isEdit, setIsEdit] = useState(false);
    // const [isEditImage] = useState(false);
    // const { userInfo, loading, error } = useFetchUserInfo();
    const [activeMenu, setActiveMenu] = useState(() => DropdownMenuProfileData[0].name);
    const [activeTagMenu, setActiveTagMenu] = useState(() => DropdownMenuProfileData[0].menu[0].value);
    // useEffect(() => {
    //     setUserDetail((prev) => ({
    //         ...prev,
    //         ...userInfo,
    //     }));
    // }, [userInfo]);

    // const handleSubmit = useCallback(
    //     (isEdit) => {
    //         if (!isEdit) {
    //             // check mail valid
    //             if (isValidEmail(userDetail.email) === false) {
    //                 setUserDetail((prev) => ({
    //                     ...prev,
    //                     emailErrorMessage: 'This email is not valid!',
    //                 }));
    //                 return;
    //             } else {
    //                 setUserDetail((prev) => ({
    //                     ...prev,
    //                     emailErrorMessage: '',
    //                 }));
    //             }

    //             // check phone valid
    //             if (isVietnamesePhoneNumber(userDetail.phone) === false) {
    //                 setUserDetail((prev) => ({
    //                     ...prev,
    //                     phoneErrorMessage: 'This phone number is not valid!',
    //                 }));
    //                 return;
    //             } else {
    //                 setUserDetail((prev) => ({
    //                     ...prev,
    //                     phoneErrorMessage: '',
    //                 }));
    //             }
    //             const id = toast.loading('Please wait...');
    //             // if both is validation continue
    //             if (isValidEmail(userDetail.email) && isVietnamesePhoneNumber(userDetail.phone)) {
    //                 const fetchApi = async () => {
    //                     const token = localStorage.getItem('token');
    //                     const formData = new FormData();
    //                     formData.append('newUsername', userDetail.username);
    //                     formData.append('newEmail', userDetail.email);
    //                     formData.append('newPhoneNumber', userDetail.phone);
    //                     const result = await userService.updateUserInfo(token, formData);
    //                     //console.log(result);
    //                     if (result.message === 'success') {
    //                         localStorage.setItem('token', result.token);
    //                         //console.log(result.token);
    //                         const newUserInfo = await userService.getCurrentUser(result.token);
    //                         setUserDetail((prev) => ({
    //                             ...prev,
    //                             ...newUserInfo,
    //                         }));
    //                     }
    //                     //console.log(result);
    //                 };

    //                 fetchApi();
    //                 setUserDetail((prev) => ({
    //                     ...prev,
    //                     emailErrorMessage: '',
    //                     phoneErrorMessage: '',
    //                 }));
    //                 setIsEdit(isEdit);
    //             }
    //             setTimeout(() => {
    //                 toast.update(id, {
    //                     render: 'Update successfully!',
    //                     type: 'success',
    //                     closeOnClick: true,
    //                     isLoading: false,
    //                     autoClose: 2000,
    //                 });
    //             }, 1000);
    //         } else {
    //             setIsEdit(isEdit);
    //         }
    //     },
    //     [userDetail],
    // );
    // console.log(userInfo);

    const handleChooseMenu = (menuName) => {
        setActiveMenu(menuName);
    };

    const handleSelectMenu = (menuTagName) => {
        setActiveTagMenu(menuTagName);
    };

    // console.log(activeTagMenu);

    // console.log(activeTagMenu);

    return (
        <div className="bg-white w-full h-full py-10 px-10 flex flex-col xl:flex-row xl:px-60 xl:bg-gray-100">
            <div className="flex flex-col mt-6 p-10 border-b xl:w-1/5 sm:flex-row xl:flex-col xl:mt-0">
                <div className="flex pr-3 w-72">
                    <div>
                        <img className="w-20 h-20 object-cover rounded-full" src={userInfo.avatar} />
                    </div>

                    <div className="ml-7">
                        <div className="font-bold">{userInfo.username}</div>
                        <div>
                            <button className="flex justify-center items-center text-gray-500">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2"
                                >
                                    <path
                                        d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                                        fill="#9B9B9B"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                                Edit profile
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-16 ml-0 sm:mt-0 sm:ml-20 xl:mt-16 xl:ml-0">
                    {DropdownMenuProfileData.map((item) => (
                        <DropdownMenu
                            key={item.name}
                            {...item}
                            isFocus={activeMenu === item.name}
                            onClick={handleChooseMenu}
                            onSelect={handleSelectMenu}
                        />
                    ))}
                </div>
            </div>
            <div className="xl:w-4/5 h-5/6 bg-white">{activeTagMenu === 'profile' && <ProfileDetail />}</div>
        </div>
    );
}

export default Profile;
