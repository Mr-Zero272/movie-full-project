import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Card, CardBody, Typography, CardFooter, Button, Input } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useCheckValidInput, useNotify } from '@/hooks';
import { authService } from '@/apiServices';
import { userActions } from '@/store/user-slice';

const validation = {
    phoneNumber: {
        patternRegex: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        errorMessage: 'Invalid phone number!',
        maxLength: 10,
    },
    email: {
        patternRegex: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,
        errorMessage: 'Invalid email!',
        maxLength: 150,
    },
};

export function ProfileEditModal({ isOpen, onToggle, onSubmit, onChange }) {
    const dispatch = useDispatch();
    const checkValidInput = useCheckValidInput();
    const currentUser = useSelector((state) => state.user);
    const [editUserInfo, setEditUserInfo] = useState(() => ({ email: '', phoneNumber: '' }));
    const [errorMessage, setErrorMessage] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const notify = useNotify();
    useEffect(() => {
        setEditUserInfo((prev) => ({
            ...prev,
            ...currentUser,
        }));
    }, [currentUser]);

    const handleEditInputChange = (e) => {
        if (e.target.name === 'avatar') {
            setAvatarFile(e.target.files[0]);
            return;
        }
        setEditUserInfo((info) => ({
            ...info,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        const emailValid = checkValidInput(editUserInfo.email, validation.email);
        if (!emailValid.valid) {
            setErrorMessage(emailValid.messageError);
            return;
        } else {
            setErrorMessage('');
        }

        const phoneNumberValid = checkValidInput(editUserInfo.phoneNumber, validation.phoneNumber);
        if (!phoneNumberValid.valid) {
            setErrorMessage(phoneNumberValid.messageError);
            return;
        } else {
            setErrorMessage('');
        }

        const updateUserCall = async () => {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            const userInfo = {
                id: currentUser.id,
                username: currentUser.username,
                avatar: '',
                email: editUserInfo.email,
                phoneNumber: editUserInfo.phoneNumber,
            };

            if (avatarFile !== null) {
                formData.append('avatar', avatarFile);
            } else {
                formData.append('avatar', null);
            }
            formData.append('userInfo', JSON.stringify(userInfo));
            const res = await authService.updateUserInfo(token, formData);
            if (res) {
                if (res.state === 'success') {
                    notify(res.message);
                    dispatch(
                        userActions.setUserNecessaryInfo({
                            id: res.data.id,
                            status: 'online',
                            username: res.data.username,
                            avatar: res.data.avatar,
                            phoneNumber: res.data.phoneNumber,
                            email: res.data.email,
                            role: res.data.authorities[0].authority,
                        }),
                    );
                    setEditUserInfo((prev) => ({
                        ...prev,
                        ...res.data,
                    }));
                    setAvatarFile(null);
                    onToggle();
                } else {
                    notify('Update userinfo failed!', 'error');
                }
            }
        };

        updateUserCall();
    };

    return (
        <Dialog size="xs" open={isOpen} className="bg-transparent shadow-none" handler={onToggle}>
            <Card className="mx-auto w-full max-w-[24rem]">
                <CardBody className="flex flex-col gap-4">
                    <Typography variant="h4" color="blue-gray">
                        Edit Profile
                    </Typography>
                    {errorMessage !== '' && (
                        <Typography className="text-sm italic" color="red">
                            {errorMessage}
                        </Typography>
                    )}
                    <Typography className="-mb-2" variant="h6">
                        New avatar:
                    </Typography>
                    <Input type="file" label="New avatar..." size="lg" name="avatar" onChange={handleEditInputChange} />
                    <Typography className="-mb-2" variant="h6">
                        New email:
                    </Typography>
                    <Input
                        label="New email..."
                        size="lg"
                        name="email"
                        value={editUserInfo.email}
                        onChange={handleEditInputChange}
                    />
                    <Typography className="-mb-2" variant="h6">
                        New phone number:
                    </Typography>
                    <Input
                        label="New phone number..."
                        size="lg"
                        name="phoneNumber"
                        value={editUserInfo.phoneNumber}
                        onChange={handleEditInputChange}
                    />
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="filled" size="sm" onClick={handleSubmit}>
                        Edit
                    </Button>
                    <Button variant="outlined" size="sm" onClick={onToggle}>
                        Cancel
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

ProfileEditModal.prototype = {
    isOpen: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    genreInfo: PropTypes.object.isRequired,
};

ProfileEditModal.displayName = '/src/components/Modal/ProfileEditModal.jsx';

export default ProfileEditModal;
