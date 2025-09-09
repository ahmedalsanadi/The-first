// src/components/ui/ThemeToggle.js
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={cn('p-2', className)}
            aria-label={`Switch to ${
                theme === 'light' ? 'dark' : 'light'
            } mode`}>
            {theme === 'light' ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </Button>
    );
}
