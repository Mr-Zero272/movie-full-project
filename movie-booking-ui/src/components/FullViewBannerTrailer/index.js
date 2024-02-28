import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause } from '@fortawesome/free-regular-svg-icons';

import classNames from 'classnames/bind';
import styles from './FullViewBannerTrailer.module.scss';
import baseUrl from '~/config/baseUrl';
import { faAngleLeft, faHeart as fullHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
function FullViewBannerTrailer({ poster, trailer, movieName, genres, stars, totalTicketSold }) {
    //console.log(trailer);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [playVideo, setPlayVideo] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoved, setIsLoved] = useState(false);

    useEffect(() => {
        videoRef.current.load();
    }, [trailer]);

    const handlePlayVideo = () => {
        setPlayVideo(!playVideo);
        if (!playVideo) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(false);
    };

    const handleMouseLeave = () => {
        setIsHovered(true);
    };

    const handleLoveClick = () => {
        setIsLoved(!isLoved);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-trailer')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <video ref={videoRef} preload="metadata" loop poster={baseUrl.image + poster}>
                    <source src={baseUrl.video + `${trailer}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className={cx('control-btn', { hide: playVideo })} onClick={handlePlayVideo}>
                    <FontAwesomeIcon className={cx('play-btn')} icon={faCirclePlay} />
                    <span>Watch trailer</span>
                </div>
                <div className={cx('control-btn', { hide: !playVideo, fade: isHovered })} onClick={handlePlayVideo}>
                    <FontAwesomeIcon className={cx('pause-btn')} icon={faCirclePause} />
                    <span>Stop</span>
                </div>
            </div>
            <div className="w-full px-10 absolute top-5 text-white text-3xl flex place-content-between">
                <button onClick={handleBack}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button onClick={handleLoveClick}>
                    {!isLoved ? <FontAwesomeIcon icon={faHeart} /> : <FontAwesomeIcon icon={fullHeart} color="red" />}
                </button>
            </div>
            <div className="absolute bottom-6 left-10 text-white">
                <h4 className="text-5xl capitalize mb-5">{movieName}</h4>
                {genres && (
                    <ul className="list-none text-base flex uppercase font-thin">
                        {genres.slice(0, 3).map((genre) => (
                            <li key={genre.id} className="px-4 py-1.5 border border-white rounded-lg mr-3">
                                {genre.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

FullViewBannerTrailer.prototype = {
    genres: PropTypes.array,
};

export default FullViewBannerTrailer;
