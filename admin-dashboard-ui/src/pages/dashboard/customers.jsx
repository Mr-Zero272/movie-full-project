import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Input,
    CardFooter,
    Button,
} from '@material-tailwind/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { authorsTableData, projectsTableData } from '@/data';
import { useEffect, useState } from 'react';
import { authService } from '@/apiServices';
import { format } from 'date-fns';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce, useNotify } from '@/hooks';

export function Customers() {
    const notify = useNotify();
    const [listUsers, setListUsers] = useState(null);
    const [paginationInfo, setPaginationInfo] = useState(() => ({
        currentPage: 1,
        size: 6,
        totalPage: 5,
        totalResult: 26,
    }));
    const [tableControl, setTableControl] = useState(() => ({
        searchValue: '',
        nextPageTotal: 0,
        prevPageTotal: 0,
    }));

    const tableControlValueDebounce = useDebounce(tableControl, 500);

    useEffect(() => {
        const fetchListUsers = async () => {
            const token = localStorage.getItem('token');
            const res = await authService.search(
                tableControlValueDebounce.searchValue,
                paginationInfo.size,
                paginationInfo.currentPage,
                token,
            );
            if (res) {
                setListUsers(res.data);
                setPaginationInfo(res.pagination);
            } else {
                notify('Fetch data error!', 'error');
            }
        };

        fetchListUsers();
    }, [paginationInfo.size, paginationInfo.currentPage, tableControlValueDebounce.searchValue]);

    useEffect(() => {
        if (paginationInfo.currentPage + tableControlValueDebounce.nextPageTotal <= paginationInfo.totalPage) {
            setPaginationInfo((prev) => ({
                ...prev,
                currentPage: prev.currentPage + tableControlValueDebounce.nextPageTotal,
            }));
            setTableControl((prev) => ({
                ...prev,
                nextPageTotal: 0,
            }));
        } else {
            setPaginationInfo((prev) => ({
                ...prev,
                currentPage: paginationInfo.totalPage,
            }));
            setTableControl((prev) => ({
                ...prev,
                nextPageTotal: 0,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableControlValueDebounce.nextPageTotal]);

    useEffect(() => {
        if (paginationInfo.currentPage - tableControlValueDebounce.prevPageTotal > 0) {
            setPaginationInfo((prev) => ({
                ...prev,
                currentPage: prev.currentPage - tableControlValueDebounce.prevPageTotal,
            }));
            setTableControl((prev) => ({
                ...prev,
                nextPageTotal: 0,
            }));
        } else {
            setPaginationInfo((prev) => ({
                ...prev,
                currentPage: 1,
            }));
            setTableControl((prev) => ({
                ...prev,
                nextPageTotal: 0,
            }));
            // notify('This is the first page!', 'error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableControlValueDebounce.prevPageTotal]);

    // handle table effect
    const handleSearchChange = (e) => {
        setTableControl((prev) => ({
            ...prev,
            searchValue: e.target.value,
        }));
        setPaginationInfo((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    };

    const handleNextPage = () => {
        setTableControl((prev) => ({
            ...prev,
            nextPageTotal: prev.nextPageTotal + 1,
        }));
    };

    const handlePrevPage = () => {
        setTableControl((prev) => ({
            ...prev,
            prevPageTotal: prev.prevPageTotal + 1,
        }));
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between">
                    <Typography variant="h6" color="white">
                        Customers Table
                    </Typography>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            color="white"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={tableControl.searchValue}
                            onChange={handleSearchChange}
                        />
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {['user', 'function', 'role', 'created at', ''].map((el) => (
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
                            {listUsers &&
                                listUsers.map(
                                    (
                                        { avatar, username, email, id, phoneNumber, role, createdAt, modifiedAt },
                                        key,
                                    ) => {
                                        const className = `py-3 px-5 ${
                                            key === authorsTableData.length - 1 ? '' : 'border-b border-blue-gray-50'
                                        }`;

                                        return (
                                            <tr key={id}>
                                                <td className={className}>
                                                    <div className="flex items-center gap-4">
                                                        <Avatar
                                                            src={avatar}
                                                            alt={username}
                                                            size="sm"
                                                            variant="rounded"
                                                        />
                                                        <div>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-semibold"
                                                            >
                                                                {username}
                                                            </Typography>
                                                            <Typography className="text-xs font-normal text-blue-gray-500">
                                                                {email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {phoneNumber}
                                                    </Typography>
                                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                                        {format(modifiedAt, 'yyyy-MM-dd HH:mm:ss')}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Chip
                                                        variant="gradient"
                                                        color={
                                                            role === 'ADMIN' || role === 'MOVIE_BUSINESS'
                                                                ? 'green'
                                                                : 'blue-gray'
                                                        }
                                                        value={role}
                                                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                    />
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        className="text-xs font-semibold text-blue-gray-600"
                                                    >
                                                        Edit
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    {listUsers ? (
                        <>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                                {paginationInfo.currentPage} of {paginationInfo.totalPage}
                            </Typography>
                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    disabled={paginationInfo.currentPage === 1}
                                    onClick={handlePrevPage}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    disabled={paginationInfo.currentPage === paginationInfo.totalPage}
                                    onClick={handleNextPage}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="animate-pulse w-full flex justify-between items-center">
                            <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="flex gap-2">
                                <div className="h-8 bg-gray-200 rounded-lg dark:bg-gray-700 w-32 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded-lg dark:bg-gray-700 w-32 mb-4"></div>
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Projects Table
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {['companies', 'members', 'budget', 'completion', ''].map((el) => (
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
                            {projectsTableData.map(({ img, name, members, budget, completion }, key) => {
                                const className = `py-3 px-5 ${
                                    key === projectsTableData.length - 1 ? '' : 'border-b border-blue-gray-50'
                                }`;

                                return (
                                    <tr key={name}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={img} alt={name} size="sm" />
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {name}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            {members.map(({ img, name }, key) => (
                                                <Tooltip key={name} content={name}>
                                                    <Avatar
                                                        src={img}
                                                        alt={name}
                                                        size="xs"
                                                        variant="circular"
                                                        className={`cursor-pointer border-2 border-white ${
                                                            key === 0 ? '' : '-ml-2.5'
                                                        }`}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600"
                                            >
                                                {budget}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="w-10/12">
                                                <Typography
                                                    variant="small"
                                                    className="mb-1 block text-xs font-medium text-blue-gray-600"
                                                >
                                                    {completion}%
                                                </Typography>
                                                <Progress
                                                    value={completion}
                                                    variant="gradient"
                                                    color={completion === 100 ? 'green' : 'gray'}
                                                    className="h-1"
                                                />
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                className="text-xs font-semibold text-blue-gray-600"
                                            >
                                                <EllipsisVerticalIcon
                                                    strokeWidth={2}
                                                    className="h-5 w-5 text-inherit"
                                                />
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default Customers;
