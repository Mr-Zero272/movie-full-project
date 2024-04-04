import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentChartBarIcon, PlusCircleIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { Input, Typography, Button } from '@material-tailwind/react';
import AsyncSelect from 'react-select/async';

import CustomTabsUnderline from '@/components/CustomTabsUnderline';
import MyCustomInput from '@/components/MyCustomInput';
import RatingStar from '@/components/RatingStar';
import CustomLabel from '@/components/CustomLabel';
import { genreService, movieService } from '@/apiServices';

function EditMovieInfo() {
    const { movieId } = useParams();
    const [movieInfo, setMovieInfo] = useState(() => ({
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
    }));
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

                <Button className="mt-5" color="green">
                    Edit
                </Button>
            </form>
        </div>
    );
}

function EditMovieMedia() {
    return <div>Edit movie media</div>;
}

function EditMovieRequirement() {
    return <div>Edit movie requirementt</div>;
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
