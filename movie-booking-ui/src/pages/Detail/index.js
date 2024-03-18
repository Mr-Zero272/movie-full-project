import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { format } from 'date-fns';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';

import styles from './Detail.module.scss';
import FullViewBannerTrailer from '~/components/FullViewBannerTrailer';
import TitleHeadingPage from '~/components/TitleHeadingPage';
import FloatingButton from '~/components/FloatingButton';
import * as searchService from '~/apiServices/searchService';
import baseUrl from '~/config/baseUrl';
import StatisticalCol from './StatisticalCol';
import Comment from '~/components/Comment';
import RatingStar from '~/components/RatingStar';
import { reviewService } from '~/apiServices';
import MovieScheduleItem2 from '~/components/MovieItem/MovieScheduleItem2';
import { useNotify, useToken } from '~/hooks';

const cx = classNames.bind(styles);

function Detail() {
    const [movieInfo, setMovieInfo] = useState(null);
    const [reviewInfo, setReviewInfo] = useState(() => ({
        rating: 1,
        comment: '',
    }));
    const { movieId } = useParams('movieId');
    const userInfo = useSelector((state) => state.user);
    const reviewSectionRef = useRef(null);
    const notify = useNotify();
    const { isTokenValid, token } = useToken();
    // console.log(userInfo);
    useEffect(() => {
        const fetchApi = async () => {
            const result = await searchService.getMovieInfo(movieId);
            // console.log(result);
            setMovieInfo(result);
            // setListTypes((prev) => {
            //     let newArray = [];
            //     newArray = types.data.map((item) => item);
            //     //console.log(newArray);
            //     return newArray;
            // });
            //console.log(types.data.types);
        };

        fetchApi();
    }, []);

    const handleReviewChange = (e) => {
        if (e === 1 || e === 2 || e === 3 || e === 4 || e === 5) {
            setReviewInfo((prev) => ({
                ...prev,
                rating: e,
            }));
        } else {
            setReviewInfo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (userInfo.status !== 'online') {
            notify('You need to login to write review!', 'error');
            return;
        }
        if (reviewInfo.comment === '') {
            notify('This comment filed is blank!!!s', 'error');
            return;
        }
        const addNewReview = async () => {
            if (isTokenValid) {
                const res = await reviewService.addNewComment(movieId, reviewInfo.rating, reviewInfo.comment, token);
                setReviewInfo(() => ({
                    rating: 1,
                    comment: '',
                }));
                // console.log(newReviews);
                notify(res, 'success');
            } else {
                notify('Token is invalid!', 'error');
            }
        };
        const totalCurrentReviews = movieInfo.reviews?.length;
        const fetchReviews = async () => {
            const newReviews = await reviewService.getAllReviewsByMovieId(movieId);
            if (newReviews.data?.length > totalCurrentReviews) {
                setMovieInfo((prev) => ({
                    ...prev,
                    reviews: newReviews.data,
                }));
            } else {
                setTimeout(fetchReviews, 1500);
            }
        };
        addNewReview();
        fetchReviews();
    };

    const handleRemoveClick = (reviewId) => {
        Swal.fire({
            title: 'Do you want to remove this review?',
            text: 'You will not be able to undo this action!!',
            icon: 'warning',
            // preConfirm: callApi,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Remove it!',
            showCancelButton: true,
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const rsp = await reviewService.deleteReview(movieId, reviewId, token);
                setMovieInfo((prev) => ({
                    ...prev,
                    reviews: rsp.data,
                }));
                Swal.fire('Delete!', '', 'success');
            }
        });
    };

    const handleScrollToReviewSection = () => {
        if (reviewSectionRef.current) {
            reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={cx('wrapper')}>
            {movieInfo && (
                <FullViewBannerTrailer
                    poster={movieInfo.horizontalImage}
                    movieName={movieInfo.title}
                    trailer={movieInfo.trailer}
                    genres={movieInfo.genres}
                />
            )}

            <div className="mx-auto w-full p-10 md:w-9/12 lg:w-8/12">
                <div className="mb-7 flex place-content-around md:place-content-between py-6 border-b">
                    <StatisticalCol
                        headerContent="9.4"
                        bodyContent="Metascore"
                        footerContent="53 critic reviews"
                        colorHeader="green"
                    />
                    <StatisticalCol
                        headerContent={<FontAwesomeIcon icon={faStar} />}
                        bodyContent="8.1/30"
                        footerContent="189 reviews"
                        colorHeader="red"
                    />
                    <StatisticalCol
                        headerContent={<FontAwesomeIcon icon={faRegularStar} />}
                        bodyContent="Rate this"
                        pointer
                        onClick={handleScrollToReviewSection}
                    />
                </div>
                <div className="mb-7 py-6 border-b">
                    <MovieScheduleItem2 movieId={movieId} />
                </div>
                {movieInfo && (
                    <section className="mt-5 flex">
                        <div className="w-1/4">
                            <img
                                className="h-auto max-w-full object-contain"
                                src={baseUrl.image + movieInfo.verticalImage}
                                alt={movieInfo.verticalImage}
                            />
                        </div>
                        <div className="w-3/4 ml-10 pr-3">
                            <div className="flow-root">
                                <dl className="-my-3 divide-y divide-gray-100 text-xl lg:text-3xl">
                                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">Title</dt>
                                        <dd className="text-gray-700 sm:col-span-2">{movieInfo.title}</dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">Running time</dt>
                                        <dd className="text-gray-700 sm:col-span-2">
                                            {movieInfo.duration_min + ' minutes'}
                                        </dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">Release date</dt>
                                        <dd className="text-gray-700 sm:col-span-2">
                                            {format(new Date(movieInfo.releaseDate), 'yyyy-MM-dd')}
                                        </dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">Director</dt>
                                        <dd className="text-gray-700 sm:col-span-2">{movieInfo.director}</dd>
                                    </div>

                                    <div className="hidden md:grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">Storyline</dt>
                                        <dd className="text-gray-700 sm:col-span-2 text-justify">
                                            {movieInfo.description}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </section>
                )}
                {/* <div style={{ width: '100%', boxSizing: 'border-box' }}>
                    <MovieScheduleItem types={listTypes} data={movieInfo} />
                </div> */}

                <section className="md:hidden">
                    <TitleHeadingPage title={'storyline'}>
                        {movieInfo && <p className="mt-5 text-justify">{movieInfo.description}</p>}
                    </TitleHeadingPage>
                </section>
                <section>
                    <TitleHeadingPage title={'Cast'}>
                        {movieInfo && (
                            <>
                                <div className="mt-3 flex">
                                    {movieInfo.cast.map((cast) => (
                                        <div key={cast.fullName} className=" mx-3 group relative block bg-black">
                                            <img
                                                alt=""
                                                src={baseUrl.image + cast.avatar + '?type=avatar'}
                                                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
                                            />

                                            <div className="relative p-4 sm:p-6 lg:p-8">
                                                <p className="text-sm font-medium uppercase tracking-widest text-black-500">
                                                    Actor
                                                </p>

                                                <p className="text-xl font-bold text-white sm:text-2xl">
                                                    {cast.fullName}
                                                </p>

                                                <div className="mt-32 sm:mt-48 lg:mt-64">
                                                    <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                                        <p className="text-sm text-white">
                                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                                            Omnis perferendis hic asperiores quibusdam quidem voluptates
                                                            doloremque reiciendis nostrum harum. Repudiandae?
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 w-full flex justify-center items-center">
                                    <button className="group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring">
                                        <span className="absolute inset-0 border border-primary-normal group-active:border-primary-opacity"></span>
                                        <span className="block border border-primary-normal bg-primary-normal px-12 py-3 transition-transform active:border-primary-opacity active:bg-primary-opacity group-hover:-translate-x-1 group-hover:-translate-y-1">
                                            See more
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}
                    </TitleHeadingPage>
                </section>
                <section ref={reviewSectionRef} className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
                    <div className="mx-auto px-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                                Discussion ({movieInfo && movieInfo.reviews?.length})
                            </h2>
                        </div>
                        <form className="mb-6">
                            <RatingStar stars={reviewInfo.rating} onChange={handleReviewChange} />
                            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <label className="sr-only">Your comment</label>
                                <textarea
                                    id="comment"
                                    rows="6"
                                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                    name="comment"
                                    placeholder="Write a comment..."
                                    value={reviewInfo.comment}
                                    required
                                    onChange={handleReviewChange}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                                onClick={handleSubmitReview}
                            >
                                Post comment
                            </button>
                        </form>
                        {movieInfo &&
                            movieInfo.reviews.map((review) => (
                                <Comment key={review.id} {...review} onDelete={handleRemoveClick} />
                            ))}
                    </div>
                </section>
            </div>

            <FloatingButton icon={<FontAwesomeIcon icon={faChevronUp} />} />
        </div>
    );
}

export default Detail;
