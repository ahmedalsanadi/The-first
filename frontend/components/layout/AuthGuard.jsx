// components/layout/AuthGuard.jsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/auth';

const publicRoutes = [
    '/auth/login',
    '/auth/register', 
    '/auth/verify-otp',
    '/auth/set-password',
];

const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-otp', 
    '/auth/set-password',
    '/auth/complete-profile',
];

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { 
        isAuthenticated, 
        user, 
        isLoading, 
        isProfileComplete, 
        getNextRequiredStep 
    } = useAuthStore();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        const isPublicRoute = publicRoutes.includes(pathname);
        const isAuthRoute = authRoutes.includes(pathname);

        console.log('AuthGuard check:', {
            pathname,
            isAuthenticated,
            isPublicRoute,
            isAuthRoute,
            user: user ? { id: user.id, profile_complete: isProfileComplete() } : null
        });

        // Not authenticated and trying to access protected route
        if (!isAuthenticated && !isPublicRoute) {
            console.log('Redirecting to login - not authenticated');
            router.replace('/auth/login');
            return;
        }

        // Authenticated user trying to access auth routes (except complete-profile)
        if (isAuthenticated && isAuthRoute && pathname !== '/auth/complete-profile') {
            // If profile is complete, go to dashboard
            if (isProfileComplete()) {
                console.log('Redirecting to dashboard - profile complete');
                router.replace('/dashboard');
                return;
            }
            
            // If profile incomplete, check what step is needed
            const nextStep = getNextRequiredStep();
            if (nextStep && nextStep !== pathname) {
                console.log('Redirecting to next step:', nextStep);
                router.replace(nextStep);
                return;
            }
        }

        // Authenticated user with incomplete profile trying to access protected routes
        if (isAuthenticated && !isPublicRoute && !isAuthRoute && !isProfileComplete()) {
            const nextStep = getNextRequiredStep();
            if (nextStep) {
                console.log('Redirecting to complete profile step:', nextStep);
                router.replace(nextStep);
                return;
            }
        }

    }, [isAuthenticated, user, pathname, router, isLoading, isProfileComplete, getNextRequiredStep]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return children;
}