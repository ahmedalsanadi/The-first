// components/ui/Input.js
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(
    (
        {
            className,
            type = 'text',
            error,
            label,
            placeholder,
            required,
            ...props
        },
        ref,
    ) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        className={cn(
                            'block text-sm font-medium text-gray-700 dark:text-gray-300',
                            required &&
                                "after:content-['*'] after:text-red-500 after:ml-1",
                        )}>
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-primary-400',
                        error &&
                            'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400',
                        className,
                    )}
                    placeholder={placeholder}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
