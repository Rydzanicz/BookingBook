import { api } from './axiosConfig';

export const searchBooks = (q: string, page = 1, limit = 10) =>
    api.get('/books/search', { params: { q, page, limit } });
