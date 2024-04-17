import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentChartBarIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import {
    Input,
    Typography,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Tooltip,
    Chip,
    Select,
    Option,
} from '@material-tailwind/react';
import AsyncSelect from 'react-select/async';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import CustomTabsUnderline from '@/components/CustomTabsUnderline';
import MyCustomInput from '@/components/MyCustomInput';
import RatingStar from '@/components/RatingStar';
import CustomLabel from '@/components/CustomLabel';
import { genreService, movieService } from '@/apiServices';
import { movieAddFormValidation } from '@/data';
import { useNotify } from '@/hooks';
import baseUrl from '@/configs/baseUrl';

const labels = ['title', 'director', 'description', 'manufacturer', 'duration_min', 'releaseDate'];
const errorLabels = [
    'titleErrorMessage',
    'directorErrorMessage',
    'descriptionErrorMessage',
    'manufacturerErrorMessage',
    'duration_minErrorMessage',
    'releaseDateErrorMessage',
];
const actorLabels = ['avatar', 'characterName', 'fullName'];

function EditMovieInfo() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const notify = useNotify();
    const [movieInfo, setMovieInfo] = useState(() => ({
        id: '',
        title: '',
        titleErrorMessage: '',
        director: '',
        directorErrorMessage: '',
        description: '',
        descriptionErrorMessage: '',
        manufacturer: '',
        manufacturerErrorMessage: '',
        duration_min: '90',
        duration_minErrorMessage: '',
        releaseDate: '',
        releaseDateErrorMessage: '',
        rating: 1,
        whoAdd: '',
        cast: [],
    }));
    const [actor, setActor] = useState({
        fullName: '',
        characterName: '',
        avatar: '',
        file: null,
        preview: '',
        avatarErrorMessage: '',
    });
    const [listSelectedGenres, setListSelectedGenres] = useState(() => ({
        genresValid: true,
        genresErrorMessage: '',
        genres: [],
    }));

    useEffect(() => {
        const fetchMovieInfo = async () => {
            const res = await movieService.getMovieInfo(movieId);
            if (res) {
                setMovieInfo((prev) => ({
                    ...prev,
                    ...res,
                    releaseDate: res.releaseDate.split('T')[0],
                }));
                const genres = res.genres.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setListSelectedGenres((prev) => ({
                    ...prev,
                    genres: genres,
                }));
            }
        };

        fetchMovieInfo();
    }, []);
    const handleInputChange = (e, isValid) => {
        // rating case
        if (e >= 1 || e <= 100) {
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

    const loadGenreOptions = async (inputValue) => {
        return await genreService.searchWithTransformData(inputValue, 6, 1);
    };

    const handleSubmit = async () => {
        let countError = 0;
        for (let prop of labels) {
            // console.log(movieAddFormValidation[prop]?.blank);
            // break;
            let haveError = false;

            if (movieAddFormValidation[prop]?.patternRegex !== undefined) {
                const regex = new RegExp(movieAddFormValidation[prop].patternRegex);
                if (!regex.test(movieInfo[prop])) {
                    console.log(movieInfo[prop]);
                    setMovieInfo((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is invalid!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.maxLength !== undefined) {
                if (movieInfo[prop]?.length > movieAddFormValidation[prop].maxLength) {
                    setMovieInfo((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'The maximum length is ' + movieAddFormValidation[prop].maxLength,
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.blank !== undefined && !movieAddFormValidation[prop]?.blank) {
                if (movieInfo[prop]?.length === 0) {
                    setMovieInfo((prev) => ({
                        ...prev,
                        [prop + 'ErrorMessage']: 'This field is require!',
                    }));
                    haveError = true;
                    countError++;
                }
            }

            if (!haveError) {
                setMovieInfo((prev) => ({
                    ...prev,
                    [prop + 'ErrorMessage']: '',
                }));
            }
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

        // if have error break;
        if (countError !== 0) {
            return;
        }

        const formData = new FormData();
        // genre
        let listGenres = listSelectedGenres.genres.map((genre) => genre.value);
        movieInfo.genres = listGenres;

        // release date
        const rDate = new Date(movieInfo.releaseDate);
        // console.log(format(rDate, 'yyyy-MM-dd HH:mm'));
        movieInfo.releaseDate = format(rDate, 'yyyy-MM-dd HH:mm');
        errorLabels.forEach((errorLabel) => {
            delete movieInfo[errorLabel];
        });

        // edit cast format
        const newListCast = movieInfo.cast;
        const validCast = movieInfo.cast.map((actor) => ({
            fullName: actor.fullName,
            characterName: actor.characterName,
            avatar: actor.avatar,
        }));
        movieInfo.cast = validCast;

        // don't need requirement
        delete movieInfo.requirement;

        let submitData = {
            movie: movieInfo,
        };

        formData.append('movieInfo', JSON.stringify(submitData));

        // add actor file
        newListCast.forEach((ai) => {
            if (ai.file) {
                formData.append('actorImages', ai.file);
            }
        });

        // formData.append('movieImages', acceptedFiles);
        const token = localStorage.getItem('token');
        // console.log('submit');
        const resp = await movieService.editMovie(movieInfo.id, formData, token);
        console.log(resp);
        // console.log(acceptedFiles);
        // console.log(submitData);
        if (resp && resp.state === 'success') {
            notify(resp.message, 'success');
            navigate(-1);
        } else {
            notify('Something went wrong!', 'error');
        }
    };

    // actor handle
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

    const handleAddActor = () => {
        let countError = 0;
        for (let prop of actorLabels) {
            if (movieAddFormValidation[prop]?.patternRegex !== undefined) {
                const regex = new RegExp(movieAddFormValidation[prop].patternRegex);
                if (!regex.test(actor[prop])) {
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.maxLength !== undefined) {
                if (actor[prop]?.length > movieAddFormValidation[prop].maxLength) {
                    countError++;
                }
            }

            if (movieAddFormValidation[prop]?.blank !== undefined && !movieAddFormValidation[prop]?.blank) {
                if (actor[prop]?.length === 0) {
                    countError++;
                }
            }
        }

        if (actor.avatar === '') {
            setActor((prev) => ({
                ...prev,
                actorErrorMessage: 'This field is required!',
            }));
            countError++;
        } else {
            setActor((prev) => ({
                ...prev,
                actorErrorMessage: '',
            }));
        }

        if (countError !== 0) {
            return;
        }

        actor.preview = URL.createObjectURL(actor.file);

        setMovieInfo((prev) => ({
            ...prev,
            cast: [...prev.cast, actor],
        }));
        setActor({ fullName: '', characterName: '', avatar: '', file: null });
    };

    // delete actor in list
    const handleDeleteActor = (key) => {
        setMovieInfo((prev) => ({
            ...prev,
            cast: prev.cast.filter((actor) => {
                if (actor.fullName + actor.characterName === key) {
                    if (actor?.preview) {
                        URL.revokeObjectURL(actor.preview);
                    }
                } else {
                    return actor;
                }
            }),
        }));
    };

    // console.log(movieInfo);
    return (
        <div>
            <form className="mt-5 mb-2 w-full">
                <div className="md:flex md:gap-6">
                    <div className="md:w-1/2">
                        <MyCustomInput
                            label="Title"
                            name="title"
                            value={movieInfo.title}
                            placeholder="Movie title..."
                            validation={{ patternRegex: '', errorMessage: '', maxLength: 100 }}
                            error={movieInfo.titleErrorMessage}
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
                            error={movieInfo.directorErrorMessage}
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
                    error={movieInfo.descriptionErrorMessage}
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
                            error={movieInfo.manufacturerErrorMessage}
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
                            error={movieInfo.duration_minErrorMessage}
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
                                movieInfo.releaseDateErrorMessage !== ''
                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                            }`}
                            labelProps={{
                                className: 'before:content-none after:content-none',
                            }}
                            error={movieInfo.releaseDateErrorMessage !== ''}
                            onChange={handleInputChange}
                        />
                        <div className="ms-1 text-sm text-red-500 italic">{movieInfo.releaseDateErrorMessage}</div>
                    </div>
                </div>

                <div>
                    <Typography variant="h6" color="blue-gray" className="mt-3">
                        Rating
                    </Typography>
                    <RatingStar stars={movieInfo.rating} totalStars={100} onChange={handleInputChange} />
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
                    <div className="ms-1 text-sm text-red-500 italic">{listSelectedGenres.genresErrorMessage}</div>
                </div>

                <div>
                    <Typography variant="h6" color="blue-gray" className="mt-3">
                        Actors:
                    </Typography>
                    <div className="mb-5 flex flex-wrap items-center gap-7">
                        {movieInfo.cast?.length !== 0 &&
                            movieInfo.cast.map(({ avatar, characterName, fullName, preview }) => (
                                <Card key={fullName} className="w-60">
                                    <CardHeader floated={false} className="h-60">
                                        <img
                                            className="object-cover"
                                            src={preview ? preview : baseUrl.image + avatar + '?type=avatar'}
                                            alt="profile-picture"
                                        />
                                    </CardHeader>
                                    <CardBody className="text-center">
                                        <Typography variant="h5" color="blue-gray" className="mb-2">
                                            {fullName}
                                        </Typography>
                                        <Typography color="blue-gray" className="font-medium" textGradient>
                                            {characterName}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="flex justify-center gap-7 pt-2">
                                        <Tooltip content="Delete">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                className="flex items-center gap-2"
                                                onClick={() => handleDeleteActor(fullName + characterName)}
                                            >
                                                Delete
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18 18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </Button>
                                        </Tooltip>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                    <div>
                        <div className="2xl:flex 2xl:gap-5 w-full">
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
                                    onChange={handleActorInfoChange}
                                />
                            </div>
                            <div className="2xl:w-1/3">
                                <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">
                                    Actor avatar
                                </label>
                                <Input
                                    // ref={avatarInputRef}
                                    // value={actor.file}
                                    type="file"
                                    size="lg"
                                    name="avatar"
                                    accept="image/*"
                                    className={`mb-2 ${
                                        actor.avatarErrorMessage !== ''
                                            ? '!border-t-red-400 focus:!border-t-red-600'
                                            : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                                    }`}
                                    labelProps={{
                                        className: 'before:content-none after:content-none',
                                    }}
                                    error={actor.avatarErrorMessage !== ''}
                                    onChange={handleActorInfoChange}
                                />
                                <div className="ms-1 text-sm text-red-500 italic">{actor.avatarErrorMessage}</div>
                            </div>
                        </div>
                    </div>
                    <Button className="mt-5" color="orange" onClick={handleAddActor}>
                        Add actor
                    </Button>
                </div>

                <Button className="mt-5" color="green" onClick={handleSubmit}>
                    Edit
                </Button>
                <Button className="mt-5 ms-1" variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </form>
        </div>
    );
}

function EditMovieMedia() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const notify = useNotify();
    const [movieInfo, setMovieInfo] = useState(null);
    const [listImages, setListImages] = useState(() => ({ imagesValid: true, imagesErrorMessage: '', images: [] }));
    const [movieTrailer, setMovieTrailer] = useState({ trailerValid: true, trailerErrorMessage: '', trailer: null });
    const trailerRef = useRef();
    useEffect(() => {
        const fetchMovieInfo = async () => {
            const res = await movieService.getMovieInfo(movieId);
            if (res) {
                setMovieInfo((prev) => ({
                    ...prev,
                    ...res,
                    releaseDate: res.releaseDate.split('T')[0],
                }));
                setMovieTrailer((prev) => ({
                    ...prev,
                    trailer: { preview: baseUrl.video + res.trailer, source: 'server' },
                }));
            }
        };

        fetchMovieInfo();
    }, []);

    // clear images cache
    useEffect(() => {
        return () => {
            if (listImages.images?.length !== 0) {
                listImages.images.forEach((image) => {
                    URL.revokeObjectURL(image.preview);
                });
            }
        };
    }, [listImages.images]);

    // clear images cache
    useEffect(() => {
        if (trailerRef.current !== undefined) {
            trailerRef.current.load();
        }
        return () => {
            if (movieTrailer.trailer !== null) {
                URL.revokeObjectURL(movieTrailer.trailer.preview);
            }
        };
    }, [movieTrailer.trailer]);

    // images handle
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

    // trailer handle
    const handleChooseTrailer = (e) => {
        if (e.target.files?.length === 0) {
            setMovieTrailer(() => ({
                trailer: null,
                trailerValid: false,
                trailerErrorMessage: 'This filed is required!',
            }));
        } else {
            let trailer = e.target.files[0];
            trailer.preview = URL.createObjectURL(trailer);
            trailer.source = 'client';
            setMovieTrailer(() => ({ trailer: trailer, trailerValid: true, trailerErrorMessage: '' }));
        }
    };

    const handleSubmit = async () => {
        let countError = 0;
        let errorMessage = '';
        if (listImages.images?.length === 0 && movieTrailer.trailer.source === 'server') {
            notify('Nothing to edit!', 'info');
            return;
        }
        // check image field
        if (listImages.images?.length !== 0) {
            if (listImages.images?.length < 4) {
                errorMessage = 'You need four images!';
                countError++;
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

            if (!includesHImage && !includesVImage) {
                errorMessage = 'You need at least one vertical images and one horizontal images!';
                countError++;
            }
        }

        // check trailer field
        // if (movieTrailer.trailer === null) {
        //     errorMessage = 'This field is require!';
        //     countError++;
        // }

        // if have error break;
        if (countError !== 0) {
            notify(errorMessage, 'warning');
            return;
        }

        const formData = new FormData();

        // release date
        const rDate = new Date(movieInfo.releaseDate);
        // console.log(format(rDate, 'yyyy-MM-dd HH:mm'));
        movieInfo.releaseDate = format(rDate, 'yyyy-MM-dd HH:mm');

        // genre
        let listGenres = movieInfo.genres.map((genre) => genre.id);
        movieInfo.genres = listGenres;

        // don't need requirement
        delete movieInfo.requirement;

        let submitData = {
            movie: movieInfo,
        };

        formData.append('movieInfo', JSON.stringify(submitData));

        // add images
        if (listImages.images?.length !== 0) {
            listImages.images.forEach((mi) => {
                formData.append('movieImages', mi);
            });
        }

        // add trailer
        const trailerPreview = movieTrailer.trailer.preview;
        if (movieTrailer.trailer.source !== 'server') {
            delete movieTrailer.trailer.preview;
            delete movieTrailer.trailer.source;
            formData.append('movieTrailer', movieTrailer.trailer);
        }

        const token = localStorage.getItem('token');
        const resp = await movieService.editMovie(movieInfo.id, formData, token);
        // console.log(resp);

        // console.log(acceptedFiles);
        // console.log(submitData);
        if (resp && resp.state === 'success') {
            notify(resp.message, 'success');
            URL.revokeObjectURL(trailerPreview);
            navigate(-1);
        } else {
            notify('Something went wrong!', 'error');
        }
    };

    return (
        <div className="mt-5">
            <div>
                <Typography variant="h4" className="my-2">
                    Movie trailer
                </Typography>
                <div className="w-full flex items-center gap-5">
                    {movieInfo && (
                        <video className="h-full w-1/2 rounded-lg" controls ref={trailerRef}>
                            <source src={movieTrailer.trailer.preview} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    <div>
                        <Input
                            type="file"
                            size="lg"
                            name="movieTrailer"
                            accept="video/mp4"
                            className={`${
                                movieTrailer.trailerErrorMessage !== ''
                                    ? '!border-t-red-400 focus:!border-t-red-600'
                                    : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                            }`}
                            labelProps={{
                                className: 'before:content-none after:content-none',
                            }}
                            error={movieTrailer.trailerErrorMessage !== ''}
                            onChange={handleChooseTrailer}
                        />
                        <div className="ms-1 text-sm text-red-500 italic">{movieTrailer.trailerErrorMessage}</div>
                    </div>
                </div>
            </div>
            <div>
                <Typography variant="h4" className="my-2">
                    Images
                </Typography>
                <div className="my-5 flex gap-x-5 overflow-x-auto">
                    {movieInfo &&
                        listImages.images?.length === 0 &&
                        movieInfo.galleries?.length !== 0 &&
                        movieInfo.galleries.map((image, index) => (
                            <img
                                key={image.imgUrl}
                                className="h-96 w-60 object-contain rounded-xl border-2 drop-shadow-md"
                                src={baseUrl.image + image.imgUrl}
                                alt={'image preview' + index}
                            />
                        ))}
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
                    name="movieImages"
                    accept="image/*"
                    multiple
                    className={`${
                        listImages.imagesErrorMessage !== ''
                            ? '!border-t-red-400 focus:!border-t-red-600'
                            : '!border-t-blue-gray-200 focus:!border-t-gray-900 mt-1'
                    }`}
                    labelProps={{
                        className: 'before:content-none after:content-none',
                    }}
                    error={listImages.imagesErrorMessage !== ''}
                    onChange={handleChooseImages}
                />
                <div className="ms-1 text-sm text-red-500 italic">{listImages.imagesErrorMessage}</div>
                <Typography className="my-2 text-sm italic">You can update multiple images!</Typography>
            </div>

            <Button className="mt-5" color="green" onClick={handleSubmit}>
                Edit
            </Button>
            <Button className="mt-5 ms-1" variant="outlined" onClick={() => navigate(-1)}>
                Cancel
            </Button>
        </div>
    );
}

function EditMovieRequirement() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const notify = useNotify();
    const [specificRequireType, setSpecificRequireType] = useState({ typeName: '2D', nscreenings: 1 });
    const [requirement, setRequirement] = useState({
        screeningsPerWeek: 7,
        totalWeekScheduling: 1,
        specificRequireTypes: [],
        requirementValid: true,
        requirementErrorMessage: '',
    });
    const [errorMessage, setErrorMessage] = useState({
        errorMessage: '',
    });
    useEffect(() => {
        const fetchMovieInfo = async () => {
            const res = await movieService.getMovieInfo(movieId);
            if (res) {
                setRequirement((prev) => ({
                    ...prev,
                    ...res.requirement,
                }));
            }
        };

        fetchMovieInfo();
    }, []);

    // handle change requirement
    const handleChangeRequirement = (e) => {
        setRequirement((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // handle change specificRequireType
    const handleChooseTypeName = (value) => {
        setSpecificRequireType((prev) => ({
            ...prev,
            typeName: value,
        }));
    };

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
        if (specificRequireType.nscreenings === '') {
            setErrorMessage(() => ({
                errorMessage: 'The field Total Screenings is blank!',
            }));
            return;
        }

        if (requirement.specificRequireTypes.some((it) => it.typeName === specificRequireType.typeName)) {
            setErrorMessage(() => ({
                errorMessage: 'The type name is already exist!',
            }));
            return;
        }

        let numScreenings = 0;
        requirement.specificRequireTypes.forEach((type) => {
            numScreenings += +type.nscreenings;
        });

        if (
            specificRequireType.nscreenings > +requirement.screeningsPerWeek ||
            numScreenings + +specificRequireType.nscreenings > requirement.screeningsPerWeek
        ) {
            setErrorMessage(() => ({
                errorMessage: 'The total number of screenings is being greater than the total number of screenings.',
            }));
            return;
        }

        setErrorMessage(() => ({
            errorMessage: '',
        }));

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
        setSpecificRequireType({ typeName: '2D', nscreenings: 1 });
    };

    const handleSubmit = () => {
        let numScreenings = requirement.specificRequireTypes.reduce(
            (accumulator, currentValue) => accumulator + +currentValue.nscreenings,
            0,
        );
        console.log(numScreenings, requirement.screeningsPerWeek);
        if (numScreenings !== +requirement.screeningsPerWeek) {
            setErrorMessage(() => ({
                errorMessage: 'The total number of screenings is must be equals the screening per week.',
            }));
            return;
        }

        setErrorMessage(() => ({
            errorMessage: '',
        }));
        const token = localStorage.getItem('token');
        const editRequirement = async () => {
            const res = await movieService.editRequirement(requirement.id, requirement, token);
            if (res && res.state === 'success') {
                notify(res.message, 'success');
                navigate(-1);
            } else {
                notify('Something went wrong!', 'error');
            }
        };

        editRequirement();
    };

    // console.log(requirement);

    return (
        <div className="min-h-[600px]">
            <div className="mb-5">
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
                <div className="md:flex md:gap-6">
                    <div className="md:w-1/2">
                        <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">
                            Type name
                        </label>
                        <Select
                            name="typeName"
                            label="Type Name"
                            value={specificRequireType.typeName}
                            onChange={handleChooseTypeName}
                        >
                            <Option value="2D">2D</Option>
                            <Option value="2D subtitles">2D SubTitles</Option>
                            <Option value="3D">3D</Option>
                            <Option value="3D subtitles">3D SubTitles</Option>
                            <Option value="cinema 4D">Cinema 4D</Option>
                        </Select>
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
                            // error={errorMessages.nscreeningsErrorMessage}
                            onChange={handleChangeSpecificRequireType}
                        />
                    </div>
                </div>

                <div className="ms-1 text-sm text-red-500 italic">{errorMessage.errorMessage}</div>
                <Button className="mt-5 block" onClick={handleAddSpecificRequireType}>
                    Add type
                </Button>
            </div>
            <Button className="mt-5 block" color="green" onClick={handleSubmit}>
                Edit
            </Button>
        </div>
    );
}

const tabs = [
    {
        label: 'Edit info',
        value: 'edit_info',
        icon: DocumentChartBarIcon,
        content: EditMovieInfo,
    },
    {
        label: 'Edit media',
        value: 'edit_media',
        icon: PlusCircleIcon,
        content: EditMovieMedia,
    },
    {
        label: 'Edit requirement',
        value: 'edit_requirement',
        icon: ChartBarIcon,
        content: EditMovieRequirement,
    },
];

function EditMovie() {
    return (
        <div>
            <h1 className="my-5 ml-2 text-2xl font-semibold">Edit movie</h1>
            <CustomTabsUnderline data={tabs} />
        </div>
    );
}

export default EditMovie;
