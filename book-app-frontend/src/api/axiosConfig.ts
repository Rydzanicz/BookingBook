import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_KEY        = process.env.REACT_APP_API_KEY;

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
    }
});

// Interceptor żądań – dodaje JWT i X-API-KEY do nagłówków
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // X-API-KEY już ustawione w domyślnych nagłówkach
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor odpowiedzi – obsługa 401
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
