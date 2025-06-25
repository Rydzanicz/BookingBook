import axios from 'axios';
import { Book } from './books';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Konfiguracja Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor dla tokenu
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfejs dla książki w kolekcji (rozszerza Book o datę dodania)
export interface CollectionBook extends Book {
  addedAt: string;
}

// Interfejs dla żądania dodania książki do kolekcji
export interface AddToCollectionRequest {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    categories?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    previewLink?: string;
    infoLink?: string;
  };
}

// Interfejs dla statystyk kolekcji
export interface CollectionStats {
  totalBooks: number;
  favoriteGenres: string[];
  averageRating: number;
}

// API Functions
export const collectionAPI = {
  // Pobieranie kolekcji użytkownika
  getCollection: async (): Promise<CollectionBook[]> => {
    const response = await apiClient.get('/books/collection');
    return response.data;
  },

  // Dodawanie książki do kolekcji
  addToCollection: async (bookData: AddToCollectionRequest): Promise<CollectionBook> => {
    const response = await apiClient.post('/books/collection', bookData);
    return response.data;
  },

  // Usuwanie książki z kolekcji
  removeFromCollection: async (bookId: string): Promise<void> => {
    await apiClient.delete(`/books/collection/${bookId}`);
  },

  // Sprawdzanie czy książka jest w kolekcji
  isInCollection: async (bookId: string): Promise<{ exists: boolean }> => {
    const response = await apiClient.get(`/books/collection/${bookId}/exists`);
    return response.data;
  },

  // Pobieranie statystyk kolekcji
  getCollectionStats: async (): Promise<CollectionStats> => {
    const response = await apiClient.get('/books/collection/stats');
    return response.data;
  }
};

export default collectionAPI;