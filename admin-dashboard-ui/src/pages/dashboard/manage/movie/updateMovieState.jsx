import { movieService } from '@/apiServices';
import baseUrl from '@/configs/baseUrl';
import { useNotify } from '@/hooks';
import { Select, Typography, Option, Chip, Button } from '@material-tailwind/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateMovieState() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const notify = useNotify();
    const [movieState, setMovieState] = useState(null);
    const [movieInfo, setMovieInfo] = useState(null);
    useEffect(() => {
        const fetchMovieInfo = async () => {
            const res = await movieService.getMovieInfo(movieId);
            if (res) {
                setMovieInfo((prev) => ({
                    ...prev,
                    ...res,
                    releaseDate: res.releaseDate.split('T')[0],
                }));
                setMovieState(res.state);
            }
        };

        fetchMovieInfo();
    }, []);

    const handleChangeState = (value) => {
        setMovieState(value);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        console.log(movieState);
        const res = await movieService.editMovieState(movieInfo.id, movieState, token);
        if (res && res.state === 'success') {
            notify(res.message);
            navigate(-1);
        } else {
            notify('Something went wrong!', 'error');
        }
    };

    return (
        <div className="min-h-[700px]">
            {movieInfo ? (
                <div className="flex justify-between gap-10">
                    <div className="w-1/4 flex justify-center md:block">
                        <img
                            className="w-72 h-96 object-contain"
                            src={baseUrl.image + movieInfo.verticalImage}
                            alt="main-img"
                        />
                    </div>
                    <div className="w-3/4">
                        <Typography variant="h2">{movieInfo.title}</Typography>
                        <Chip
                            className="w-fit"
                            color={movieState === 'published' ? 'green' : 'red'}
                            value={movieState}
                        />
                        <Typography className="mb-5">
                            by <span className="font-semibold">{movieInfo.director}</span>
                        </Typography>

                        <p className="line-clamp-6 italic text-gray-500 mb-10 border-b">{movieInfo.description}</p>

                        <div className="flow-root">
                            <dl className="-my-3 divide-y divide-gray-100 text-sm">
                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">manufacturer</dt>
                                    <dd className="text-gray-700 sm:col-span-2">{movieInfo.manufacturer}</dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">Duration</dt>
                                    <dd className="text-gray-700 sm:col-span-2">{movieInfo.duration_min} minutes</dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">Release date</dt>
                                    <dd className="text-gray-700 sm:col-span-2">
                                        {format(movieInfo.releaseDate, 'MMM yyyy')}
                                    </dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">Rating</dt>
                                    <dd className="text-gray-700 sm:col-span-2">{movieInfo.rating}</dd>
                                </div>

                                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                    <dt className="font-medium text-gray-900">State</dt>
                                    <dd className="text-gray-700 sm:col-span-2">
                                        <Select label="State" value={movieState} onChange={handleChangeState}>
                                            <Option value="coming soon">Not yet approved</Option>
                                            <Option value="published">Approved</Option>
                                            <Option value="pause publication">Pause publication</Option>
                                        </Select>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        {movieState !== movieInfo.state && (
                            <Button color="green" onClick={handleSubmit}>
                                Update
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    role="status"
                    className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <svg
                            className="w-10 h-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                        >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                    <div className="w-full">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5" />
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5" />
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5" />
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    );
}

export default UpdateMovieState;
