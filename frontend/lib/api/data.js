// lib/api/data.js
import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';

export const dataApi = {
    async getCountries() {
        return apiClient.get(API_ENDPOINTS.COUNTRIES);
    },

    async getCities(countryId) {
        const params = countryId ? { country_id: countryId } : {};
        return apiClient.get(API_ENDPOINTS.CITIES, { params });
    },

    async getProfessions() {
        return apiClient.get(API_ENDPOINTS.PROFESSIONS);
    },
};
