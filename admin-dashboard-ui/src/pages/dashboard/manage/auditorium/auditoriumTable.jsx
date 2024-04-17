import { auditoriumService } from '@/apiServices';
import NormalTable from '@/components/CustomTable/NormalTable';
import { useEffect, useState, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';

const tableLabels = ['id', 'name', 'lastUpdated', 'action'];

export function AuditoriumTable() {
    const [listAuditoriums, setListAuditoriums] = useState();
    const [paginationInfo, setPaginationInfo] = useState(() => ({
        currentPage: 1,
        size: 7,
        totalPage: 0,
        totalResult: 0,
    }));
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchGenreLists = async (q, size, cPage) => {
            const res = await auditoriumService.search(q, size, cPage);
            // console.log(res);
            if (res) {
                setPaginationInfo((prev) => ({
                    ...prev,
                    ...res.pagination,
                }));
                setListAuditoriums(res.data);
            }
        };

        fetchGenreLists(searchValue, paginationInfo.size, paginationInfo.currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationInfo.currentPage, searchValue, paginationInfo.size]);

    const handleSelectSize = useCallback((size) => {
        setPaginationInfo((prev) => ({
            ...prev,
            size: size,
            currentPage: 1,
        }));
    }, []);

    const handleNextPage = (nextPage) => {
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: nextPage,
        }));
    };

    const handlePrevPage = (prevPage) => {
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: prevPage,
        }));
    };

    const handleSearchValueChange = (value) => {
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        setSearchValue(value);
    };
    return (
        <div>
            {listAuditoriums ? (
                <NormalTable
                    name="auditorium"
                    labels={tableLabels}
                    data={listAuditoriums}
                    pagination={paginationInfo}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                    onSearch={handleSearchValueChange}
                    onSelectSize={handleSelectSize}
                />
            ) : (
                <Skeleton height={600} />
            )}
        </div>
    );
}

export default AuditoriumTable;
