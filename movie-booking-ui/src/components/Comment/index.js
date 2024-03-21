import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis, faHeart as faFullHeart } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import RatingStar from '../RatingStar';
import { format } from 'date-fns';
import IconButton from './IconButton';
import { reviewService } from '~/apiServices';
import { useNotify, useToken } from '~/hooks';

function Comment({ id, author, avatar, rating, comment, publishAt, totalLoves, whoLoves, onDelete, ...rest }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const notify = useNotify;
    const [isEdit, setIsEdit] = useState(false);
    const [reviewInfo, setReviewInfo] = useState(() => ({
        id,
        author,
        avatar,
        rating,
        comment,
        publishAt,
        totalLoves,
        whoLoves,
        ...rest,
    }));
    const userInfo = useSelector((state) => state.user);
    const { isTokenValid, token } = useToken();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Replace setIsMenuOpen with your state setter
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOpenMenu = () => {
        setIsMenuOpen((open) => !open);
    };

    const handleEditClick = () => {
        setIsEdit(true);
        setIsMenuOpen(false);
    };

    // handle edit
    const handleChangeEditReview = (e) => {
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

    const handleSubmitEditReview = (e) => {
        e.preventDefault();
        if (reviewInfo.comment === '') {
            notify('Review content is required!!', 'error');
            return;
        }

        const editReview = async () => {
            if (isTokenValid) {
                const editReview = await reviewService.editReview(id, reviewInfo.rating, reviewInfo.comment, token);
                if (editReview.state && editReview.state === 'success') {
                    notify('Edit review successfully!', 'success');
                }
                // console.log(editReview.data);
                setIsEdit(false);
            } else {
                notify('Token is invalid!', 'error');
            }
        };
        editReview();
    };

    const handleRemoveClick = () => {
        setIsMenuOpen(false);
        onDelete(id);
    };

    const handleReportClick = async () => {
        const { value: report } = await Swal.fire({
            title: 'Select field validation',
            input: 'select',
            inputOptions: {
                'Misleading or scam': 'Misleading or scam',
                'Sexually inappropriate': 'Sexually inappropriate',
                Offensive: 'Offensive',
                Violence: 'Violence',
                Spam: 'Spam',
                'Prohibited content': 'Prohibited content',
                Other: 'Other',
            },
            inputPlaceholder: 'Report this review',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value !== '') {
                        resolve();
                    } else {
                        resolve('You need to select one!');
                    }
                });
            },
        });
        const reportCall = async () => {
            const res = await reviewService.reportReview(id, report, token);
            if (res.rspCode === '200') {
                Swal.fire('Report!', '', 'success');
            } else {
                Swal.fire('Error!', '', 'error');
            }
        };
        if (report) {
            reportCall();
        }
    };

    // console.log(userInfo);

    const handleLoveClick = () => {
        const doLove = async () => {
            await reviewService.loveReview(reviewInfo.id, token);
            const reviewInfoFetch = await reviewService.getReviewInfo(id);
            setReviewInfo((prev) => ({
                ...prev,
                ...reviewInfoFetch,
            }));
            // console.log(reviewInfo);
        };
        doLove();
    };

    return (
        <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img className="mr-2 w-6 h-6 rounded-full" src={reviewInfo.avatar} alt={reviewInfo.author} />
                        {reviewInfo.author}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time
                            pubdate={reviewInfo.publishAt}
                            dateTime={reviewInfo.publishAt}
                            title={format(new Date(reviewInfo.publishAt), 'MMM. dd, yyyy')}
                        >
                            {format(new Date(reviewInfo.publishAt), 'MMM. dd, yyyy')}
                        </time>
                    </p>
                </div>
                <div className="relative">
                    <button
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        onClick={handleOpenMenu}
                    >
                        <FontAwesomeIcon icon={faEllipsis} className="bg-transparent" />
                    </button>
                    {isMenuOpen && userInfo.status === 'online' && (
                        <div
                            ref={menuRef}
                            className="absolute right-px z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                            <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownMenuIconHorizontalButton"
                            >
                                {userInfo.username === reviewInfo.author && (
                                    <>
                                        <li>
                                            <button
                                                className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={handleEditClick}
                                            >
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={handleRemoveClick}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <button
                                        className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={handleReportClick}
                                    >
                                        Report
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </footer>
            {isEdit ? (
                <form className="mb-6">
                    <RatingStar stars={reviewInfo.rating} onChange={handleChangeEditReview} />
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..."
                            name="comment"
                            value={reviewInfo.comment}
                            required
                            onChange={handleChangeEditReview}
                        ></textarea>
                    </div>
                    <button
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-normal rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-normal hover:bg-primary-hover"
                        onClick={handleSubmitEditReview}
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <>
                    <RatingStar stars={reviewInfo.rating} />
                    <p className="text-gray-500 dark:text-gray-400">{reviewInfo.comment}</p>
                </>
            )}

            <div className="flex items-center mt-4 space-x-4">
                <button
                    type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                    onClick={handleLoveClick}
                >
                    <IconButton
                        className="mr-2"
                        icon={<FontAwesomeIcon icon={faHeart} />}
                        iconActive={<FontAwesomeIcon icon={faFullHeart} />}
                        active={reviewInfo.whoLoves.includes(userInfo.username)}
                    />
                    {reviewInfo.totalLoves} Loves
                </button>
            </div>
        </article>
    );
}

Comment.defaultProps = {
    publishAt: '2024-02-16T16:45:13.194',
};

Comment.prototype = {
    onDelete: PropTypes.func,
};

export default Comment;
