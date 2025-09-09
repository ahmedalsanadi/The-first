// app/auth/complete-profile/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema } from '@/lib/validations/auth';
import useAuthStore from '@/store/auth';
import { useCities, useProfessions } from '@/hooks/useData';
import { useCompleteProfile } from '@/hooks/useAuth';
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

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isProfileComplete, getMissingSteps } =
        useAuthStore();

    const { data: cities } = useCities(user?.country_id);
    const { data: professions } = useProfessions();
    const { mutate: completeProfile, isPending } = useCompleteProfile();

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

    // Basic auth check - let AuthGuard handle detailed redirections
    useEffect(() => {
        if (!isAuthenticated) {
            return; // AuthGuard will handle
        }

        // If profile is already complete, redirect to dashboard
        if (isProfileComplete()) {
            router.replace('/dashboard');
            return;
        }
    }, [isAuthenticated, isProfileComplete, router]);

    const onSubmit = (data) => {
        const profileData = {
            ...data,
            city_id: data.city_id ? parseInt(data.city_id) : undefined,
            profession_id: data.profession_id
                ? parseInt(data.profession_id)
                : undefined,
        };

        // Remove empty values
        Object.keys(profileData).forEach((key) => {
            if (
                profileData[key] === '' ||
                profileData[key] === null ||
                profileData[key] === undefined
            ) {
                delete profileData[key];
            }
        });

        console.log('Submitting profile data:', profileData);
        completeProfile(profileData);
    };

    // Check what steps are missing
    const missingSteps = getMissingSteps();
    const isProfessionRequired = missingSteps.includes('profession_selected');

    // Can skip if only optional fields are missing
    const canSkip = missingSteps.length === 0;

    if (!isAuthenticated || !user) {
        return null; // AuthGuard will redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-secondary-900">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription>
                        {isProfessionRequired
                            ? 'Please select your profession to continue'
                            : 'Help us personalize your experience'}
                    </CardDescription>
                    {missingSteps.length > 0 && (
                        <div className="text-sm text-orange-600 mt-2">
                            Missing: {missingSteps.join(', ')}
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
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
                            <option value="">Select your city</option>
                            {cities?.map((city) => (
                                <option
                                    key={city.id}
                                    value={city.id.toString()}>
                                    {city.name_ar} - {city.name}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label={`Profession ${
                                isProfessionRequired ? '*' : '(Optional)'
                            }`}
                            {...register('profession_id')}
                            error={errors.profession_id?.message}
                            disabled={isPending}
                            placeholder="Select your profession"
                            required={isProfessionRequired}>
                            <option value="">Select your profession</option>
                            {professions?.map((profession) => (
                                <option
                                    key={profession.id}
                                    value={profession.id.toString()}>
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
                                    onClick={() =>
                                        router.replace('/dashboard')
                                    }>
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
