import PropTypes from 'prop-types';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-tailwind/react';

const deF = (star) => {};
function RatingStar({ stars, onChange = deF, totalStars }) {
    const renderStars = () => {
        let starRender = [];
        for (let i = 0; i < stars; i++) {
            starRender.push(
                <FontAwesomeIcon
                    key={i + 1}
                    icon={faStarFull}
                    className="cursor-pointer w-5 h-5"
                    onClick={() => onChange(i + 1)}
                />,
            );
        }
        for (let i = 0; i < totalStars - stars; i++) {
            starRender.push(
                <FontAwesomeIcon
                    key={i + 1 + stars}
                    icon={faStar}
                    className="cursor-pointer w-5 h-5"
                    onClick={() => onChange(i + 1 + stars)}
                />,
            );
        }
        return starRender;
    };
    return (
        <div>
            <Typography className="text-sm italic">{stars} stars</Typography>
            <div className="mb-3 text-yellow-600">{renderStars()}</div>
        </div>
    );
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
