import { api } from './axiosConfig';

export interface LoginPayload {
    username: string;
    password: string;
}
export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export const login = (payload: LoginPayload) =>
    api.post('/auth/signin', payload);

export const register = (payload: RegisterPayload) =>
    api.post('/auth/signup', payload);

export const logout = () =>
    api.post('/auth/signout');
