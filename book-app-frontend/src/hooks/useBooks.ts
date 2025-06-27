import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchBooks } from '../api/books';
import { getCollection, addToCollection, removeFromCollection } from '../api/collection';

export interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        publishedDate?: string;
        pageCount?: number;
        categories?: string[];
        imageLinks?: { thumbnail?: string };
    };
}

export interface SearchBooksResponse {
    totalItems: number;
    items: GoogleBook[];
}

export const useBookSearch = (query: string, page: number) =>
    useQuery<SearchBooksResponse>({
        queryKey: ['searchBooks', query, page],
        queryFn: () => searchBooks(query, page, 10).then(res => res.data),
        enabled: !!query
    });

export const useAddBook = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (book: any) => addToCollection(book).then(res => res.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['collection'] })
    });
};

export const useCollection = () =>
    useQuery<GoogleBook[]>({
        queryKey: ['collection'],
        queryFn: () => getCollection().then(res => res.data)
    });

export const useRemoveBook = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => removeFromCollection(id).then(res => res.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['collection'] })
    });
};
