// hooks/useAuth.js
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import useAuthStore from '@/store/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useInitiateRegistration() {
    const setRegistrationData = useAuthStore(
        (state) => state.setRegistrationData,
    );

    return useMutation({
        mutationFn: authApi.initiateRegistration,
        onSuccess: (data, variables) => {
            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    ...data.data,
                });
                toast.success(data.message);
            }
        },
        onError: (error) => {
            const message =
                error.response?.data?.message || 'Registration failed';
            toast.error(message);
        },
    });
}

export function useVerifyOtp() {
    const setRegistrationData = useAuthStore(
        (state) => state.setRegistrationData,
    );

    return useMutation({
        mutationFn: authApi.verifyOtp,
        onSuccess: (data, variables) => {
            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    verified: true,
                    nextStep: data.data.next_step,
                });
                toast.success('Phone verified successfully!');
            }
        },
        onError: (error) => {
            const message =
                error.response?.data?.message || 'Verification failed';
            toast.error(message);
        },
    });
}

export function useSetPassword() {
    const setAuth = useAuthStore((state) => state.setAuth); 
    const setRegistrationData = useAuthStore(
        (state) => state.setRegistrationData,
    );

    return useMutation({
        mutationFn: authApi.setPassword,
        onSuccess: (data) => {
            if (data.success) {
         // Automatically log the user in after setting password
                setAuth(data.data.user, data.data.token);
                
                setRegistrationData({
                    passwordSet: true,
                    nextStep: data.data.next_step,
                });
                toast.success('Password set successfully!');
            }
              // No need to redirect here - AuthGuard will handle it
        },
        onError: (error) => {
            const message =
                error.response?.data?.message || 'Failed to set password';
            toast.error(message);
        },
    });
}

export function useLogin() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            if (data.success) {
                setAuth(data.data.user, data.data.token);

                if (!data.data.profile_complete) {
                    router.push('/auth/complete-profile');
                } else {
                    router.push('/dashboard');
                }
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        },
    });
}

export function useLogout() {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearAuth();
            router.push('/auth/login');
        },
        onError: () => {
            clearAuth();
            router.push('/auth/login');
        },
    });
}
