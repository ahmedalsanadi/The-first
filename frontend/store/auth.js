// store/auth.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import { setToken, removeToken, getToken } from '@/lib/utils/storage';
import toast from 'react-hot-toast';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            registrationData: null,

            // Initialize auth state
            initialize: () => {
                const token = getToken();
                if (token) {
                    set({ token, isAuthenticated: true });
                    get().fetchUser();
                }
            },

            // Set authentication data
            setAuth: (user, token) => {
                setToken(token);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },

            // Update user data
            setUser: (user) => {
                set({ user });
            },

            // Clear authentication
            clearAuth: () => {
                removeToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    registrationData: null,
                });
            },

            // Set registration data (for multi-step registration)
            setRegistrationData: (data) => {
                set({
                    registrationData: { ...get().registrationData, ...data },
                });
            },

            // Clear registration data
            clearRegistrationData: () => {
                set({ registrationData: null });
            },

            // Fetch current user
            fetchUser: async () => {
                try {
                    set({ isLoading: true });
                    const response = await authApi.getMe();
                    if (response.success) {
                        set({ user: response.data.user });
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    get().clearAuth();
                } finally {
                    set({ isLoading: false });
                }
            },

            // Login
            login: async (credentials) => {
                try {
                    set({ isLoading: true });
                    const response = await authApi.login(credentials);

                    if (response.success) {
                        get().setAuth(response.data.user, response.data.token);
                        toast.success('Login successful!');

                        // Check if profile is complete based on API response
                        const profileComplete =
                            response.data.user?.profile_complete || false;
                        const missingSteps =
                            response.data.user?.missing_steps || [];

                        return {
                            success: true,
                            profileComplete,
                            missingSteps,
                        };
                    }
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Login failed';
                    toast.error(message);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            // Logout
            logout: async () => {
                try {
                    await authApi.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    get().clearAuth();
                    toast.success('Logged out successfully');
                }
            },

            // Complete profile
            completeProfile: async (profileData) => {
                try {
                    set({ isLoading: true });
                    const response = await authApi.completeProfile(profileData);

                    if (response.success) {
                        // Preserve the current token when updating user data
                        const currentToken = get().token;
                        return response.data;
                    }
                } catch (error) {
                    const message =
                        error.response?.data?.message ||
                        'Failed to update profile';
                    toast.error(message);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                registrationData: state.registrationData,
            }),
        },
    ),
);

export default useAuthStore;
