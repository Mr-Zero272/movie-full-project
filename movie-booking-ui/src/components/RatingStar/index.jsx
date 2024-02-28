import PropTypes from 'prop-types';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const deF = (star) => {};
function RatingStar({ stars, onChange = deF, totalStars }) {
    const renderStars = () => {
        let starRender = [];
        for (let i = 0; i < stars; i++) {
            starRender.push(
                <FontAwesomeIcon
                    key={i + 1}
                    icon={faStarFull}
                    className="cursor-pointer"
                    onClick={() => onChange(i + 1)}
                />,
            );
        }
        for (let i = 0; i < totalStars - stars; i++) {
            starRender.push(
                <FontAwesomeIcon
                    key={i + 1 + stars}
                    icon={faStar}
                    className="cursor-pointer"
                    onClick={() => onChange(i + 1 + stars)}
                />,
            );
        }
        return starRender;
    };
    return <div className="mb-3 text-yellow-300">{renderStars()}</div>;
}

RatingStar.prototype = {
    onClick: PropTypes.func,
    stars: PropTypes.number,
    totalStars: PropTypes.number,
};

RatingStar.defaultProps = {
    stars: 1,
    totalStars: 5,
};

export default RatingStar;
