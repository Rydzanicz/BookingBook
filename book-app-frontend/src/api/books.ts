import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Konfiguracja Axios z automatycznym dodawaniem tokenu
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor dla automatycznego dodawania tokenu Bearer
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfejsy zgodne z Google Books API
export interface Book {
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

export interface SearchBooksResponse {
  kind: string;
  totalItems: number;
  items: Book[];
}

// Interfejs dla parametrów wyszukiwania (używa 'q' jak Google Books API)
export interface SearchBooksParams {
  q: string;        // Parametr wyszukiwania (zgodny z Google Books API)
  page?: number;    // Strona wyników
  limit?: number;   // Ilość wyników na stronę
}

// API Functions
export const booksAPI = {
  // Wyszukiwanie książek przez backend (który komunikuje się z Google Books API)
  searchBooks: async (params: SearchBooksParams): Promise<SearchBooksResponse> => {
    const response = await apiClient.get('/books/search', { params });
    return response.data;
  },

  // Pobieranie szczegółów pojedynczej książki
  getBookDetails: async (bookId: string): Promise<Book> => {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  }
};

export default booksAPI;