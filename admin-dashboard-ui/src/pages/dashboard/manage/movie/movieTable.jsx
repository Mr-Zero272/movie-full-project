import { movieService } from '@/apiServices';
import NormalTable from '@/components/CustomTable/NormalTable';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const tableLabels = ['title', 'director', 'manufacturer', 'releaseDate', 'action'];

function MovieTable() {
    const [listMovies, setListMovies] = useState();
    const [paginationInfo, setPaginationInfo] = useState(() => ({
        currentPage: 1,
        size: 7,
        totalPage: 0,
        totalResult: 0,
    }));
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchGenreLists = async (name, size, cPage) => {
            const res = await movieService.searchMovie(name, null, null, null, size, cPage);
            if (res) {
                setPaginationInfo((prev) => ({
                    ...prev,
                    ...res.pagination,
                }));
                setListMovies(res.data);
            }
        };

        fetchGenreLists(searchValue, paginationInfo.size, paginationInfo.currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationInfo.currentPage, searchValue, paginationInfo.size]);

    const handleNextPage = useCallback((nextPage) => {
        console.log(nextPage);
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: nextPage,
        }));
    }, []);

    const handlePrevPage = useCallback((prevPage) => {
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: prevPage,
        }));
    }, []);

    const handleSelectSize = useCallback((size) => {
        setPaginationInfo((prev) => ({
            ...prev,
            size: size,
            currentPage: 1,
        }));
    }, []);

    const handleSearchValueChange = useCallback((value) => {
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        setSearchValue(value);
    }, []);
    return (
        <div>
            {listMovies ? (
                <NormalTable
                    name="movie"
                    labels={tableLabels}
                    data={listMovies}
                    pagination={paginationInfo}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                    onSelectSize={handleSelectSize}
                    onSearch={handleSearchValueChange}
                />
            ) : (
                <Skeleton height={600} />
            )}
        </div>
    );
}

export default MovieTable;
