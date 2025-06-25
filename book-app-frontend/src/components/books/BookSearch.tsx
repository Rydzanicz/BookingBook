import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { booksAPI, SearchBooksResponse } from '../../api/books';
import BookList from './BookList';

const ITEMS_PER_PAGE = 10;

const BookSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // React Query v5 - używamy jawnego typowania i placeholderData
  const { data, isLoading, isError, error } = useQuery<SearchBooksResponse>({
    queryKey: ['searchBooks', submittedQuery, currentPage],
    queryFn: () => booksAPI.searchBooks({
      q: submittedQuery,  // Zmienione z 'query' na 'q' (zgodnie z Google Books API)
      page: currentPage,
      limit: ITEMS_PER_PAGE
    }),
    enabled: !!submittedQuery,
    placeholderData: keepPreviousData  // Zmienione z keepPreviousData: true
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = data ? Math.ceil(data.totalItems / ITEMS_PER_PAGE) : 0;

  return (
    <div className="book-search">
      <h2>Wyszukaj książki</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Wpisz tytuł, autora lub słowa kluczowe..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? 'Szukam...' : 'Szukaj'}
          </button>
        </div>
      </form>

      {isError && (
        <div className="error-message">
          <p>Wystąpił błąd podczas wyszukiwania:</p>
          <p>{error?.message || 'Nieznany błąd'}</p>
        </div>
      )}

      {isLoading && !data && (
        <div className="loading-message">
          <p>Wyszukiwanie książek...</p>
        </div>
      )}

      {data && data.items && data.items.length > 0 && (
        <>
          <div className="search-results-info">
            Znaleziono {data.totalItems} wyników dla: "{submittedQuery}"
          </div>

          <BookList books={data.items} />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="pagination-button"
              >
                Poprzednia
              </button>
              
              <span className="pagination-info">
                Strona {currentPage} z {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="pagination-button"
              >
                Następna
              </button>
            </div>
          )}
        </>
      )}

      {data && data.items && data.items.length === 0 && submittedQuery && (
        <div className="no-results">
          Nie znaleziono książek dla zapytania: "{submittedQuery}"
        </div>
      )}
    </div>
  );
};

export default BookSearch;