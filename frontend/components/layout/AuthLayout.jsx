// components/layout/AuthLayout.jsx
'use client';

import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Building Platform
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Professional construction equipment marketplace
                    </p>
                </div>

                {children}
            </div>
        </div>
    );
}
