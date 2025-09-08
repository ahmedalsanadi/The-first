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
    const { isAuthenticated, user, isLoading } = useAuthStore();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        const isPublicRoute = publicRoutes.includes(pathname);
        const isAuthRoute = authRoutes.includes(pathname);

        if (!isAuthenticated && !isPublicRoute) {
            router.push('/auth/login');
            return;
        }

        if (
            isAuthenticated &&
            isAuthRoute &&
            pathname !== '/auth/complete-profile'
        ) {
            router.push('/dashboard');
            return;
        }

        // Check if profile is incomplete
        if (
            isAuthenticated &&
            user &&
            !user?.profile_complete &&
            pathname !== '/auth/complete-profile'
        ) {
            // Check specific missing steps and redirect accordingly
            if (user.missing_steps?.includes('password')) {
                router.push('/auth/set-password');
            } else if (user.missing_steps?.includes('profession')) {
                router.push('/auth/complete-profile');
            }
            //  else if (user.missing_steps?.includes('address')) {
            //     router.push('/auth/complete-address'); // You need to create this
            // }

            return;
        }
    }, [isAuthenticated, user, pathname, router, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return children;
}
