// hooks/useAuth.js - ENHANCED VERSION
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
            console.log('Initiate registration response:', data);
            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    exists: data.data.exists,
                    verified: false,
                });
                toast.success(data.message);
            }
        },
        onError: (error) => {
            console.error('Registration initiation error:', error);
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
            console.log('Verify OTP response:', data);
            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    verified: true,
                    passwordSet: false,
                });
                toast.success('Phone verified successfully!');
            }
        },
        onError: (error) => {
            console.error('OTP verification error:', error);
            const message =
                error.response?.data?.message || 'Verification failed';
            toast.error(message);
        },
    });
}

export function useSetPassword() {
    const { setAuth, clearRegistrationData } = useAuthStore();

    return useMutation({
        mutationFn: authApi.setPassword,
        onSuccess: (data) => {
            if (data.success) {
                // Set auth with user and token
                setAuth(data.data.user, data.data.token);
                
                // Clear registration data since it's no longer needed
                clearRegistrationData();
                
                toast.success('Password set successfully!');
                // Let AuthGuard handle redirection
            }
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to set password';
            toast.error(message);
        },
    });
}

export function useLogin() {
    const { setAuth, clearRegistrationData } = useAuthStore();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            console.log('Login response:', data);
            if (data.success) {
                setAuth(data.data.user, data.data.token);
                clearRegistrationData(); // Clear any leftover registration data
                toast.success('Logged in successfully!');
                // Let AuthGuard handle redirection
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        },
    });
}

export function useCompleteProfile() {
    const { setUser } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.completeProfile,
        onSuccess: (data) => {
            if (data.success) {
                // Update user in store
                setUser(data.data.user);
                toast.success('Profile updated successfully!');

                // If profile is now complete, redirect to dashboard
                if (data.data.profile_complete) {
                    router.replace('/dashboard');
                }
            }
        },
        onError: (error) => {
            console.error('Complete profile error:', error);
            const message =
                error.response?.data?.message || 'Failed to update profile';
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
            toast.success('Logged out successfully');
        },
        onError: () => {
            clearAuth();
            router.push('/auth/login');
        },
    });
}
