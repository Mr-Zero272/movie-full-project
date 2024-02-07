import PropTypes from 'prop-types';
import { Dialog, Card, CardBody, Typography, CardFooter, Button, Input } from '@material-tailwind/react';
import { genreService } from '@/apiServices';
import { useDispatch } from 'react-redux';
import { manageActions } from '@/store/manage-slice';

export function GenreEditModal({ isOpen, onToggle, onSubmit, onChange, genreInfo }) {
    const dispatch = useDispatch();
    const handleSubmit = async () => {
        const rsp = await genreService.editGenre(genreInfo.id, genreInfo.name);
        // console.log(rsp);
        onToggle();
        dispatch(manageActions.updateGenreItemInData(rsp.data));
    };

    return (
        <>
            <Dialog size="xs" open={isOpen} handler={onToggle} className="bg-transparent shadow-none">
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Edit Genre
                        </Typography>
                        <Typography className="-mb-2" variant="h6">
                            New genre name:
                        </Typography>
                        <Input
                            label="New genre name..."
                            size="lg"
                            name="name"
                            value={genreInfo.name}
                            onChange={onChange}
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
        </>
    );
}

GenreEditModal.prototype = {
    isOpen: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    genreInfo: PropTypes.object.isRequired,
};

GenreEditModal.displayName = '/src/components/Modal/GenreEditModal.jsx';

export default GenreEditModal;
