import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiKey = process.env.REACT_APP_API_KEY || 'xd';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (apiKey) {
            config.headers['X-API-KEY'] = apiKey;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
export const api = axios;
