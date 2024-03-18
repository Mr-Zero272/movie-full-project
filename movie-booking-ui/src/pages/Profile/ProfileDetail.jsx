import { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import Button from '~/components/Button';
import FormInputText3 from '~/components/Form/FormInput/FormInputText3';
import useToken from '~/hooks/useToken';
import { userService } from '~/apiServices';
import { userActions } from '~/store/user-slice';
import useFetchUserInfo from '~/hooks/useFetchUserInfo';

const notify = (message, type = 'success') => {
    toast(message, {
        type: type,
        style: { fontSize: '1.4rem' },
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: true,
        autoClose: 1500,
        className: 'foo-bar',
    });
};

const validation = {
    phoneNumber: {
        patternRegex: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        errorMessage: 'Invalid phone number!',
        maxLength: 10,
    },
    email: {
        patternRegex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorMessage: 'Invalid email!',
        maxLength: 30,
    },
};

function ProfileDetail() {
    const dispatch = useDispatch();
    const { userInfo, loading, error } = useFetchUserInfo();
    const [newAvatar, setNewAvatar] = useState(null);
    const [userDetail, setUserDetail] = useState(() => ({
        username: '',
        avatar: '',
        lastUpdate: '',
        phoneNumber: '',
        email: '',
        role: '',
        emailFieldValid: true,
        phoneNumberFieldValid: true,
    }));
    const fileInputRef = useRef(null);
    const { token, isTokenValid } = useToken();

    useEffect(() => {
        return () => {
            newAvatar && URL.revokeObjectURL(newAvatar.preview);
        };
    }, [newAvatar]);

    useEffect(() => {
        setUserDetail((prev) => ({
            ...prev,
            ...userInfo,
        }));
    }, [userInfo]);

    const handleChangeImage = (e) => {
        const image = e.target.files[0];
        if (image) {
            image.preview = URL.createObjectURL(image);
            setUserDetail((prev) => ({
                ...prev,
                avatar: image.preview,
            }));
            setNewAvatar(image);
        }
    };

    const handleChooseImage = () => {
        fileInputRef.current.click();
    };

    const onValueChange = useCallback((e, isValid) => {
        setUserDetail((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            [e.target.name + 'FieldValid']: isValid,
        }));
    }, []);

    const handleSubmit = () => {
        if (!userDetail.emailFieldValid || !userDetail.phoneFieldValid) {
            alert('Invalid form!');
            return;
        }
        const updateUserCall = async () => {
            const formData = new FormData();
            const userInfo = {
                id: userDetail.id,
                username: userDetail.username,
                avatar: '',
                email: userDetail.email,
                phone: userDetail.phoneNumber,
            };

            if (newAvatar !== null) {
                formData.append('avatar', newAvatar);
            } else {
                formData.append('avatar', null);
            }
            formData.append('userInfo', JSON.stringify(userInfo));
            const res = await userService.updateUserInfo(token, formData);
            if (res) {
                if (res.state === 'success') {
                    notify(res.message);
                    dispatch(
                        userActions.setUserNecessaryInfo({
                            status: 'online',
                            username: res.data.username,
                            avatar: res.data.avatar,
                            phoneNumber: res.data.phoneNumber,
                            email: res.data.email,
                            role: res.data.authorities[0].authority,
                        }),
                    );
                    setUserDetail((prev) => ({
                        ...prev,
                        ...res.data,
                    }));
                    setNewAvatar(null);
                } else {
                    notify('Update userinfo failed!', 'error');
                }
            }
        };

        if (isTokenValid) {
            updateUserCall();
        } else {
            notify('Token is expire!', 'error');
        }
    };

    return (
        <div className="py-5 px-14">
            <div className="pb-7 border-b mb-16">
                <h2 className="text-4xl">My Profile</h2>
                <p>Manage profile information for account security</p>
            </div>
            <div className="flex flex-col-reverse lg:flex-row">
                <div className="lg:pr-10 lg:border-r lg:w-3/5">
                    <ul>
                        <li key={0} className="w-full flex my-7">
                            <div className="w-1/4 text-right text-gray-400">Username: </div>
                            <p className="w-3/4 ml-7">{userDetail.username}</p>
                        </li>
                        <li key={1} className="w-full flex my-7 text-gray-400">
                            <div className="w-1/4 text-right">Email: </div>
                            <FormInputText3
                                className="w-3/4 ml-7"
                                name="email"
                                value={userDetail.email}
                                validation={validation.email}
                                onValueChange={onValueChange}
                            />
                        </li>
                        <li key={2} className="w-full flex my-7 text-gray-400">
                            <div className="w-1/4 text-right">Phone number: </div>
                            <FormInputText3
                                className="w-3/4 ml-7"
                                name="phoneNumber"
                                value={userDetail.phoneNumber}
                                validation={validation.phoneNumber}
                                onValueChange={onValueChange}
                            />
                        </li>
                        <li key={3} className="w-full flex my-7">
                            <div className="w-1/4 text-right text-gray-400">Member: </div>
                            <p className="w-3/4 ml-7">Legend</p>
                        </li>
                        <li key={4} className="w-full flex my-7">
                            <div className="w-1/4 text-right text-gray-400">Birth: </div>
                            <p className="w-3/4 ml-7">{format(new Date('2002-07-02'), 'MMMM-dd, yyyy')}</p>
                        </li>
                        <li key={5} className="w-full flex my-7 text-gray-400">
                            <div className="w-1/4 text-right"></div>

                            <div className="w-3/4 ml-7">
                                <Button primary onClick={handleSubmit}>
                                    Save
                                </Button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="pb-5 border-b flex flex-col justify-center items-center lg:w-2/5 lg:border-b-0">
                    <img className="w-40 h-40 object-cover rounded-full mb-10" src={userDetail.avatar} />
                    <Button outline className="mb-5" onClick={handleChooseImage}>
                        Choose Image
                    </Button>
                    <input ref={fileInputRef} type="file" onChange={handleChangeImage} hidden />
                    <div className="text-left text-gray-400">
                        <p>Maximum file size 1 MB</p>
                        <p>Format: .JPEG, .JPG, .PNG</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetail;
