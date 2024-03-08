import CustomTabsUnderline from '@/components/CustomTabsUnderline';
import { manageData } from '@/data';

const myNumberFormat = new Intl.NumberFormat('en-us', { maximumFractionDigits: 5 });

function Auditorium() {
    return (
        <div>
            <h1 className="my-5 ml-2 text-2xl font-semibold">
                Auditorium <span className="text-gray-500 font-thin">{myNumberFormat.format(1988)}</span>
                {/* {paginationInfo.totalResult !== 0 ? (
                <span className="text-gray-500 font-thin">
                    {myNumberFormat.format(paginationInfo.totalResult)}
                </span>
            ) : (
                <Skeleton className="inline" width={100} />
            )} */}
            </h1>
            <CustomTabsUnderline data={manageData.Genre} />
        </div>
    );
}

export default Auditorium;
