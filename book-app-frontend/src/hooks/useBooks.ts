import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    booksService,
    GoogleBooksResponse,
    UserBook,
    AddBookRequest
} from '../api/books';
import { useAuth } from '../context/AuthContext';

export const useBookSearch = (query: string, page: number) =>
    useQuery<GoogleBooksResponse>({
        queryKey: ['searchBooks', query, page],
        queryFn: () => booksService.searchBooks(query, page * 20, 20),
        enabled: !!query,
        staleTime: 5 * 60 * 1000
    });

export const useCollection = () => {
    const { user } = useAuth();
    return useQuery<UserBook[]>({
        queryKey: ['userBooks', user!.username],
        queryFn: () => booksService.getUserBooks(user!.username),
        enabled: !!user
    });
};

export const useAddBook = () => {
    const queryClient = useQueryClient();
    return useMutation<UserBook, Error, AddBookRequest>({
        mutationFn: (bookData) => booksService.addBookToCollection(bookData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userBooks'] });
        }
    });
};

export const useRemoveBook = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { username: string; googleBookId: string }>({
        mutationFn: ({ username, googleBookId }) =>
            booksService.removeBookFromCollection(username, googleBookId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userBooks'] });
        }
    });
};
