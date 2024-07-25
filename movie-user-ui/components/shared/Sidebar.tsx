import React from 'react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { navbarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Bell, LogIn, LogOut, Moon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import ThemeButton from '../ui/theme-button';

type Props = {};

function Sidebar({}: Props) {
    const pathname = usePathname();

    return (
        <div className="block lg:hidden">
            <Sheet>
                <SheetTrigger>
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
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                    <SheetHeader className="mb-5">
                        <SheetTitle>
                            <p className="font-semibold">
                                Moon <span className="text-primary">M</span>ovie
                            </p>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex h-[calc(100%_-_48px)] flex-col justify-between">
                        <div>
                            {navbarLinks.map((link) => {
                                const isActive =
                                    (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                                if (link.route === '/profile') link.route = `${link.route}/123`;
                                return (
                                    <SheetClose asChild key={link.label}>
                                        <Link
                                            className={cn(
                                                'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                                { 'bg-accent text-gray-950 dark:text-white': isActive },
                                            )}
                                            href={link.route}
                                        >
                                            {link.icon}

                                            <p
                                                className={cn('ml-3 w-full text-gray-500 transition-all duration-150', {
                                                    'text-gray-950 dark:text-white': isActive,
                                                })}
                                            >
                                                {link.label}
                                            </p>
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </div>
                        <div>
                            <Separator orientation="horizontal" />
                            <SignedIn>
                                <SheetClose asChild>
                                    <Link
                                        className={cn(
                                            'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                            {
                                                'bg-accent text-gray-950 dark:text-white':
                                                    pathname.includes('/notifications') ||
                                                    pathname === '/notifications',
                                            },
                                        )}
                                        href={'/notifications'}
                                    >
                                        <Bell className="size-6" />

                                        <div className="flex w-full items-center justify-between">
                                            <p
                                                className={cn('ml-3 text-gray-500 transition-all duration-150', {
                                                    'text-gray-950 dark:text-white':
                                                        pathname.includes('/notifications') ||
                                                        pathname === '/notifications',
                                                })}
                                            >
                                                Notifications
                                            </p>
                                            <Badge>12</Badge>
                                        </div>
                                    </Link>
                                </SheetClose>

                                <div
                                    className={cn(
                                        'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                        {
                                            'bg-accent text-gray-950 dark:text-white':
                                                pathname.includes('/notifications') || pathname === '/notifications',
                                        },
                                    )}
                                >
                                    <Moon className="size-6" />

                                    <div className="flex w-full items-center justify-between">
                                        <p
                                            className={cn('ml-3 text-gray-500 transition-all duration-150', {
                                                'text-gray-950 dark:text-white':
                                                    pathname.includes('/notifications') ||
                                                    pathname === '/notifications',
                                            })}
                                        >
                                            Dark mode
                                        </p>
                                        <ThemeButton isSwitch />
                                    </div>
                                </div>

                                <SignOutButton redirectUrl="/sign-in">
                                    <SheetClose asChild>
                                        <div
                                            className={cn(
                                                'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                            )}
                                        >
                                            <LogOut className="size-6" />

                                            <p className={cn('ml-3 w-full text-gray-500 transition-all duration-150')}>
                                                Sign out
                                            </p>
                                        </div>
                                    </SheetClose>
                                </SignOutButton>
                            </SignedIn>

                            <SignedOut>
                                <SheetClose asChild>
                                    <Link
                                        href="/sign-in"
                                        className={cn(
                                            'group flex items-center rounded-lg px-4 py-3 font-medium tracking-wide text-gray-500 hover:bg-accent',
                                        )}
                                    >
                                        <LogIn className="size-6" />

                                        <p className={cn('ml-3 w-full text-gray-500 transition-all duration-150')}>
                                            Sign in
                                        </p>
                                    </Link>
                                </SheetClose>
                            </SignedOut>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default Sidebar;
