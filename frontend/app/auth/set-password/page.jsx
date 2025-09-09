// app/auth/set-password/page.jsx - CLEANED UP VERSION
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPasswordSchema } from '@/lib/validations/auth';
import { useSetPassword } from '@/hooks/useAuth';
import useAuthStore from '@/store/auth';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';

export default function SetPasswordPage() {
    const router = useRouter();
    const { registrationData, isAuthenticated, user } = useAuthStore();
    const { mutate: setPassword, isPending } = useSetPassword();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
    });

    const watchedPassword = watch('password');

    // Basic redirect logic - let AuthGuard handle the complex logic
    useEffect(() => {
        if (
            isAuthenticated &&
            user?.profile_completion_steps?.includes('password_set')
        ) {
            // Password already set, let AuthGuard handle redirection
            return;
        }

        // Check if we have registration data for unauthenticated users
        if (!isAuthenticated && !registrationData?.verified) {
            router.push('/auth/register');
            return;
        }
    }, [isAuthenticated, registrationData, router, user]);

    const onSubmit = (data) => {
        setPassword({
            phone: registrationData.phone,
            country_code: registrationData.country_code,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });
    };

    // Show loading if we're waiting for proper state
    if (isAuthenticated && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Set Your Password
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Create a secure password for your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        <PasswordInput
                            label="Password"
                            placeholder="Create a password"
                            {...register('password')}
                            value={watchedPassword}
                            error={errors.password?.message}
                            disabled={isPending}
                            showStrength={true}
                        />

                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            {...register('password_confirmation')}
                            error={errors.password_confirmation?.message}
                            disabled={isPending}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isPending}
                            disabled={isPending}>
                            {isPending ? 'Setting Password...' : 'Set Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
