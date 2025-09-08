// app/layout.js
import { Inter } from 'next/font/google';
import AppProvider from '@/components/layout/AppProvider';
import AuthGuard from '@/components/layout/AuthGuard';
import ThemeProvider from '@/components/layout/ThemeProvider'; 
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Building Equipment Platform',
    description: 'Platform for building equipment and construction materials',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body className={inter.className}>
                <AppProvider>
                    <ThemeProvider>
                        <AuthGuard>{children}</AuthGuard>
                    </ThemeProvider>
                </AppProvider>
            </body>
        </html>
    );
}