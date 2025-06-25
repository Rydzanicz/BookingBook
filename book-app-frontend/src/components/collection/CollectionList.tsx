import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collectionAPI, CollectionBook } from '../../api/collection';
import CollectionItem from './CollectionItem';

const CollectionList: React.FC = () => {
  const [sortBy, setSortBy] = useState<'title' | 'addedAt'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterQuery, setFilterQuery] = useState('');

  // POPRAWKA: Dodanie jawnego typowania <CollectionBook[]> i poprawna nazwa funkcji
  const { data: collection, isLoading, error, refetch } = useQuery<CollectionBook[]>({
    queryKey: ['userCollection'],
    queryFn: collectionAPI.getCollection // POPRAWKA: getCollection zamiast getUserCollection
  });

  const filteredAndSortedBooks = React.useMemo(() => {
    // POPRAWKA: Sprawdzenie czy collection jest tablicą
    if (!collection || !Array.isArray(collection)) return [];

    let filtered = collection;

    // Filtrowanie z poprawnym dostępem do właściwości
    if (filterQuery) {
      filtered = collection.filter((book: CollectionBook) =>
        book.volumeInfo.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (book.volumeInfo.authors || []).some((author: string) =>
          author.toLowerCase().includes(filterQuery.toLowerCase())
        )
      );
    }

    // Sortowanie z poprawnym dostępem do właściwości
    return filtered.sort((a: CollectionBook, b: CollectionBook) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.volumeInfo.title.localeCompare(b.volumeInfo.title);
      } else if (sortBy === 'addedAt') {
        comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [collection, filterQuery, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: 'title' | 'addedAt') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="collection-loading">
        <div className="loading-message">
          Ładuję Twoją kolekcję...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-error">
        <div className="error-message">
          Błąd podczas ładowania kolekcji: {(error as Error).message}
        </div>
        <button onClick={() => refetch()} className="retry-button">
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // POPRAWKA: Sprawdzenie czy collection jest tablicą przed .length
  if (!collection || !Array.isArray(collection) || collection.length === 0) {
    return (
      <div className="collection-empty">
        <div className="empty-message">
          <h2>Twoja kolekcja jest pusta</h2>
          <p>Rozpocznij dodawanie książek, które przeczytałeś!</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="start-button"
          >
            Zacznij wyszukiwać książki
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-container">
      <div className="collection-header">
        <h2>Twoja kolekcja książek</h2>
        <div className="collection-count">
          {collection.length} {collection.length === 1 ? 'książka' : 'książek'}
        </div>
      </div>

      <div className="collection-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Szukaj w kolekcji..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="sort-controls">
          <span>Sortuj według:</span>
          <button
            onClick={() => handleSortChange('title')}
            className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
          >
            Tytuł {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('addedAt')}
            className={`sort-button ${sortBy === 'addedAt' ? 'active' : ''}`}
          >
            Data dodania {sortBy === 'addedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 ? (
        <div className="no-results">
          <p>Nie znaleziono książek pasujących do wyszukiwania "{filterQuery}"</p>
        </div>
      ) : (
        <div className="collection-grid">
          {/* POPRAWKA: Jawne typowanie parametru book */}
          {filteredAndSortedBooks.map((book: CollectionBook) => (
            <CollectionItem
              key={book.id}
              book={book}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionList;