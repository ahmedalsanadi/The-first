// src/components/layout/AuthLayout.jsx
'use client';

import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            {children}
        </div>
    );
}
