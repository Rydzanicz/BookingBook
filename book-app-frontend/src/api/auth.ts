import { api } from './axiosConfig';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    id: number;
    username: string;
    email: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/signin', credentials);
        const { token, id, username, email } = response.data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify({ id, username, email }));
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/signup', data);
        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
    },

    getToken: (): string | null => {
        return localStorage.getItem('userToken');
    },

    getCurrentUser: (): User | null => {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('userToken');
    }
};
