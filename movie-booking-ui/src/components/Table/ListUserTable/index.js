import classNames from 'classnames/bind';
import styles from './ListUserTable.module.scss';
import baseUrl from '~/config/baseUrl';

const cx = classNames.bind(styles);

function ListUserTable({ data }) {
    return (
        <div className={cx('wrapper')}>
            {data.map((item, index) => (
                <div className={cx('row')} key={index}>
                    <img src={baseUrl.image + item.avatar + '?type=avatar'} alt="avatar" />
                    <p>{item.fullName}</p>
                </div>
            ))}
        </div>
    );
}

export default ListUserTable;
