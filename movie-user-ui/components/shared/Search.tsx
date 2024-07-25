'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuItem } from '../ui/dropdown-menu-custom';
import { LoaderCircle } from 'lucide-react';

type Props = {};

function Search({}: Props) {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const debounced = useDebounce<string>(searchValue, 500);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        if (inputRef.current !== null) {
            inputRef.current.focus();
        }
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            // const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${debounced}`, {
            //     headers: {
            //         Authorization:
            //             'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTQxODgzNDUzN2I0MThjYWE2MGYxYTM1Njk5YWFlNSIsIm5iZiI6MTcyMTMxODM3NS4wNzQ5MzQsInN1YiI6IjY2OTkzYWVhZGExMjIxZjdmM2NlOWI5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G-fUWJhJCjqA0MbSnzUZ0j1cyUrNOSdBQT1Fih8CHik',
            //     },
            // });
            // const data = await response.json();
            // TODO: delete this block code
            const res = await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
            const fakeData = ['result 1', 'result 2'];
            fakeData.push(debounced);
            setSearchResult(fakeData);

            setLoading(false);
        };

        if (searchResult.some((r) => r === debounced)) {
            return;
        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const indexSearchKeyword = searchResult.indexOf(searchValue);
        if (e.key === 'ArrowDown') {
            if (indexSearchKeyword === searchResult.length - 1) {
                setSearchValue(searchResult[0]);
            } else if (indexSearchKeyword + 1 < searchResult.length) {
                setSearchValue(searchResult[indexSearchKeyword + 1]);
            }
        } else if (e.key === 'ArrowUp') {
            if (indexSearchKeyword === 0) {
                setSearchValue(searchResult[searchResult.length - 1]);
            } else {
                setSearchValue(searchResult[indexSearchKeyword - 1]);
            }
        }
    };

    const handleSubmit = (e: React.MouseEvent) => {
        setShowResult(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            router.push('/search');
        }
    };

    return (
        <form className="relative w-56 rounded-xl border-2 border-gray-300 px-3 focus-within:border-primary sm:w-64">
            <div className="relative flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 dark:fill-white"
                >
                    <motion.path
                        variants={{
                            hidden: {
                                pathLength: 0,
                                fill: 'rgba(255, 255, 255, 0)',
                            },
                            visible: {
                                pathLength: 1,
                                fill: 'rgba(255, 255, 255, 1)',
                            },
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <Input
                    ref={inputRef}
                    className="no-focus mr-4 border-none bg-transparent outline-none"
                    value={searchValue}
                    placeholder="Search..."
                    onFocus={() => setShowResult(true)}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleOnKeyDown}
                />
                {showResult && searchResult && searchResult.length > 0 && (
                    <DropdownMenu
                        className="absolute -left-4 top-12 w-56 sm:w-64"
                        title="Movie"
                        onOutSideClick={handleHideResult}
                    >
                        {searchResult.slice(0, searchResult.length - 1).map((result) => (
                            <DropdownMenuItem key={result} isFocused={searchValue === result}>
                                {result}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenu>
                )}
                {loading && <LoaderCircle className="size-6 animate-spin dark:text-white" />}
                {searchValue && !loading && (
                    <button className="absolute right-0" onClick={handleClear}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
}

export default Search;
