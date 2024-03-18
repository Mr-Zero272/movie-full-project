import { genreService } from '@/apiServices';
import NormalTable from '@/components/CustomTable/NormalTable';
import { useEffect, useState, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';

const tableLabels = ['id', 'name', 'lastUpdate', 'action'];

function GenreTable() {
    const [listGenres, setListGenres] = useState();
    const [paginationInfo, setPaginationInfo] = useState(() => ({
        currentPage: 1,
        size: 7,
        totalPage: 0,
        totalResult: 0,
    }));
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchGenreLists = async (name, size, cPage) => {
            const res = await genreService.getAllGenres(name, size, cPage);
            // console.log(res);
            if (res) {
                setPaginationInfo((prev) => ({
                    ...prev,
                    ...res.pagination,
                }));
                setListGenres(res.data);
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
            {listGenres ? (
                <NormalTable
                    name="genre"
                    labels={tableLabels}
                    data={listGenres}
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

export default GenreTable;
