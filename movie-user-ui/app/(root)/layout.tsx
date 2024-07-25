import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/shared/Header';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Moon Movie (Make your night bright)',
    description: 'NextJs Moon Movie application',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                        <Header />
                        <main>{children}</main>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
