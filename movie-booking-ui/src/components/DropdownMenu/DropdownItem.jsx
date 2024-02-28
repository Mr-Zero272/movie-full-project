import PropTypes from 'prop-types';

function DropdownItem({ active, icon, iconColor, title, value, onClick }) {
    let _iconColor = '';
    if (iconColor === 'orange') {
        _iconColor = 'text-orange-500';
    } else if (iconColor === 'blue') {
        _iconColor = 'text-blue-500';
    } else if (iconColor === 'yellow') {
        _iconColor = 'text-yellow-500';
    } else {
        _iconColor = 'text-red-500';
    }
    return (
        <div className="flex items-center w-72 mb-3 cursor-pointer" onClick={() => onClick(value)}>
            <div className={'w-1/4 text-3xl' + ' ' + _iconColor}>{icon}</div>
            <p className={`w-3/4 ${active && 'text-primary-normal'}`}>{title}</p>
        </div>
    );
}

DropdownItem.prototype = {
    active: PropTypes.bool,
    title: PropTypes.string,
    icon: PropTypes.node,
    iconColor: PropTypes.arrayOf(['orange', 'blue', 'yellow', 'red']),
    onClick: PropTypes.func,
};

export default DropdownItem;
