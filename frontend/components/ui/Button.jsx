// components/ui/Button.jsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Button = forwardRef(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            children,
            disabled,
            loading,
            ...props
        },
        ref,
    ) => {
        const baseClasses =
            'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary:
                'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
            secondary:
                'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
            outline:
                'border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500',
            ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-10 px-4 text-sm',
            lg: 'h-11 px-6 text-base',
            xl: 'h-12 px-8 text-base',
        };

        return (
            <button
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    className,
                )}
                ref={ref}
                disabled={disabled || loading}
                {...props}>
                {loading && (
                    <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
