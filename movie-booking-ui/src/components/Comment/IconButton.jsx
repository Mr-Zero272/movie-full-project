import PropTypes from 'prop-types';

function IconButton({ icon, iconActive, active, colorActive, className }) {
    return (
        <div className={`${colorActive === 'red' && active && 'text-red-500'} ${className}`}>
            {active && iconActive ? iconActive : icon}
        </div>
    );
}

IconButton.prototype = {
    active: PropTypes.bool,
};

IconButton.defaultProps = {
    active: false,
    colorActive: 'red',
};

export default IconButton;
