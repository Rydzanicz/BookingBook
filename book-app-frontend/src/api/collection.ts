import { api } from './axiosConfig';

export const getCollection = () =>
    api.get('/books/collection');

export const addToCollection = (book: any) =>
    api.post('/books/collection', book);

export const removeFromCollection = (googleBookId: string) =>
    api.delete('/books/collection', { params: { googleBookId } });
