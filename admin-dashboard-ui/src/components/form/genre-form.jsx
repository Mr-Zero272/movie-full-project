import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, Button, Input, IconButton } from '@material-tailwind/react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { genreService } from '@/apiServices';
import { useDispatch } from 'react-redux';
import { manageActions } from '@/store/manage-slice';

export function GenreForm() {
    const [totalGenres, setTotalGenres] = useState(1);
    const [isInAddAction, setIsInAddAction] = useState(false);
    const [listGenres, setListGenres] = useState([]);
    const dispatch = useDispatch();

    const handleChangeTotalGenres = (e) => {
        setTotalGenres(e.target.value);
    };

    const handleSubmitQ = async () => {
        if (isInAddAction) {
            // submit action here
            const data = listGenres.map((item) => {
                return {
                    name: item.name,
                };
            });

            const result = await genreService.addGenres(data);
            dispatch(manageActions.notify({ type: 'success', message: result, from: 'genre' }));
        } else {
            setListGenres((prev) => {
                let tempArr = [];
                for (let i = 0; i < totalGenres; i++) {
                    tempArr.push({
                        id: 'genre' + (i + 1),
                        name: '',
                    });
                }
                // console.log(tempArr);
                return tempArr;
            });
        }
        setIsInAddAction((prev) => !prev);
    };

    const handleChangeGenreItem = (e) => {
        // console.log(e.target.name + '   ' + e.target.value);
        setListGenres((prev) => {
            let tempArray = prev.map((item) => {
                if (item.id === e.target.name) {
                    console.log('1');
                    return {
                        id: e.target.name,
                        name: e.target.value,
                    };
                } else {
                    return item;
                }
            });
            return tempArray;
        });
    };

    const generateInput = (quantity) => {
        let listInput = [];
        for (let i = 0; i < quantity; i++) {
            listInput.push(
                <div key={i}>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Name genre {i + 1}
                    </Typography>
                    <Input
                        type="text"
                        min="1"
                        max="10"
                        name={'genre' + (i + 1)}
                        value={listGenres.length !== 0 ? listGenres.find((i) => i.id === 'genre' + (i + 1))?.name : ''}
                        size="lg"
                        placeholder="Action"
                        onChange={handleChangeGenreItem}
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: 'before:content-none after:content-none',
                        }}
                    />
                </div>,
            );
        }
        return listInput;
    };

    const handleBack = () => {
        setIsInAddAction(false);
        setTotalGenres(1);
        setListGenres([]);
    };

    // console.log(listGenres);

    return (
        <form className="mt-6 mb-2 flex md:flex-row w-full items-center justify-center flex-col-reverse">
            <div className="mt-3 mb-1 flex-1 w-full flex flex-col gap-6 md:w-1/2">
                {!isInAddAction ? (
                    <>
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Total genres you want to add
                        </Typography>
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            name="totalGenres"
                            value={totalGenres}
                            size="lg"
                            placeholder="Action"
                            onChange={handleChangeTotalGenres}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: 'before:content-none after:content-none',
                            }}
                        />
                    </>
                ) : (
                    <>
                        <IconButton variant="outlined" onClick={handleBack}>
                            <ChevronLeftIcon className="w-5 h-5" />
                        </IconButton>
                        {generateInput(totalGenres)}
                    </>
                )}
                <Button className="w-40 self-end" color="green" onClick={handleSubmitQ}>
                    {isInAddAction ? 'Submit' : 'Add genres'}
                </Button>
            </div>
            <div className="flex-1 w-full ml-10 grid grid-cols-2 xl:grid-cols-2 md:w-1/2 md:gird-cols-1 gap-2">
                <figure className="relative h-48 w-full">
                    <img
                        className="h-full w-full rounded-xl object-cover object-center"
                        src="https://i.pinimg.com/originals/53/cd/7a/53cd7ad35d1b20162c612d51b5ae61f9.jpg"
                        alt="nature image"
                    />
                    <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                        <Typography variant="h5" color="blue-gray">
                            Action
                        </Typography>
                    </figcaption>
                </figure>
                <figure className="relative h-48 w-full">
                    <img
                        className="h-full w-full rounded-xl object-cover object-center"
                        src="https://i.pinimg.com/originals/e2/f7/5c/e2f75ca7947cad84d855793ed6f94a5a.jpg"
                        alt="nature image"
                    />
                    <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                        <Typography variant="h5" color="blue-gray">
                            Comedy
                        </Typography>
                    </figcaption>
                </figure>
                <figure className="relative h-48 w-full">
                    <img
                        className="h-full w-full rounded-xl object-cover object-center"
                        src="https://i.pinimg.com/originals/7f/6b/7c/7f6b7c24c81c8b1140dceaee6b79170b.jpg"
                        alt="nature image"
                    />
                    <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                        <Typography className="text-center" variant="h5" color="blue-gray">
                            Romance
                        </Typography>
                    </figcaption>
                </figure>
                <figure className="relative h-48 w-full">
                    <img
                        className="h-full w-full rounded-xl object-cover object-center"
                        src="https://i.pinimg.com/originals/61/1c/2b/611c2b5cdb72157f0494893cafc60c79.jpg"
                        alt="nature image"
                    />
                    <figcaption className="absolute bottom-8 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                        <Typography variant="h5" color="blue-gray">
                            Horror
                        </Typography>
                    </figcaption>
                </figure>
            </div>
        </form>
    );
}

GenreForm.prototype = {
    notify: PropTypes.func,
};

export default GenreForm;
