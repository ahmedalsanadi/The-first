// components/layout/ThemeProvider.jsx
'use client';

import { useEffect } from 'react';
import useAppStore from '@/store/app';

export default function ThemeProvider({ children }) {
    const { theme } = useAppStore();

    useEffect(() => {
        const root = window.document.documentElement;

        // Set the data-theme attribute for Tailwind v4 dark mode
        root.setAttribute('data-theme', theme);
    }, [theme]);

    return <>{children}</>;
}
