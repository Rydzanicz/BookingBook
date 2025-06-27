import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: `${API_BASE_URL}/api`,
            headers: { 'Content-Type': 'application/json' }
        });
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Dołączanie JWT do każdego żądania
        this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('accessToken');
            if (token) config.headers!.Authorization = `Bearer ${token}`;
            return config;
        });

        // Obsługa odświeżania tokena przy 401
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const original = error.config;
                if (
                    error.response?.status === 401 &&
                    !original._retry
                ) {
                    original._retry = true;
                    try {
                        const rt = localStorage.getItem('refreshToken');
                        if (!rt) throw new Error('Brak refresh token');
                        const { data } = await axios.post(
                            `${API_BASE_URL}/api/auth/refreshtoken`,
                            { refreshToken: rt }
                        );
                        localStorage.setItem('accessToken', data.accessToken);
                        return this.instance(original);
                    } catch {
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    get client() {
        return this.instance;
    }
}

export const api = new ApiClient().client;
