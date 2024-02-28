import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import classNames from 'classnames/bind';

import styles from './Schedule.module.scss';
import TitleHeadingPage from '~/components/TitleHeadingPage';
import MovieScheduleItem from '~/components/MovieItem/MovieScheduleItem';
import BoxCheckbox from '~/components/Form/FormInput/BoxCheckbox';
import SelectOption from '~/components/Form/FormInput/SelectOption';
import { listTodayScheduleActions } from '~/store/list-today-schedule-slice';
import { searchService } from '~/apiServices';
import MovieScheduleItem2 from '~/components/MovieItem/MovieScheduleItem2';
import MyCustomDatePicker from '~/components/MyCustomDatePicker';
import MovieScreeningItem from '~/components/MovieItem/MovieScreeningItem';
const cx = classNames.bind(styles);

function Schedule() {
    const dispatch = useDispatch();
    const [baseData, setBaseData] = useState({ cinemaTypes: [], genres: [], data: [] });
    const filter = useSelector((state) => state.listTodaySchedule);
    const types = useSelector((state) => state.listTodaySchedule.cinemaTypes);
    //console.log(types);
    useEffect(() => {
        const fetchApi = async () => {
            const tempGenre = [];
            tempGenre.push(filter.genre);
            const cinemaTypeResults = await searchService.getScreeningTypes();
            const genresResults = await searchService.getAllGenres();
            const result = await searchService.search('', '', [], [], 6, 1);
            console.log(cinemaTypeResults);
            setBaseData((prev) => ({
                ...prev,
                cinemaTypes: cinemaTypeResults,
                genres: genresResults,
                data: result.data,
            }));
            //console.log(cinemaTypeResults);
        };

        fetchApi();
    }, [filter.genre]);

    const handleSelectMenuOption = (name) => {
        dispatch(listTodayScheduleActions.chooseGenre(name));
    };
    const handleSelectCheckbox = (id) => {
        dispatch(listTodayScheduleActions.chooseCinemaTypes(id));
    };
    return (
        <div className={cx('wrapper')}>
            <TitleHeadingPage title={'SCHEDULE'} />
            <div>
                <MyCustomDatePicker />
            </div>
            <div>
                <MovieScreeningItem />
            </div>
            {/* <div className={cx('filter')}>
                <SelectOption options={baseData.genres} defaultValue={''} onSelectOption={handleSelectMenuOption} />
                <div className={cx('filter-checkbox')}>
                    {baseData.cinemaTypes.map((item) => (
                        <BoxCheckbox
                            key={item}
                            item={item}
                            active={filter.cinemaTypes.includes(item)}
                            className={cx('box-checkbox')}
                            onSelect={handleSelectCheckbox}
                        />
                    ))}
                </div>
            </div>
            {baseData.data.map((item) => (
                <MovieScheduleItem key={item.id} data={item} types={types} />
            ))} */}
        </div>
    );
}

export default Schedule;
