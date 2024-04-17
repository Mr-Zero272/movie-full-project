import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Dialog, Card, CardBody, Typography, CardFooter, Button, Input } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

export function ProfileEditModal({ isOpen, onToggle, onSubmit, onChange }) {
    const currentUser = useSelector((state) => state.user);
    const [editUserInfo, setEditUserInfo] = useState(() => ({ email: '', phoneNumber: '' }));
    const [avatarFile, setAvatarFile] = useState(null);
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

    console.log(editUserInfo);

    return (
        <Dialog size="xs" open={isOpen} className="bg-transparent shadow-none" handler={onToggle}>
            <Card className="mx-auto w-full max-w-[24rem]">
                <CardBody className="flex flex-col gap-4">
                    <Typography variant="h4" color="blue-gray">
                        Edit Profile
                    </Typography>
                    <Typography className="-mb-2" variant="h6">
                        New avatar:
                    </Typography>
                    <Input type="file" label="New avatar..." size="lg" name="avatar" />
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
                    <Button variant="filled" size="sm">
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
