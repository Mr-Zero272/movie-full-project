import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Input,
    Textarea,
    Typography,
    Rating,
    Button,
    Tabs,
    TabsHeader,
    Tab,
    TabsBody,
    TabPanel,
    Chip,
} from '@material-tailwind/react';

import { useDropzone } from 'react-dropzone';
import { genreService, movieService } from '@/apiServices';
import { format } from 'date-fns';
import { manageActions } from '@/store/manage-slice';
import CustomLabel from '../CustomLabel';
import { movieAddFormValidation } from '@/data';

export function MovieAddForm() {
    const dispatch = useDispatch();
    const [genreData, setGenreData] = useState([]);
    const [movieTrailer, setMovieTrailer] = useState(null);
    const [actors, setActors] = useState([]);
    const [actor, setActor] = useState({ fullName: '', characterName: '', avatar: '', file: '' });
    const [movieInfo, setMovieInfo] = useState({
        title: '',
        director: '',
        description: '',
        trailer: '',
        verticalImage: '',
        horizontalImage: '',
        manufacturer: '',
        duration_min: 90,
        releaseDate: '',
        rating: 1,
        userId: '',
        genres: [],
    });
    const [specificRequireType, setSpecificRequireType] = useState({ typeName: '', nscreenings: 1 });
    const [requirement, setRequirement] = useState({
        screeningsPerWeek: 7,
        totalWeekScheduling: 1,
        specificRequireTypes: [],
    });
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [errorMessages, setErrorMessages] = useState({
        titleErrorMessage: '',
        directorErrorMessage: '',
        descriptionErrorMessage: '',
        manufacturerErrorMessage: '',
        releaseDateErrorMessage: '',
        movieImagesErrorMessage: '',
        movieTrailerErrorMessage: '',
        fullNameErrorMessage: '',
        characterNameErrorMessage: '',
        avatarErrorMessage: '',
        screeningsPerWeekErrorMessage: '',
        totalWeekSchedulingErrorMessage: '',
        typeNameErrorMessage: '',
        nscreeningsErrorMessage: '',
    });
    const subRef = useRef(null);
    const requireRef = useRef(null);
    const basicRef = useRef(null);
    const avatarInputRef = useRef(null);

    // get genre data
    useEffect(() => {
        const fetchGenreData = async () => {
            const result = await genreService.getAllGenresWithoutPagination();
            setMovieInfo((prev) => ({
                ...prev,
                genres: result.map((genre) => genre.id),
            }));
            setGenreData(result);
        };

        fetchGenreData();
    }, []);

    // handle changeTab
    const handleChangeTab = (tabIndex) => {
        if (tabIndex === 1) {
            basicRef.current.click();
            return;
        }
        if (tabIndex === 2) {
            subRef.current.click();
            return;
        }
        requireRef.current.click();
    };

    //handle choose genre
    const handleChooseGenre = (genreId) => {
        setGenreData((prev) => {
            let updateData = prev.filter((genre) => genre.id !== genreId);
            return updateData;
        });
        setMovieInfo((prev) => ({
            ...prev,
            genres: prev.genres.filter((id) => id !== genreId),
        }));
    };

    //handle input movie info change
    const handleInputChange = (e) => {
        // rating case
        if (e === 1 || e === 2 || e === 3 || e === 4 || e === 5) {
            setMovieInfo((prev) => ({
                ...prev,
                rating: e,
            }));
            return;
        }

        setMovieInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle files
    const files = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    //handle choose trailer
    const handleChooseTrailer = (e) => {
        setMovieTrailer(e.target.files[0]);
    };

    // handle actor information change
    const handleActorInfoChange = (e) => {
        if (e.target.name === 'avatar') {
            setActor((prev) => {
                if (e.target.files?.length === 0) {
                    return {
                        ...prev,
                        avatar: '',
                        file: '',
                    };
                } else {
                    return {
                        ...prev,
                        avatar: e.target.files[0].name,
                        file: e.target.files[0],
                    };
                }
            });
            return;
        }

        setActor((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle add actor
    const handleAddActor = () => {
        let countError = 0;
        for (let prop in actor) {
            // console.log(movieAddFormValidation[prop]?.blank);
            // break;
            let haveError = false;

            if (movieAddFormValidation[prop]?.patternRegex !== undefined) {
                const regex = new RegExp(movieAddFormValidation[prop].patternRegex);
                if (!regex.test(actor[prop])) {
                    console.log(actor[prop]);
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is invalid!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.maxLength !== undefined) {
                if (actor[prop]?.length > movieAddFormValidation[prop].maxLength) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'The maximum length is ' + movieAddFormValidation[prop].maxLength,
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.blank !== undefined && !movieAddFormValidation[prop]?.blank) {
                if (actor[prop]?.length === 0) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is require!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (!haveError) {
                setErrorMessages((prev) => ({
                    ...prev,
                    [prop + 'ErrorMessage']: '',
                }));
            }
        }

        if (countError !== 0) {
            return;
        }

        setActors((prev) => [...prev, actor]);
        setActor({ fullName: '', characterName: '', avatar: '', file: '' });
    };

    // delete actor in list
    const handleDeleteActor = (key) => {
        setActors((prev) => prev.filter((actor) => actor.fullName + actor.characterName !== key));
    };

    // handle change requirement
    const handleChangeRequirement = (e) => {
        setRequirement((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle change specificRequireType
    const handleChangeSpecificRequireType = (e) => {
        setSpecificRequireType((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle delete specificRequireType
    const handleDeleteSpecificRequireType = (key) => {
        setRequirement((prev) => ({
            ...prev,
            specificRequireTypes: prev.specificRequireTypes.filter((it) => it.typeName !== key),
        }));
    };

    // update specificRequireTypes
    const handleAddSpecificRequireType = () => {
        let countError = 0;
        for (let prop in specificRequireType) {
            // console.log(movieAddFormValidation[prop]?.blank);
            // break;
            let haveError = false;

            if (movieAddFormValidation[prop]?.patternRegex !== undefined) {
                const regex = new RegExp(movieAddFormValidation[prop].patternRegex);
                if (!regex.test(specificRequireType[prop])) {
                    console.log(specificRequireType[prop]);
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is invalid!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.maxLength !== undefined) {
                if (specificRequireType[prop]?.length > movieAddFormValidation[prop].maxLength) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'The maximum length is ' + movieAddFormValidation[prop].maxLength,
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.blank !== undefined && !movieAddFormValidation[prop]?.blank) {
                if (specificRequireType[prop]?.length === 0) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is require!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (!haveError) {
                setErrorMessages((prev) => ({
                    ...prev,
                    [prop + 'ErrorMessage']: '',
                }));
            }
        }

        let numScreenings = 0;

        requirement.specificRequireTypes.forEach((type) => {
            numScreenings += +type.nscreenings;
        });

        console.log(requirement.screeningsPerWeek);
        console.log(numScreenings + specificRequireType.nscreenings);

        if (
            specificRequireType.nscreenings > requirement.screeningsPerWeek ||
            numScreenings + +specificRequireType.nscreenings > requirement.screeningsPerWeek
        ) {
            setErrorMessages((prev) => ({
                ...prev,
                nscreeningsErrorMessage:
                    'The total number of screenings is being greater than the total number of screenings.',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                nscreeningsErrorMessage: '',
            }));
        }

        if (countError !== 0) {
            return;
        }

        setRequirement((prev) => {
            if (!prev.specificRequireTypes.find((item) => item.typeName === specificRequireType.typeName)) {
                return {
                    ...prev,
                    specificRequireTypes: [...prev.specificRequireTypes, specificRequireType],
                };
            } else {
                return prev;
            }
        });
        setSpecificRequireType({ typeName: '', nscreenings: 1 });
    };

    const resetAllState = async () => {
        setMovieInfo({
            title: '',
            director: '',
            description: '',
            trailer: '',
            verticalImage: '',
            horizontalImage: '',
            manufacturer: '',
            duration_min: 90,
            releaseDate: '',
            rating: 1,
            userId: '',
            genres: [],
        });
        setActors([]);
        setActor({ fullName: '', characterName: '', avatar: '', file: '' });
        setSpecificRequireType({ typeName: '', nscreenings: 1 });
        setRequirement({
            screeningsPerWeek: 7,
            totalWeekScheduling: 1,
            specificRequireTypes: [],
        });

        const result = await genreService.getAllGenresWithoutPagination();
        setMovieInfo((prev) => ({
            ...prev,
            genres: result.map((genre) => genre.id),
        }));
        setGenreData(result);
    };

    // handle submit
    const handleSubmit = async () => {
        // validate before submit
        // check normal field
        let countError = 0;
        for (let prop in movieInfo) {
            // console.log(movieAddFormValidation[prop]?.blank);
            // break;
            let haveError = false;

            if (movieAddFormValidation[prop]?.patternRegex !== undefined) {
                const regex = new RegExp(movieAddFormValidation[prop].patternRegex);
                if (!regex.test(movieInfo[prop])) {
                    console.log(movieInfo[prop]);
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is invalid!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.maxLength !== undefined) {
                if (movieInfo[prop]?.length > movieAddFormValidation[prop].maxLength) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'The maximum length is ' + movieAddFormValidation[prop].maxLength,
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.blank !== undefined && !movieAddFormValidation[prop]?.blank) {
                if (movieInfo[prop]?.length === 0) {
                    setErrorMessages((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is require!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (!haveError) {
                setErrorMessages((prev) => ({
                    ...prev,
                    [prop + 'ErrorMessage']: '',
                }));
            }
        }

        // check image field
        if (acceptedFiles?.length === 0 || acceptedFiles?.length !== 4) {
            setErrorMessages((prev) => ({
                ...prev,
                movieImagesErrorMessage: 'You need four images!',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                movieImagesErrorMessage: '',
            }));
        }

        // check trailer field
        if (movieTrailer === null) {
            setErrorMessages((prev) => ({
                ...prev,
                movieTrailerErrorMessage: 'This field is require!',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                movieTrailerErrorMessage: '',
            }));
        }

        // console.log(countError);
        // if have error break;
        if (countError !== 0) {
            return;
        }

        const formData = new FormData();
        const cast = actors.map((actor) => ({
            fullName: actor.fullName,
            characterName: actor.characterName,
            avatar: actor.avatar,
        }));
        const actorImages = actors.map((actor) => actor.file);
        movieInfo.cast = cast;
        const rDate = new Date(movieInfo.releaseDate);
        console.log(format(rDate, 'yyyy-MM-dd HH:mm'));
        movieInfo.releaseDate = format(rDate, 'yyyy-MM-dd HH:mm');
        let submitData = {
            movie: movieInfo,
            requirement: requirement,
        };
        // console.log(movieInfo);
        formData.append('movieInfo', JSON.stringify(submitData));
        acceptedFiles.forEach((mi) => {
            formData.append('movieImages', mi);
        });
        actorImages.forEach((ai) => {
            formData.append('actorImages', ai);
        });
        // formData.append('movieImages', acceptedFiles);
        formData.append('movieTrailer', movieTrailer);
        const resp = await movieService.addMovie(formData);
        // console.log(actorImages);
        // console.log(acceptedFiles);
        // console.log(submitData);
        dispatch(manageActions.notify({ type: 'success', message: resp.message, from: 'movie' }));
        resetAllState();
        basicRef.current.click();
    };

    // console block
    // console.log(errorMessages);
    // console.log(requirement);

    return (
        <Tabs value="basic">
            <TabsHeader className="flex items-center justify-between flex-wrap gap-6 px-4 ">
                <Typography variant="h4" color="blue-gray">
                    Add new movie
                </Typography>
                <div className="w-96 flex">
                    <Tab value="basic" ref={basicRef}>
                        Basic info
                    </Tab>
                    <Tab value="sub" ref={subRef}>
                        Sub info
                    </Tab>
                    <Tab value="require" ref={requireRef}>
                        Requirement
                    </Tab>
                </div>
            </TabsHeader>

            <div className="flex h-full">
                <div className="hidden md:block md:flex-none md:w-1/3 h-full">
                    <img
                        className="rounded-s-lg object-cover object-center h-auto"
                        src="https://i.pinimg.com/originals/fe/a1/85/fea185a6621475e2bbdb65c24af318cd.jpg"
                        alt="left-image"
                    />
                </div>
                <div className="w-full md:flex-initial md:w-2/3 pl-6 p-4">
                    <TabsBody
                        animate={{
                            initial: { y: 250 },
                            mount: { y: 0 },
                            unmount: { y: 250 },
                        }}
                    >
                        <TabPanel value="basic">
                            <form className="mt-5 mb-2 w-full">
                                <div className="md:flex md:gap-6">
                                    <div className="md:w-1/2">
                                        <CustomLabel
                                            label="Title"
                                            errorMessage={
                                                errorMessages.titleErrorMessage !== '' &&
                                                errorMessages.titleErrorMessage
                                            }
                                        />
                                        <Input
                                            size="lg"
                                            name="title"
                                            value={movieInfo.title}
                                            placeholder="Movie title..."
                                            className={`${
                                                errorMessages.titleErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.titleErrorMessage !== ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <CustomLabel
                                            label="Director"
                                            errorMessage={
                                                errorMessages.directorErrorMessage !== '' &&
                                                errorMessages.directorErrorMessage
                                            }
                                        />
                                        <Input
                                            size="lg"
                                            name="director"
                                            value={movieInfo.director}
                                            placeholder="Movie director..."
                                            className={`${
                                                errorMessages.directorErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.directorErrorMessage !== ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <CustomLabel
                                    label="Description"
                                    className="mt-3"
                                    errorMessage={
                                        errorMessages.descriptionErrorMessage !== '' &&
                                        errorMessages.descriptionErrorMessage
                                    }
                                />
                                <Textarea
                                    name="description"
                                    value={movieInfo.description}
                                    className={`${
                                        errorMessages.descriptionErrorMessage !== ''
                                            ? '!border-t-red-400 focus:!border-t-red-600'
                                            : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                    }`}
                                    placeholder="Description..."
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    error={errorMessages.descriptionErrorMessage !== ''}
                                    onChange={handleInputChange}
                                />
                                <div className="2xl:flex 2xl:gap-6 mt-3">
                                    <div className="2xl:w-1/3">
                                        <CustomLabel
                                            label="Manufacturer"
                                            errorMessage={
                                                errorMessages.manufacturerErrorMessage !== '' &&
                                                errorMessages.manufacturerErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            size="lg"
                                            value={movieInfo.manufacturer}
                                            name="manufacturer"
                                            placeholder="Manufacturer..."
                                            className={`${
                                                errorMessages.manufacturerErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.manufacturerErrorMessage !== ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <CustomLabel label="Duration (min)" />
                                        <Input
                                            type="number"
                                            min="1"
                                            max="999"
                                            size="lg"
                                            name="duration_min"
                                            value={movieInfo.duration_min}
                                            placeholder="Duration..."
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1"
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <CustomLabel
                                            label="Release date"
                                            errorMessage={
                                                errorMessages.releaseDateErrorMessage !== '' &&
                                                errorMessages.releaseDateErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            type="date"
                                            size="lg"
                                            name="releaseDate"
                                            value={movieInfo.releaseDate}
                                            className={`${
                                                errorMessages.releaseDateErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.releaseDateErrorMessage !== ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Rating
                                    </Typography>
                                    <Rating
                                        unratedColor="amber"
                                        title="rating"
                                        value={movieInfo.rating}
                                        onChange={handleInputChange}
                                        ratedColor="amber"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3 mt-4">
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Genres:
                                    </Typography>
                                    {genreData?.length !== 0 &&
                                        genreData.map((genre) => (
                                            <Chip
                                                key={genre.id}
                                                className="w-auto h-8"
                                                value={genre.name}
                                                onClose={() => handleChooseGenre(genre.id)}
                                            />
                                        ))}
                                </div>

                                <Button className="mt-5" variant="outlined" onClick={() => handleChangeTab(2)}>
                                    Next
                                </Button>
                            </form>
                        </TabPanel>
                        <TabPanel value="sub">
                            <form className="mt-5 mb-2 w-full">
                                <CustomLabel
                                    label="Images"
                                    errorMessage={
                                        errorMessages.movieImagesErrorMessage !== '' &&
                                        errorMessages.movieImagesErrorMessage
                                    }
                                />
                                <section
                                    className={`border-2 rounded-md border-gray-400 p-3 mt-1 ${
                                        errorMessages.movieImagesErrorMessage !== '' && 'border-red-400'
                                    } `}
                                >
                                    <div {...getRootProps({ className: 'dropzone h-24' })}>
                                        <input {...getInputProps()} name="movieImages" className="" />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                    <aside>
                                        <h4>Files</h4>
                                        <ul>{files}</ul>
                                    </aside>
                                </section>
                                <CustomLabel
                                    label="Trailer"
                                    className="mt-3"
                                    errorMessage={
                                        errorMessages.movieTrailerErrorMessage !== '' &&
                                        errorMessages.movieTrailerErrorMessage
                                    }
                                />
                                <Input
                                    type="file"
                                    size="lg"
                                    name="movieTrailer"
                                    accept="video/mp4"
                                    className={`${
                                        errorMessages.movieTrailerErrorMessage !== ''
                                            ? '!border-t-red-400 focus:!border-t-red-600'
                                            : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                    }`}
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    error={errorMessages.movieTrailerErrorMessage !== ''}
                                    onChange={handleChooseTrailer}
                                />

                                <div className="flex flex-wrap gap-3 mt-4">
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Actors:
                                    </Typography>
                                    {actors?.length !== 0 &&
                                        actors &&
                                        actors.map((actor) => (
                                            <Chip
                                                key={actor.characterName}
                                                color="blue"
                                                value={actor.fullName}
                                                className="w-auto h-8"
                                                onClose={() => handleDeleteActor(actor.fullName + actor.characterName)}
                                            />
                                        ))}
                                </div>

                                <div className="2xl:flex 2xl:gap-6 mt-3">
                                    <div className="2xl:w-1/3">
                                        <CustomLabel
                                            label="Actor name"
                                            errorMessage={
                                                errorMessages.fullNameErrorMessage !== '' &&
                                                errorMessages.fullNameErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            size="lg"
                                            name="fullName"
                                            placeholder="Actor name..."
                                            value={actor.fullName}
                                            className={`${
                                                errorMessages.fullNameErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.fullNameErrorMessage !== ''}
                                            onChange={handleActorInfoChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <CustomLabel
                                            label="Character name"
                                            errorMessage={
                                                errorMessages.characterNameErrorMessage !== '' &&
                                                errorMessages.characterNameErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            size="lg"
                                            name="characterName"
                                            value={actor.characterName}
                                            placeholder="Character name..."
                                            className={`${
                                                errorMessages.characterNameErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.characterNameErrorMessage !== ''}
                                            onChange={handleActorInfoChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <CustomLabel
                                            label="Actor avatar"
                                            errorMessage={
                                                errorMessages.avatarErrorMessage !== '' &&
                                                errorMessages.avatarErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            ref={avatarInputRef}
                                            type="file"
                                            size="lg"
                                            name="avatar"
                                            accept="image/*"
                                            className={`${
                                                errorMessages.avatarErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.avatarErrorMessage !== ''}
                                            onChange={handleActorInfoChange}
                                        />
                                    </div>
                                </div>

                                <Button color="green" className="mt-5" onClick={handleAddActor}>
                                    Add actor
                                </Button>
                                <div>
                                    <Button className="mt-5" variant="outlined" onClick={() => handleChangeTab(1)}>
                                        Prev
                                    </Button>
                                    <Button className="mt-5 ml-3" variant="outlined" onClick={() => handleChangeTab(3)}>
                                        Next
                                    </Button>
                                </div>
                            </form>
                        </TabPanel>
                        <TabPanel value="require">
                            <form className="mt-5 mb-2 w-full">
                                <div className="md:flex md:gap-6">
                                    <div className="md:w-1/2">
                                        <CustomLabel label="Screenings Per Week" />
                                        <Input
                                            type="number"
                                            min="7"
                                            max="999"
                                            size="lg"
                                            name="screeningsPerWeek"
                                            value={requirement.screeningsPerWeek}
                                            placeholder="1..."
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1"
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            onChange={handleChangeRequirement}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <CustomLabel label="Total Week Scheduling" />
                                        <Input
                                            type="number"
                                            min="1"
                                            max="4"
                                            size="lg"
                                            name="totalWeekScheduling"
                                            value={requirement.totalWeekScheduling}
                                            placeholder="1..."
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1"
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            onChange={handleChangeRequirement}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Types:
                                    </Typography>
                                    {requirement.specificRequireTypes?.length !== 0 &&
                                        requirement.specificRequireTypes.map((item) => (
                                            <Chip
                                                key={item.typeName + ' - ' + item.nscreenings}
                                                color="blue"
                                                value={item.typeName + ' - ' + item.nscreenings}
                                                className="w-auto h-8"
                                                onClose={() => handleDeleteSpecificRequireType(item.typeName)}
                                            />
                                        ))}
                                </div>
                                <div className="md:flex md:gap-6">
                                    <div className="md:w-1/2">
                                        <CustomLabel
                                            label="Type Name"
                                            errorMessage={
                                                errorMessages.typeNameErrorMessage !== '' &&
                                                errorMessages.typeNameErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            size="lg"
                                            name="typeName"
                                            value={specificRequireType.typeName}
                                            placeholder="Type Name..."
                                            className={`${
                                                errorMessages.typeNameErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.typeNameErrorMessage !== ''}
                                            onChange={handleChangeSpecificRequireType}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <CustomLabel
                                            label="Total Screenings"
                                            errorMessage={
                                                errorMessages.nscreeningsErrorMessage !== '' &&
                                                errorMessages.nscreeningsErrorMessage
                                            }
                                            displayErrorMessage={false}
                                        />
                                        <Input
                                            type="number"
                                            min={1}
                                            size="lg"
                                            name="nscreenings"
                                            value={specificRequireType.nscreenings}
                                            placeholder="1..."
                                            className={`${
                                                errorMessages.nscreeningsErrorMessage !== ''
                                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                            }`}
                                            labelProps={{
                                                className: 'before:content-none after:content-none',
                                            }}
                                            error={errorMessages.nscreeningsErrorMessage !== ''}
                                            onChange={handleChangeSpecificRequireType}
                                        />
                                    </div>
                                </div>

                                <Button className="mt-5 block" onClick={handleAddSpecificRequireType}>
                                    Add type
                                </Button>

                                <Button className="mt-5" variant="outlined" onClick={() => handleChangeTab(2)}>
                                    Prev
                                </Button>
                                <Button className="mt-5 ml-3" color="green" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </form>
                        </TabPanel>
                    </TabsBody>
                </div>
            </div>
        </Tabs>
    );
}

export default MovieAddForm;
