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
                            'block text-sm font-medium text-secondary-700',
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
                            error && 'border-red-500 focus:ring-red-500',
                            className,
                        )}
                        ref={ref}
                        {...props}>
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {children}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400 pointer-events-none" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';

export default Select;
