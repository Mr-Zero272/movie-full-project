import { useDebounce } from '@/hooks';
import { fetchPaginationGenre, manageActions } from '@/store/manage-slice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody, Chip, Typography, Input, CardFooter, Button } from '@material-tailwind/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenreEditModal } from '@/components/Modal';
import hash from 'object-hash';

export function GenreCustomTable() {
    const genreData = useSelector((state) => state.manage.genre);
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editGenreValue, setEditGenreValue] = useState({ id: '', name: '' });

    const debounce = useDebounce(searchValue, 500);

    useEffect(() => {
        const q = debounce;
        let size = genreData.pagination.size;
        let cPage = genreData.pagination.currentPage;
        if (q !== '') {
            size = 6;
            cPage = 1;
        }
        dispatch(fetchPaginationGenre({ q, size, cPage }));
    }, [genreData.pagination.currentPage, debounce]);

    const handleSearchTableChange = (e) => {
        setSearchValue(e.target.value);
        dispatch(manageActions.updateQ({ type: 'genre', q: e.target.value }));
    };

    const handleNextPage = () => {
        dispatch(
            manageActions.updatePaginationInfo({
                type: 'genre',
                pagination: {
                    ...genreData.pagination,
                    currentPage: genreData.pagination.currentPage + 1,
                },
            }),
        );
    };

    const handlePrevPage = () => {
        dispatch(
            manageActions.updatePaginationInfo({
                type: 'genre',
                pagination: {
                    ...genreData.pagination,
                    currentPage: genreData.pagination.currentPage - 1,
                },
            }),
        );
    };

    const handleChangeFormEdit = (e) => {
        setEditGenreValue((prev) => ({
            ...prev,
            name: e.target.value,
        }));
    };

    const handleOpenGenreEditModal = useCallback(() => {
        setIsOpenModal((prev) => !prev);
    }, []);

    const handleEditClick = (id, name) => {
        setIsOpenModal(true);
        setEditGenreValue((prev) => ({
            ...prev,
            id,
            name,
        }));
    };

    return (
        <>
            <GenreEditModal
                isOpen={isOpenModal}
                onToggle={handleOpenGenreEditModal}
                genreInfo={editGenreValue}
                onChange={handleChangeFormEdit}
            />
            <Card className="mt-4">
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-8 p-6 flex items-center place-content-between"
                >
                    <Typography variant="h6" color="white">
                        Genres Table
                    </Typography>

                    <div className="md:w-60 xl:w-72">
                        <Input
                            label="Search"
                            color="white"
                            value={searchValue}
                            onChange={handleSearchTableChange}
                            icon={<MagnifyingGlassIcon color="white" className="h-5 w-5" />}
                        />
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {['id', 'genre', 'last update', ''].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {genreData.data?.length !== 0 &&
                                genreData.data.map(({ id, name, lastUpdate }, key) => {
                                    const className = `py-3 px-5 ${
                                        key === genreData.data.length - 1 ? '' : 'border-b border-blue-gray-50'
                                    }`;

                                    return (
                                        <tr key={name}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {id}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Chip
                                                    variant="gradient"
                                                    color="blue-gray"
                                                    value={name}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                />
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {lastUpdate}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography
                                                    as="button"
                                                    className="text-xs font-semibold text-blue-gray-600"
                                                    onClick={() => handleEditClick(id, name)}
                                                >
                                                    Edit
                                                </Typography>
                                                <Typography
                                                    as="button"
                                                    color="red"
                                                    className="text-xs font-semibold text-blue-gray-600 inline"
                                                    onClick={() => alert('delete')}
                                                >
                                                    Delete
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {genreData.pagination.currentPage} of {genreData.pagination.totalPage}
                    </Typography>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={genreData.pagination.currentPage === 1}
                            onClick={handlePrevPage}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={genreData.pagination.currentPage === genreData.pagination.totalPage}
                            onClick={handleNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default GenreCustomTable;
