// components/ui/FormSection.jsx
'use client';

import { cn } from '@/lib/utils';

export default function FormSection({
    title,
    description,
    children,
    className,
}) {
    return (
        <section className={cn('space-y-4', className)}>
            {(title || description) && (
                <header className="space-y-1">
                    {title && (
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-sm text-secondary-600 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </header>
            )}
            <div className="space-y-4">{children}</div>
        </section>
    );
}
