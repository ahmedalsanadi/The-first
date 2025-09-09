// app/layout.js
import { Inter } from 'next/font/google';
import AppProvider from '@/components/layout/AppProvider';
import AuthGuard from '@/components/layout/AuthGuard';
import ThemeProvider from '@/components/layout/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Building Equipment Platform',
    description: 'Platform for building equipment and construction materials',
};

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning>
            <body className={inter.className}>
                <AppProvider>
                    <ThemeProvider>
                        <Navbar />
                        <AuthGuard>{children}</AuthGuard>
                    </ThemeProvider>
                </AppProvider>
            </body>
        </html>
    );
}
