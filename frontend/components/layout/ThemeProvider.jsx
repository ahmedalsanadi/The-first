// components/layout/ThemeProvider.jsx
'use client';

import { useEffect } from 'react';
import useAppStore from '@/store/app';

export default function ThemeProvider({ children }) {
    const { theme, language, isRTL } = useAppStore();

    useEffect(() => {
        const root = window.document.documentElement;
        // Set theme
        root.setAttribute('data-theme', theme);
        // Set direction and language for RTL/LTR support
        root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        root.setAttribute('lang', language || (isRTL ? 'ar' : 'en'));
    }, [theme, language, isRTL]);

    return <>{children}</>;
}
