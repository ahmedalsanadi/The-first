// components/layout/AuthGuard.jsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PUBLIC_ROUTES = ['/'];

const AUTH_ROUTES = [
    '/auth/register',
    '/auth/verify-otp',
    '/auth/set-password',
    '/auth/login',
    '/auth/complete-profile',
];

const PROTECTED_ROUTES = [
    '/dashboard',
    '/profile',
    '/products',
    '/ads',
    '/affiliate',
    '/city',
];

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const {
        isAuthenticated,
        user,
        isLoading,
        isProfileComplete,
        getNextRequiredStep,
        getCurrentRegistrationStep,
        isRegistrationDataValid,
        error,
    } = useAuthStore();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
        const isAuthRoute = AUTH_ROUTES.includes(pathname);
        const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
            pathname.startsWith(route),
        );

        console.log('AuthGuard Navigation Check:', {
            pathname,
            isAuthenticated,
            isPublicRoute,
            isAuthRoute,
            isProtectedRoute,
            profileComplete: isAuthenticated ? isProfileComplete() : false,
            user: user
                ? { id: user.id, steps: user.profile_completion_steps }
                : null,
        });

        // Handle authenticated users
        if (isAuthenticated && user) {
            const profileComplete = isProfileComplete();

            // Redirect from auth routes to appropriate destination
            if (isAuthRoute) {
                if (profileComplete) {
                    console.log('✓ Profile complete, redirecting to dashboard');
                    router.replace('/dashboard');
                    return;
                }

                // Check if user is on the correct step
                const nextStep = getNextRequiredStep();
                if (nextStep && nextStep !== pathname) {
                    console.log(
                        '→ Redirecting to next required step:',
                        nextStep,
                    );
                    router.replace(nextStep);
                    return;
                }
            }

            // Block protected routes if profile incomplete
            if (isProtectedRoute && !profileComplete) {
                const nextStep = getNextRequiredStep();
                if (nextStep) {
                    console.log(
                        '⚠ Profile incomplete, redirecting to:',
                        nextStep,
                    );
                    router.replace(nextStep);
                    return;
                }
            }

            // Allow access to current route
            return;
        }

        // Handle unauthenticated users
        if (!isAuthenticated) {
            // Allow public routes
            if (isPublicRoute) return;

            // Block protected routes
            if (isProtectedRoute) {
                console.log(
                    '🔒 Protected route access denied, redirecting to login',
                );
                router.replace('/auth/login');
                return;
            }

            // Handle auth flow routes
            if (isAuthRoute) {
                // For login, allow access
                if (pathname === '/auth/login') return;

                // For other auth routes, check registration flow
                const correctStep = getCurrentRegistrationStep();
                if (correctStep !== pathname) {
                    console.log(
                        '→ Redirecting to correct registration step:',
                        correctStep,
                    );
                    router.replace(correctStep);
                    return;
                }
            }
        }
    }, [
        isAuthenticated,
        user,
        pathname,
        router,
        isLoading,
        isProfileComplete,
        getNextRequiredStep,
        getCurrentRegistrationStep,
    ]);

    // Show loading spinner
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">
                        Authentication Error
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return children;
}
