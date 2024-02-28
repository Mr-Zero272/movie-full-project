import classNames from 'classnames/bind';
import styles from './BoxCheckbox.module.scss';

const cx = classNames.bind(styles);
const dfFunction = () => {};

function BoxCheckbox({ item, active, onSelect = dfFunction, className }) {
    return (
        <div
            className={cx('wrapper', { active: active, [className]: className })}
            onClick={() => {
                onSelect(item);
            }}
        >
            <span>{item}</span>
        </div>
    );
}

export default BoxCheckbox;
