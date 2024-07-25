'use client';

import { navbarLinks } from '@/constants';
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Bell, LogOut, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import Search from './Search';
import Sidebar from './Sidebar';
import { Separator } from '../ui/separator';
import ThemeButton from '../ui/theme-button';

type Props = {};

function Header({}: Props) {
    const { isLoaded } = useUser();
    const pathname = usePathname();
    return (
        <section className="fixed top-0 z-20 flex w-full justify-between bg-transparent px-5 py-2 shadow-md dark:border-b dark:border-b-gray-400 dark:shadow-none">
            <div className="flex items-center gap-x-5">
                <Sidebar />
                <Link href="/" className="hidden cursor-pointer items-center gap-x-2 sm:flex">
                    <Image src="/assets/logo.svg" alt="logo" width={40} height={40} />
                    <p className="hidden font-semibold md:inline-block">
                        Moon <span className="text-primary">M</span>ovie
                    </p>
                </Link>
            </div>

            <div className="flex items-center gap-x-6">
                <div className="hidden items-center gap-x-5 lg:flex">
                    {navbarLinks.map((link) => {
                        const isActive =
                            (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                        if (link.route === '/profile') link.route = `${link.route}/123`;
                        return (
                            <Link className="group font-medium tracking-wide" key={link.label} href={link.route}>
                                <p
                                    className={cn(
                                        'text-gray-500 transition-all duration-150 group-hover:scale-110 group-hover:text-gray-950 dark:hover:text-white',
                                        { 'text-gray-950 dark:text-white': isActive },
                                    )}
                                >
                                    {link.label}
                                </p>
                                <div
                                    className={cn(
                                        'h-0.5 w-0 rounded-lg bg-primary transition-all duration-150 ease-linear group-hover:w-full',
                                        { 'w-full': isActive },
                                    )}
                                ></div>
                            </Link>
                        );
                    })}
                </div>
                <Search />
                <SignedIn>
                    <Link href="/notifications" className="relative hidden lg:block">
                        <span className="absolute -top-1 right-0 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                        </span>
                        <Bell className="size-6 hover:text-primary" />
                    </Link>
                    <ThemeButton className="hidden lg:block" />
                    {isLoaded ? <UserButton /> : <Skeleton className="size-7 rounded-full" />}
                </SignedIn>
                <div className="hidden lg:block">
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button variant="link">Sign in</Button>
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </section>
    );
}

export default Header;
