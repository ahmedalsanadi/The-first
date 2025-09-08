// app/auth/complete-profile/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema } from '@/lib/validations/auth';
import useAuthStore from '@/store/auth';
import { useCities, useProfessions } from '@/hooks/useData';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, setUser } = useAuthStore();

    const { data: cities } = useCities(user?.country_id);
    const { data: professions } = useProfessions();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            city_id: user?.city_id?.toString() || '',
            profession_id: user?.profession_id?.toString() || '',
            birth_date: user?.birth_date || '',
            gender: user?.gender || '',
        },
    });

    // Redirect logic - Let AuthGuard handle all redirections
    useEffect(() => {
        console.log('Current token:', localStorage.getItem('auth_token'));
        console.log('Is authenticated:', isAuthenticated);
        console.log('User:', user);
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        // If profile is already complete, redirect to dashboard
        if (user?.profile_complete) {
            router.push('/dashboard');
            return;
        }
    }, [isAuthenticated, user, router]);

    const { mutate: completeProfile, isPending } = useMutation({
        mutationFn: authApi.completeProfile,
        onSuccess: (response) => {
            console.log('Complete profile response:', response);
            if (response.success) {
                setUser(response.data.user);
                toast.success('Profile updated successfully!');
                
                // Let AuthGuard handle the redirection based on updated user state
            }
        },
        onError: (error) => {
            console.error('Complete profile error:', error);
            console.error('Error response:', error.response);

            const message =
                error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        },
    });

    const onSubmit = (data) => {
        const profileData = {
            ...data,
            city_id: data.city_id ? parseInt(data.city_id) : undefined,
            profession_id: data.profession_id ? parseInt(data.profession_id) : undefined,
        };

        // Remove empty values
        Object.keys(profileData).forEach((key) => {
            if (profileData[key] === '' || profileData[key] === null || profileData[key] === undefined) {
                delete profileData[key];
            }
        });
        console.log('Submitting profile data:', profileData);

        completeProfile(profileData);
    };

    // Check if profession is required based on missing steps
    const isProfessionRequired = user?.missing_steps?.includes('profession_selected');
    const canSkip = user && !isProfessionRequired;

    if (!isAuthenticated || !user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-secondary-900">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription>
                        Help us personalize your experience
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            {...register('name')}
                            error={errors.name?.message}
                            disabled={isPending}
                        />

                        <Input
                            label="Email (Optional)"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            error={errors.email?.message}
                            disabled={isPending}
                        />

                        <Select
                            label="City"
                            {...register('city_id')}
                            error={errors.city_id?.message}
                            disabled={isPending}
                            placeholder="Select your city">
                            {cities?.map((city) => (
                                <option key={city.id} value={city.id.toString()}>
                                    {city.name_ar} - {city.name}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Profession"
                            {...register('profession_id')}
                            error={errors.profession_id?.message}
                            disabled={isPending}
                            placeholder="Select your profession"
                            required={isProfessionRequired}>
                            <option value="">Select your profession</option>
                            {professions?.map((profession) => (
                                <option key={profession.id} value={profession.id.toString()}>
                                    {profession.name_ar} - {profession.name}
                                </option>
                            ))}
                        </Select>

                        <Input
                            label="Date of Birth (Optional)"
                            type="date"
                            {...register('birth_date')}
                            error={errors.birth_date?.message}
                            disabled={isPending}
                        />

                        <Select
                            label="Gender (Optional)"
                            {...register('gender')}
                            error={errors.gender?.message}
                            disabled={isPending}
                            placeholder="Select your gender">
                            <option value="">Select gender</option>
                            <option value="male">Male - ذكر</option>
                            <option value="female">Female - أنثى</option>
                        </Select>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full"
                                loading={isPending}
                                disabled={isPending}>
                                {isPending ? 'Updating...' : 'Complete Profile'}
                            </Button>

                            {canSkip && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => router.push('/dashboard')}>
                                    Skip for now
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
