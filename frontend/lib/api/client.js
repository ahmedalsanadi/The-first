// lib/api/client.js
import axios from 'axios';
import { ENV, STORAGE_KEYS } from '@/config/constants';
import { getToken, removeToken, setToken } from '@/lib/utils/storage';
import toast from 'react-hot-toast';

const apiClient = axios.create({
    baseURL: ENV.API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        console.log('Sending request with token:', token ? 'Yes' : 'No');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const { response } = error;

        if (response?.status === 401) {
            removeToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }

        if (
            response?.status === 403 &&
            response?.data?.message === 'Profile incomplete'
        ) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/complete-profile';
            }
        }

        if (response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
    },
);

export default apiClient;
