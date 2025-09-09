// lib/api/auth.js
import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';

export const authApi = {
    async initiateRegistration(data) {
        return apiClient.post(API_ENDPOINTS.INITIATE_REGISTRATION, data);
    },

    async verifyOtp(data) {
        return apiClient.post(API_ENDPOINTS.VERIFY_OTP, data);
    },

    async setPassword(data) {
        return apiClient.post(API_ENDPOINTS.SET_PASSWORD, data);
    },

    async login(data) {
        return apiClient.post(API_ENDPOINTS.LOGIN, data);
    },
    async getMe() {
        return apiClient.get(API_ENDPOINTS.ME);
    },

    async logout() {
        return apiClient.post(API_ENDPOINTS.LOGOUT);
    },

    async refreshToken() {
        return apiClient.post(API_ENDPOINTS.REFRESH_TOKEN);
    },

    async completeProfile(data) {
        return apiClient.post(API_ENDPOINTS.COMPLETE_PROFILE, data);
    },
};
