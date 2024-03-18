import React, { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import {
    Input,
    Typography,
    Button,
    Tabs,
    TabsHeader,
    Tab,
    TabsBody,
    TabPanel,
    Chip,
    Checkbox,
} from '@material-tailwind/react';

import { genreService, movieService } from '@/apiServices';
import { format } from 'date-fns';
import CustomLabel from '../CustomLabel';
import { movieAddFormValidation } from '@/data';
import MyCustomInput from '../MyCustomInput';
import RatingStar from '../RatingStar';
import { useNotify } from '@/hooks';
import { Link } from 'react-router-dom';

const movieFields = ['title', 'director', 'description', 'manufacturer', 'duration_min', 'releaseDate', 'rating'];

export function MovieAddForm() {
    const notify = useNotify();
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
        duration_min: '90',
        releaseDate: '',
        rating: 1,
        whoAdd: '',
    });
    const [specificRequireType, setSpecificRequireType] = useState({ typeName: '', nscreenings: 1 });
    const [requirement, setRequirement] = useState({
        screeningsPerWeek: 7,
        totalWeekScheduling: 1,
        specificRequireTypes: [],
        requirementValid: true,
        requirementErrorMessage: '',
    });
    const [errorMessages, setErrorMessages] = useState({
        titleErrorMessage: '',
        directorErrorMessage: '',
        descriptionErrorMessage: '',
        manufacturerErrorMessage: '',
        duration_minErrorMessage: '',
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
        listActorErrorMessage: '',
        listCinemaTypeErrorMessage: '',
        termsErrorMessage: '',
    });
    const [isCheckTermsAndCondition, setIsCheckTermsAndCondition] = useState(false);
    const subRef = useRef(null);
    const requireRef = useRef(null);
    const basicRef = useRef(null);
    const avatarInputRef = useRef(null);
    const [listSelectedGenres, setListSelectedGenres] = useState(() => ({
        genresValid: true,
        genresErrorMessage: '',
        genres: [],
    }));
    const [listImages, setListImages] = useState(() => ({ imagesValid: true, imagesErrorMessage: '', images: [] }));

    useEffect(() => {
        return () => {
            if (listImages.images?.length !== 0) {
                listImages.images.forEach((image) => {
                    URL.revokeObjectURL(image.preview);
                });
            }
        };
    }, [listImages.images]);

    // check terms and conditions
    const handleCheckTermsAndCondition = () => {
        setIsCheckTermsAndCondition((prev) => !prev);
    };

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
    const loadGenreOptions = async (inputValue) => {
        return await genreService.searchWithTransformData(inputValue, 6, 1);
    };

    const handleChangeChooseGenre = (genreInfo) => {
        if (genreInfo?.length === 0) {
            setListSelectedGenres((prev) => ({
                ...prev,
                genres: genreInfo,
                genresValid: false,
                genreIdsErrorMessage: 'This field is required!',
            }));
        } else {
            setListSelectedGenres((prev) => ({
                ...prev,
                genres: genreInfo,
                genresValid: true,
                genreIdsErrorMessage: '',
            }));
        }
    };

    //handle input movie info change
    const handleInputChange = (e, isValid) => {
        // rating case
        if (
            e === 1 ||
            e === 2 ||
            e === 3 ||
            e === 4 ||
            e === 5 ||
            e === 6 ||
            e === 7 ||
            e === 8 ||
            e === 9 ||
            e === 10
        ) {
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

    const handleChooseImages = (e) => {
        if (e.target.files?.length === 0) {
            setListImages((prev) => ({
                ...prev,
                images: [],
                imagesValid: false,
                imagesErrorMessage: 'This filed is required!',
            }));
        } else {
            const imagesChosen = [];
            for (let i = 0; i < e.target.files?.length; i++) {
                imagesChosen.push(e.target.files[i]);
            }
            imagesChosen.map((image) => {
                image.preview = URL.createObjectURL(image);
                return image;
            });
            setListImages((prev) => ({
                ...prev,
                images: imagesChosen,
                imagesValid: true,
                imagesErrorMessage: '',
            }));
        }
    };

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

        if (
            specificRequireType.nscreenings > +requirement.screeningsPerWeek ||
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
            whoAdd: '',
        });
        setActors([]);
        setActor({ fullName: '', characterName: '', avatar: '', file: '' });
        setSpecificRequireType({ typeName: '', nscreenings: 1 });
        setRequirement({
            screeningsPerWeek: 7,
            totalWeekScheduling: 1,
            specificRequireTypes: [],
            requirementValid: true,
            requirementErrorMessage: '',
        });
        setListImages({ imagesValid: true, imagesErrorMessage: '', images: [] });
        setListSelectedGenres(() => ({
            genresValid: true,
            genresErrorMessage: '',
            genres: [],
        }));
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
        if (listImages.images?.length === 0 || listImages.images?.length !== 4) {
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

        let includesHImage = false;
        let includesVImage = false;
        for (let i = 0; i < listImages.images?.length; i++) {
            if (listImages.images[i].name.includes('h_m')) {
                includesHImage = true;
            }

            if (listImages.images[i].name.includes('v_m')) {
                includesVImage = true;
            }
        }

        if (includesHImage && includesVImage) {
            setErrorMessages((prev) => ({
                ...prev,
                movieImagesErrorMessage: '',
            }));
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                movieImagesErrorMessage: 'You need at least one vertical images and one horizontal images!',
            }));
            countError++;
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

        if (listSelectedGenres.genres?.length < 3) {
            setListSelectedGenres((prev) => ({
                ...prev,
                genresValid: false,
                genresErrorMessage: 'You need at least three genres!',
            }));
            countError++;
        } else {
            setListSelectedGenres((prev) => ({
                ...prev,
                genresValid: true,
                genresErrorMessage: '',
            }));
        }

        // check list avatar
        if (actors.length < 3) {
            setErrorMessages((prev) => ({
                ...prev,
                listActorErrorMessage: 'You need at least 3 actors!',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                listActorErrorMessage: '',
            }));
        }

        let numScreenings = 0;

        requirement.specificRequireTypes.forEach((type) => {
            numScreenings += +type.nscreenings;
        });

        // console.log(numScreenings);
        // console.log(requirement.screeningsPerWeek);

        if (requirement.specificRequireTypes.length === 0) {
            setErrorMessages((prev) => ({
                ...prev,
                listCinemaTypeErrorMessage: 'You need at least 1 cinema type!',
            }));
            countError++;
        } else if (+requirement.screeningsPerWeek - numScreenings !== 0) {
            setErrorMessages((prev) => ({
                ...prev,
                listCinemaTypeErrorMessage: 'Screening per week need to equals total screenings!',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                listCinemaTypeErrorMessage: '',
            }));
        }

        if (!isCheckTermsAndCondition) {
            setErrorMessages((prev) => ({
                ...prev,
                termsErrorMessage: 'Accept our terms and conditions here!',
            }));
            countError++;
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                termsErrorMessage: '',
            }));
        }
        // if have error break;
        if (countError !== 0) {
            return;
        }

        const formData = new FormData();
        // genre
        let listGenres = listSelectedGenres.genres.map((genre) => genre.value);
        movieInfo.genres = listGenres;

        // actors
        const cast = actors.map((actor) => ({
            fullName: actor.fullName,
            characterName: actor.characterName,
            avatar: actor.avatar,
        }));
        const actorImages = actors.map((actor) => actor.file);
        movieInfo.cast = cast;

        // release date
        const rDate = new Date(movieInfo.releaseDate);
        // console.log(format(rDate, 'yyyy-MM-dd HH:mm'));
        movieInfo.releaseDate = format(rDate, 'yyyy-MM-dd HH:mm');
        // const randomRating = Math.floor(Math.random() * 9) + 1;

        delete requirement.requirementValid;
        delete requirement.requirementErrorMessage;
        let submitData = {
            movie: movieInfo,
            requirement: requirement,
        };
        // console.log(movieInfo);
        formData.append('movieInfo', JSON.stringify(submitData));
        listImages.images.forEach((mi) => {
            formData.append('movieImages', mi);
        });
        actorImages.forEach((ai) => {
            formData.append('actorImages', ai);
        });
        // formData.append('movieImages', acceptedFiles);
        formData.append('movieTrailer', movieTrailer);
        const token = localStorage.getItem('token');
        const resp = await movieService.addMovie(formData, token);
        console.log(resp);
        // console.log(acceptedFiles);
        // console.log(submitData);
        if (resp && resp.state === 'success') {
            notify(resp.message, 'success');
        } else {
            notify('Something went wrong!', 'error');
        }
        resetAllState();
        basicRef.current.click();
    };

    // console block
    // console.log(listSelectedGenres.genres);
    console.log(isCheckTermsAndCondition);

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

            <div className="flex h-[1400px] md:h-[1200px] xl:h-[1000px]">
                <div className="hidden md:block md:flex-none md:w-1/3 h-full">
                    <img
                        className="rounded-s-lg object-center h-full"
                        src="https://i.pinimg.com/originals/fe/a1/85/fea185a6621475e2bbdb65c24af318cd.jpg"
                        alt="left-image"
                    />
                </div>
                <div className="w-full md:flex-initial md:w-2/3 pl-6 p-4 h-full">
                    <TabsBody
                        className="h-full"
                        animate={{
                            initial: { y: 250 },
                            mount: { y: 0 },
                            unmount: { y: 250 },
                        }}
                    >
                        <TabPanel value="basic" className="h-full">
                            <form className="mt-5 mb-2 w-full">
                                <div className="md:flex md:gap-6">
                                    <div className="md:w-1/2">
                                        <MyCustomInput
                                            label="Title"
                                            name="title"
                                            value={movieInfo.title}
                                            placeholder="Movie title..."
                                            validation={{ patternRegex: '', errorMessage: '', maxLength: 100 }}
                                            error={errorMessages.titleErrorMessage}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <MyCustomInput
                                            label="Director"
                                            name="director"
                                            value={movieInfo.director}
                                            placeholder="Director name..."
                                            validation={{ patternRegex: '', errorMessage: '', maxLength: 30 }}
                                            error={errorMessages.directorErrorMessage}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <MyCustomInput
                                    type="textarea"
                                    label="Description"
                                    name="description"
                                    value={movieInfo.description}
                                    placeholder="Description..."
                                    validation={{ patternRegex: '', errorMessage: '', maxLength: 1500 }}
                                    error={errorMessages.descriptionErrorMessage}
                                    onChange={handleInputChange}
                                />
                                <div className="2xl:flex 2xl:gap-6 mt-3">
                                    <div className="2xl:w-1/3">
                                        <MyCustomInput
                                            label="Manufacturer"
                                            name="manufacturer"
                                            value={movieInfo.manufacturer}
                                            placeholder="Manufacturer..."
                                            validation={{ patternRegex: '', errorMessage: '', maxLength: 1500 }}
                                            error={errorMessages.manufacturerErrorMessage}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <MyCustomInput
                                            type="number"
                                            label="Duration (min)"
                                            name="duration_min"
                                            value={movieInfo.duration_min}
                                            placeholder="1 to 999 minutes..."
                                            validation={{
                                                patternRegex: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/,
                                                errorMessage: '',
                                                maxLength: 1500,
                                            }}
                                            error={errorMessages.duration_minErrorMessage}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <CustomLabel label="Release date" />
                                        <Input
                                            type="date"
                                            size="lg"
                                            name="releaseDate"
                                            value={movieInfo.releaseDate}
                                            className={`bg-white ${
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
                                        <div className="ms-1 text-sm text-red-500 italic">
                                            {errorMessages.releaseDateErrorMessage}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Rating
                                    </Typography>
                                    <RatingStar stars={movieInfo.rating} totalStars={10} onChange={handleInputChange} />
                                </div>

                                <div className="mb-5">
                                    <Typography variant="h6" color="blue-gray" className="mt-3">
                                        Genres:
                                    </Typography>
                                    <AsyncSelect
                                        className="h-auto"
                                        isMulti
                                        onChange={handleChangeChooseGenre}
                                        value={listSelectedGenres.genres}
                                        cacheOptions
                                        loadOptions={loadGenreOptions}
                                        defaultOptions
                                    />
                                    <div className="ms-1 text-sm text-red-500 italic">
                                        {listSelectedGenres.genresErrorMessage}
                                    </div>
                                </div>

                                <Button className="mt-5" variant="outlined" onClick={() => handleChangeTab(2)}>
                                    Next
                                </Button>
                            </form>
                        </TabPanel>
                        <TabPanel value="sub">
                            <form className="mt-5 mb-2 w-full">
                                <CustomLabel label="Images" />
                                <div className="my-5 flex gap-x-5 overflow-x-auto">
                                    {listImages.images?.length !== 0 &&
                                        listImages.images.map((image, index) => (
                                            <img
                                                key={index}
                                                className="h-96 w-60 object-contain rounded-xl border-2 drop-shadow-md"
                                                src={image.preview}
                                                alt={'image preview' + index}
                                            />
                                        ))}
                                </div>
                                <Input
                                    type="file"
                                    size="lg"
                                    name="movieTrailer"
                                    accept="image/*"
                                    multiple
                                    className={`${
                                        errorMessages.movieImagesErrorMessage !== ''
                                            ? '!border-t-red-400 focus:!border-t-red-600'
                                            : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                    }`}
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    error={errorMessages.movieImagesErrorMessage !== ''}
                                    onChange={handleChooseImages}
                                />
                                <div className="ms-1 text-sm text-red-500 italic">
                                    {errorMessages.movieImagesErrorMessage}
                                </div>
                                <CustomLabel label="Trailer" className="mt-3" />
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
                                <div className="ms-1 text-sm text-red-500 italic">
                                    {errorMessages.movieTrailerErrorMessage}
                                </div>
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
                                <div className="ms-1 text-sm text-red-500 italic">
                                    {errorMessages.listActorErrorMessage}
                                </div>
                                <div className="2xl:flex 2xl:gap-6 mt-3">
                                    <div className="2xl:w-1/3">
                                        <MyCustomInput
                                            label="Actor name"
                                            name="fullName"
                                            value={actor.fullName}
                                            placeholder="Actor name.."
                                            validation={{
                                                patternRegex: '',
                                                errorMessage: '',
                                                maxLength: 30,
                                            }}
                                            error={errorMessages.fullNameErrorMessage}
                                            onChange={handleActorInfoChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <MyCustomInput
                                            label="Character name"
                                            name="characterName"
                                            value={actor.characterName}
                                            placeholder="Character name..."
                                            validation={{
                                                patternRegex: '',
                                                errorMessage: '',
                                                maxLength: 30,
                                            }}
                                            error={errorMessages.characterNameErrorMessage}
                                            onChange={handleActorInfoChange}
                                        />
                                    </div>
                                    <div className="2xl:w-1/3">
                                        <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">
                                            Actor avatar
                                        </label>
                                        <Input
                                            ref={avatarInputRef}
                                            type="file"
                                            size="lg"
                                            name="avatar"
                                            accept="image/*"
                                            className={`mb-2 ${
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
                                        <div className="ms-1 text-sm text-red-500 italic">
                                            {errorMessages.avatarErrorMessage}
                                        </div>
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
                                        <MyCustomInput
                                            type="number"
                                            label="Screenings Per Week"
                                            name="screeningsPerWeek"
                                            value={requirement.screeningsPerWeek}
                                            placeholder="1..."
                                            validation={{
                                                patternRegex: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/,
                                                errorMessage: 'From 1 to 999!',
                                                maxLength: 30,
                                            }}
                                            // error={errorMessages.characterNameErrorMessage}
                                            onChange={handleChangeRequirement}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <MyCustomInput
                                            type="number"
                                            label="Total Week Scheduling"
                                            name="totalWeekScheduling"
                                            value={requirement.totalWeekScheduling}
                                            placeholder="1..."
                                            validation={{
                                                patternRegex: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/,
                                                errorMessage: 'From 1 to 999!',
                                                maxLength: 30,
                                            }}
                                            // error={errorMessages.characterNameErrorMessage}
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
                                <div className="ms-1 text-sm text-red-500 italic">
                                    {errorMessages.listCinemaTypeErrorMessage}
                                </div>
                                <div className="md:flex md:gap-6">
                                    <div className="md:w-1/2">
                                        <MyCustomInput
                                            label="Type Name"
                                            name="typeName"
                                            value={specificRequireType.typeName}
                                            placeholder="Type Name..."
                                            validation={{
                                                patternRegex: '',
                                                errorMessage: '',
                                                maxLength: 30,
                                            }}
                                            error={errorMessages.typeNameErrorMessage}
                                            onChange={handleChangeSpecificRequireType}
                                        />
                                    </div>
                                    <div className="md:w-1/2">
                                        <MyCustomInput
                                            type="number"
                                            label="Total Screenings"
                                            name="nscreenings"
                                            value={specificRequireType.nscreenings}
                                            placeholder="1..."
                                            validation={{
                                                patternRegex: /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9])$/,
                                                errorMessage: 'From 1 to 999!',
                                                maxLength: 30,
                                            }}
                                            error={errorMessages.nscreeningsErrorMessage}
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
                                <div className="flex flex-col">
                                    <Checkbox
                                        label={
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="flex items-center font-normal"
                                            >
                                                I agree the
                                                <Link
                                                    href="/terms"
                                                    className="font-medium transition-colors hover:text-gray-900"
                                                >
                                                    &nbsp;Terms and Conditions
                                                </Link>
                                            </Typography>
                                        }
                                        containerProps={{ className: '-ml-2.5' }}
                                        checked={isCheckTermsAndCondition}
                                        onChange={handleCheckTermsAndCondition}
                                    />
                                    <div className="ms-1 text-sm text-red-500 italic">
                                        {errorMessages.termsErrorMessage}
                                    </div>
                                    <Button className="mt-5 ml-3" color="green" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </TabPanel>
                    </TabsBody>
                </div>
            </div>
        </Tabs>
    );
}

export default MovieAddForm;
