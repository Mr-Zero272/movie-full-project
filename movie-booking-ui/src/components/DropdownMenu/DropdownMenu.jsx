import PropTypes from 'prop-types';
import { useState } from 'react';

import DropdownItem from './DropdownItem';

const deF = () => {};

function DropdownMenu({ name, menu, isFocus, onClick = deF, onSelect = deF }) {
    const [activeMenuItem, setActiveMenuItem] = useState(() => menu[0].value);
    const handleChooseMenuItem = (menuName) => {
        onSelect(menuName);
        setActiveMenuItem(menuName);
    };
    return (
        <div onClick={() => onClick(name)}>
            <DropdownItem {...menu[0]} onClick={handleChooseMenuItem} />
            {isFocus &&
                menu
                    .slice(1)
                    .map((menuItem, index) => (
                        <DropdownItem
                            key={index}
                            {...menuItem}
                            active={activeMenuItem === menuItem.value}
                            onClick={handleChooseMenuItem}
                        />
                    ))}
        </div>
    );
}

DropdownMenu.prototype = {
    menu: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
};

export default DropdownMenu;
