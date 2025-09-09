// components/ui/Select.js
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

const Select = forwardRef(
    (
        { className, children, label, error, placeholder, required, ...props },
        ref,
    ) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        className={cn(
                            'block text-sm font-medium text-secondary-700 dark:text-secondary-300',
                            required &&
                                "after:content-['*'] after:text-red-500 after:ml-1",
                        )}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            'flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
                            'ltr:pr-8 rtl:pl-8',
                            'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary-400',
                            error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
                            className,
                        )}
                        ref={ref}
                        {...props}>
                        {placeholder && (
                            <option value="" disabled className="dark:bg-gray-800 dark:text-white">
                                {placeholder}
                            </option>
                        )}
                        {children}
                    </select>
                    <ChevronDown className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400 dark:text-secondary-500 pointer-events-none ltr:right-3 rtl:left-3" />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';

export default Select;