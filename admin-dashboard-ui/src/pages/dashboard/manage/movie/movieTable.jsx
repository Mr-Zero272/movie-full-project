import { movieService } from '@/apiServices';
import NormalTable from '@/components/CustomTable/NormalTable';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const tableLabelsBusiness = ['title', 'director', 'state', 'releaseDate', 'action'];
const tableLabelsAdmin = ['title', 'director', 'releaseDate', 'state', 'action'];

function MovieTable() {
    const currentUserRole = useSelector((state) => state.user.role);
    const [listMovies, setListMovies] = useState();
    const { pathname } = useLocation();
    const [paginationInfo, setPaginationInfo] = useState(() => ({
        currentPage: 1,
        size: 7,
        totalPage: 0,
        totalResult: 0,
    }));
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchGenreLists = async (name, size, cPage) => {
            const token = localStorage.getItem('token');
            const res = await movieService.searchMovie(name, size, cPage, token);
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
        // console.log(nextPage);
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
                    labels={currentUserRole === 'ADMIN' ? tableLabelsAdmin : tableLabelsBusiness}
                    data={listMovies}
                    actionCol
                    linkToAction={'/update/'}
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
