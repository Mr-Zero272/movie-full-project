import PropTypes from 'prop-types';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, Tooltip } from '@material-tailwind/react';

const deF = (star) => {};
function RatingStar({ stars, onChange = deF, totalStars }) {
    const renderStars = () => {
        let starRender = [];
        for (let i = 0; i < stars; i++) {
            starRender.push(
                <Tooltip key={i + 1} content={i + 1 + ' stars'}>
                    <FontAwesomeIcon
                        icon={faStarFull}
                        className="cursor-pointer w-5 h-5"
                        onClick={() => onChange(i + 1)}
                    />
                </Tooltip>,
            );
        }
        for (let i = 0; i < totalStars - stars; i++) {
            starRender.push(
                <Tooltip key={i + 1 + stars} content={i + 1 + stars + ' stars'}>
                    <FontAwesomeIcon
                        icon={faStar}
                        className="cursor-pointer w-5 h-5"
                        onClick={() => onChange(i + 1 + stars)}
                    />
                </Tooltip>,
            );
        }
        return starRender;
    };
    return (
        <div>
            {totalStars > 10 && <Typography className="text-sm italic">{stars} stars</Typography>}
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
