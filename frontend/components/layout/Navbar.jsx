'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ROUTES, ENV } from '@/config/constants';
import useAuthStore from '@/store/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import DirectionToggle from '@/components/ui/DirectionToggle';
import LogoutButton from '@/components/auth/LogoutButton';

export default function Navbar() {
    const { isAuthenticated, user } = useAuthStore((s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
    }));

    const links = useMemo(() => {
        const base = [{ href: ROUTES.HOME, label: 'Home', show: true }];
        const authed = [
            {
                href: ROUTES.DASHBOARD,
                label: 'Dashboard',
                show: isAuthenticated,
            },
            { href: ROUTES.PROFILE, label: 'Profile', show: isAuthenticated },
        ];
        const unauth = [
            { href: ROUTES.LOGIN, label: 'Login', show: !isAuthenticated },
            {
                href: ROUTES.REGISTER,
                label: 'Register',
                show: !isAuthenticated,
            },
        ];
        return [...base, ...authed, ...unauth].filter((l) => l.show);
    }, [isAuthenticated]);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-secondary-200 dark:border-dark-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href={ROUTES.HOME}
                        className="text-primary-700 dark:text-primary-400 font-semibold">
                        {ENV.APP_NAME}
                    </Link>
                    <div className="hidden sm:flex items-center gap-4 text-secondary-700 dark:text-gray-300">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <DirectionToggle />
                    <ThemeToggle />
                    {isAuthenticated && <LogoutButton />}
                </div>
            </nav>
        </header>
    );
}
