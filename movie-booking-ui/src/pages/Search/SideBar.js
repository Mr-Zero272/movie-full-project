import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faAngleDoubleRight, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { searchService } from '~/apiServices';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { paginationAction } from '~/store/pagination-slice';

const cx = classNames.bind(styles);

function Sidebar({ className }) {
    const dispatch = useDispatch();
    const [baseData, setBaseData] = useState({ cinemaTypes: [], genres: [], manufacturers: [] });
    const [showMore, setShowMore] = useState({ listCheckbox1: false, listCheckbox2: false });

    const fullFilterInfo = useSelector((state) => state.pagination);

    const handleShowMore = (listCheckboxName) => {
        if (listCheckboxName === 1) {
            setShowMore((prev) => ({ ...prev, listCheckbox1: !showMore.listCheckbox1 }));
        } else {
            setShowMore((prev) => ({ ...prev, listCheckbox2: !showMore.listCheckbox2 }));
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            const cinemaTypeResults = await searchService.getScreeningTypes();
            const genresResults = await searchService.getAllGenres();
            const manufactureResults = await searchService.getManufactures();
            // console.log(cinemaTypeResults);
            // console.log(genresResults);
            // console.log(manufactureResults);
            setBaseData((prev) => ({
                ...prev,
                cinemaTypes: ['All', ...cinemaTypeResults],
                genres: genresResults,
                manufacturers: manufactureResults,
            }));
        };

        fetchApi();
    }, []);
    const isActive = (arr, obj) => {
        return arr.includes(obj);
    };

    // console.log(baseData);

    return (
        <div className={`pr-5 md:w-72 ${className}`}>
            <div className="pb-7 mb-10 border-b">
                <div className="text-3xl mb-5 font-semibold">
                    <h5>Cinema Type </h5>
                </div>
                <ul>
                    {baseData.cinemaTypes.map((type) => {
                        const active = fullFilterInfo.cinemaType === type;
                        return (
                            <li key={type} onClick={() => dispatch(paginationAction.chooseCinemaType(type))}>
                                <div
                                    className={classNames('cursor-pointer text-2xl leading-[32px]', {
                                        'text-primary-normal hover:text-primary-normal': active,
                                        'text-[#51545f] hover:text-[#b5aec4]': !active,
                                    })}
                                >
                                    {active && (
                                        <span className="mr-2">
                                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                                        </span>
                                    )}
                                    {type}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="pb-7 mb-10 border-b">
                <div className="text-3xl mb-5 font-semibold">
                    <h5>Genres</h5>
                </div>
                <ul className={cx('checkboxes', { openFullCheckbox: showMore.listCheckbox1 })}>
                    {baseData.genres.map((item) => {
                        const active = isActive(fullFilterInfo.genres, item.id);
                        return (
                            <li
                                key={item.id}
                                className={classNames('h-4 leading-[40px]', { active })}
                                onClick={() => dispatch(paginationAction.chooseGenre(item.id))}
                            >
                                {active && <FontAwesomeIcon className={cx('i')} icon={faSquareCheck} />}
                                {!active && <FontAwesomeIcon className={cx('i')} icon={faSquare} />}
                                <span>{item.name}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className={cx('show_more')}>
                    {!showMore.listCheckbox1 && (
                        <span onClick={() => handleShowMore(1)}>
                            <span>+</span>Show More
                        </span>
                    )}
                    {showMore.listCheckbox1 && (
                        <span onClick={() => handleShowMore(1)}>
                            <span>-</span>Show Less
                        </span>
                    )}
                </div>
            </div>

            <div className="pb-7 mb-10 border-b">
                <div className="text-3xl mb-5 font-semibold">
                    <h5>Manufacturer</h5>
                </div>
                <ul className={cx('checkboxes', { openFullCheckbox: showMore.listCheckbox2 })}>
                    {baseData.manufacturers.map((item, index) => {
                        const active = isActive(fullFilterInfo.manufacturers, item);
                        return (
                            <li
                                key={index}
                                className={cx({ active })}
                                onClick={() => dispatch(paginationAction.chooseManufacturer(item))}
                            >
                                {active && <FontAwesomeIcon className={cx('i')} icon={faSquareCheck} />}
                                {!active && <FontAwesomeIcon className={cx('i')} icon={faSquare} />}
                                <span>{item}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className={cx('show_more')}>
                    {!showMore.listCheckbox2 && (
                        <span onClick={() => handleShowMore(2)}>
                            <span>+</span>Show More
                        </span>
                    )}
                    {showMore.listCheckbox2 && (
                        <span onClick={() => handleShowMore(2)}>
                            <span>-</span>Show Less
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
