// components/layout/PageContainer.jsx
'use client';

import { cn } from '@/lib/utils';

export default function PageContainer({ children, className }) {
    return (
        <div
            className={cn(
                'min-h-[calc(100vh-0px)] w-full',
                'px-4 sm:px-6 lg:px-8',
                'py-6 sm:py-8 lg:py-10',
                'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800',
                className,
            )}>
            <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
    );
}
