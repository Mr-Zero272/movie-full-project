import React from 'react';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '../globals.css';

export const metadata: Metadata = {
    title: 'Threads',
    description: 'A Next.js 14 Meta Threads Application',
};

const inter = Inter({ subsets: ['latin'] });

type Props = React.PropsWithChildren<{}>;

const RootLayout = ({ children }: Props) => {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="flex min-h-screen w-full items-center justify-center">{children}</div>
                </body>
            </html>
        </ClerkProvider>
    );
};

export default RootLayout;
