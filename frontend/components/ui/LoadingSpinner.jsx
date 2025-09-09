// components/ui/LoadingSpinner.jsx
'use client';

export default function LoadingSpinner({
    size = 'default',
    text = 'Loading...',
}) {
    const sizeClasses = {
        small: 'h-4 w-4',
        default: 'h-8 w-8',
        large: 'h-12 w-12',
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div
                className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
            {text && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {text}
                </p>
            )}
        </div>
    );
}
