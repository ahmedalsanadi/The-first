// hooks/useTheme.js
import { useEffect } from 'react';
import useAppStore from '@/store/app';

export function useTheme() {
    const { theme, setTheme } = useAppStore();

    useEffect(() => {
        // Check system preference on initial load if no theme is set
        if (!theme) {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches
                ? 'dark'
                : 'light';
            setTheme(systemTheme);
        }
        // ThemeProvider is responsible for applying attributes to <html>
    }, [theme, setTheme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme, setTheme };
}
