import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './MovieItemWithDesc.module.scss';
import baseUrl from '~/config/baseUrl';
import Skeleton from 'react-loading-skeleton';

const cx = classNames.bind(styles);
const defaultData = { genres: [{ id: '', name: '' }] };
function MovieItemWithDesc({
    id,
    title,
    verticalImage = '',
    director = '',
    cast,
    genres,
    arrows = false,
    onNext,
    onPrev,
}) {
    return (
        <div className={cx('wrapper')}>
            {verticalImage !== '' ? (
                <div className={cx('movie-img')}>
                    <img src={baseUrl.image + verticalImage} alt={title} />
                    <Link to={'/detail/' + id} className={cx('play-btn')}>
                        <FontAwesomeIcon className={cx('play-btn-icon')} icon={faPlayCircle} />
                    </Link>
                </div>
            ) : (
                <Skeleton height={380} />
            )}
            <div className={cx('movie-desc')}>
                <div className={cx('desc-item')}>
                    <p>
                        <strong>Director</strong>
                    </p>
                    {director !== '' ? <p>{director}</p> : <Skeleton count={1} />}
                </div>
                <div className={cx('desc-item')}>
                    <p>
                        <strong>Cast</strong>
                    </p>
                    {cast ? <p>{cast.map((actor) => actor.characterName + ', ')}...</p> : <Skeleton count={1} />}
                </div>
                <div className={cx('desc-item')}>
                    <p>
                        <strong>Genre</strong>
                    </p>
                    {genres ? <p>{genres.map((item) => item.name + ', ')}...</p> : <Skeleton count={1} />}
                </div>
            </div>
            {arrows && (
                <div className={cx('arrow', 'right')} onClick={() => onNext()}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            )}
            {arrows && (
                <div className={cx('arrow', 'left')} onClick={() => onPrev()}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </div>
            )}
        </div>
    );
}

export default MovieItemWithDesc;
