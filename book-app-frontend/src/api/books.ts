import { api } from './axiosConfig';

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

export interface GoogleBooksResponse {
    items: GoogleBook[];
    totalItems: number;
}

export interface UserBook {
    id: number;
    googleBookId: string;
    title: string;
    authors?: string;
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string;
    thumbnailUrl?: string;
    addedAt: string;
}

export interface AddBookRequest {
    username: string;
    googleBookId: string;
    title: string;
    authors?: string;
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string;
    thumbnailUrl?: string;
}

export const booksService = {
    searchBooks: async (
        query: string,
        startIndex = 0,
        maxResults = 20
    ): Promise<GoogleBooksResponse> => {
        const response = await api.get<GoogleBooksResponse>('/search/books', {
            params: { q: query, startIndex, maxResults }
        });
        return response.data;
    },

    getUserBooks: async (username: string): Promise<UserBook[]> => {
        const response = await api.get<UserBook[]>('/books/collection', {
            params: { username }
        });
        return response.data;
    },

    addBookToCollection: async (data: AddBookRequest): Promise<UserBook> => {
        const response = await api.post<UserBook>('/books/collection', data);
        return response.data;
    },

    removeBookFromCollection: async (
        username: string,
        googleBookId: string
    ): Promise<void> => {
        await api.delete('/books/collection', {
            params: { username, googleBookId }
        });
    }
};
