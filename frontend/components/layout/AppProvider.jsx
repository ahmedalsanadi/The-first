// components/layout/AppProvider.jsx
'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '@/store/auth';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

export default function AppProvider({ children }) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </QueryClientProvider>
    );
}
