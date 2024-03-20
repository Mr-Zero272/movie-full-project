import { useState, useEffect } from 'react';

import TitleHeadingPage from '~/components/TitleHeadingPage';
import { screeningService } from '~/apiServices';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import { useFormatVndCurrency } from '~/hooks';

function Schedule() {
    const [itemsToShow, setItemsToShow] = useState(() => ({
        size: 7,
        cPage: 1,
    })); // Number of items to show initially
    const [totalPages, setTotalPages] = useState(100);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const VND = useFormatVndCurrency();

    useEffect(() => {
        const fetchData = async () => {
            const res = await screeningService.getAllScreeningByGreaterThanCurrentDate(
                itemsToShow.size,
                itemsToShow.cPage,
            );
            setData(res.data);
            setTotalPages(res.pagination.totalPage);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log(data);

    const handleLoadMore = () => {
        const nextPage = Math.min(itemsToShow.cPage + 1, totalPages);
        setItemsToShow((prev) => ({
            ...prev,
            cPage: nextPage,
        }));
        const loadMore = async () => {
            setLoading(true);
            const res = await screeningService.getAllScreeningByGreaterThanCurrentDate(itemsToShow.size, nextPage);
            setData((prev) => prev.concat(res.data));
            setLoading(false);
        };
        loadMore();
    };

    return (
        <div className="my-10 ms-10">
            <TitleHeadingPage title={'SCHEDULE'} />
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {data ? (
                    data.map(({ id, type, screeningStart, price, movie }) => (
                        <li key={id} className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                            <time className="mb-2s text-xl font-normal leading-none text-gray-400 dark:text-gray-500">
                                {format(new Date(screeningStart), "MMMM dd, yyyy '-' HH:mm aa")}
                            </time>
                            <h3 className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white">{movie.title}</h3>
                            <p className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400">
                                {movie.description}
                            </p>
                            <p className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400">
                                Type: {type}
                            </p>
                            <p className="mb-4 text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400">
                                Price: {VND.format(price)}
                            </p>
                            <Link
                                to={`/detail/${movie.id}?date=${format(
                                    new Date(screeningStart),
                                    'yyyy-MM-dd',
                                )}T00:00:00&type=${type}`}
                                className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            >
                                Detail{' '}
                                <svg
                                    className="w-3 h-3 ms-2 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M1 5h12m0 0L9 1m4 4L9 9"
                                    />
                                </svg>
                            </Link>
                        </li>
                    ))
                ) : (
                    <>
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                            <Skeleton
                                className="mb-2s text-xl font-normal leading-none text-gray-400 dark:text-gray-500"
                                count={1}
                            />
                            <Skeleton className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white" count={1} />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={2}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton width={60} height={20} />
                        </li>
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                            <Skeleton
                                className="mb-2s text-xl font-normal leading-none text-gray-400 dark:text-gray-500"
                                count={1}
                            />
                            <Skeleton className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white" count={1} />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={2}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton width={60} height={20} />
                        </li>
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                            <Skeleton
                                className="mb-2s text-xl font-normal leading-none text-gray-400 dark:text-gray-500"
                                count={1}
                            />
                            <Skeleton className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white" count={1} />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={2}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton
                                className="text-lg line-clamp-2 font-normal text-gray-500 dark:text-gray-400"
                                count={1}
                            />
                            <Skeleton width={60} height={20} />
                        </li>
                    </>
                )}
            </ol>
            {itemsToShow.cPage < totalPages && (
                <button
                    className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-primary-normal focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-primary-normal dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    onClick={handleLoadMore}
                >
                    {loading && (
                        <svg
                            aria-hidden="true"
                            role="status"
                            className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"
                            />
                        </svg>
                    )}
                    See more <FontAwesomeIcon className="w-3 h-3 ms-2 rtl:rotate-180" icon={faArrowDown} />
                </button>
            )}
        </div>
    );
}

export default Schedule;
