import CustomTabsUnderline from '@/components/CustomTabsUnderline';
import { manageData } from '@/data';
import { useSelector } from 'react-redux';

const myNumberFormat = new Intl.NumberFormat('en-us', { maximumFractionDigits: 5 });

function Movie() {
    const userInfo = useSelector((state) => state.user);
    const features = userInfo.role === 'ADMIN' ? manageData.movie.admin : manageData.movie.business;

    return (
        <div>
            <h1 className="my-5 ml-2 text-2xl font-semibold">
                Movie <span className="text-gray-500 font-thin">{myNumberFormat.format(1988)}</span>
                {/* {paginationInfo.totalResult !== 0 ? (
                        <span className="text-gray-500 font-thin">
                            {myNumberFormat.format(paginationInfo.totalResult)}
                        </span>
                    ) : (
                        <Skeleton className="inline" width={100} />
                    )} */}
            </h1>
            <CustomTabsUnderline data={features} />
        </div>
    );
}

export default Movie;
