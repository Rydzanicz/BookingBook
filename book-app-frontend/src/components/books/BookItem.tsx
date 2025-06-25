import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Book } from '../../api/books';
import { collectionAPI, AddToCollectionRequest } from '../../api/collection';

interface BookItemProps {
  book: Book;
  onAddToCollection?: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onAddToCollection }) => {
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();

  // Sprawdzanie czy książka jest w kolekcji
  const { data: inCollectionData } = useQuery({
    queryKey: ['inCollection', book.id],
    queryFn: () => collectionAPI.isInCollection(book.id),
    staleTime: 30000 // Cache na 30 sekund
  });

  const isInCollection = inCollectionData?.exists || false;

  // Mutacja dodawania do kolekcji (przekazujemy obiekt, nie string)
  const addToCollectionMutation = useMutation({
    mutationFn: (bookData: AddToCollectionRequest) => collectionAPI.addToCollection(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['inCollection', book.id] });
      if (onAddToCollection) {
        onAddToCollection(book);
      }
    }
  });

  // Mutacja usuwania z kolekcji
  const removeFromCollectionMutation = useMutation({
    mutationFn: (bookId: string) => collectionAPI.removeFromCollection(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['inCollection', book.id] });
    }
  });

  const handleAddToCollection = () => {
    // Tworzymy obiekt AddToCollectionRequest z danych książki
    const bookData: AddToCollectionRequest = {
      id: book.id,
      volumeInfo: {
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        publishedDate: book.volumeInfo.publishedDate,
        description: book.volumeInfo.description,
        categories: book.volumeInfo.categories,
        pageCount: book.volumeInfo.pageCount,
        imageLinks: book.volumeInfo.imageLinks,
        previewLink: book.volumeInfo.previewLink,
        infoLink: book.volumeInfo.infoLink
      }
    };
    
    addToCollectionMutation.mutate(bookData);
  };

  const handleRemoveFromCollection = () => {
    removeFromCollectionMutation.mutate(book.id);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatAuthors = (authors?: string[]) => {
    if (!authors || authors.length === 0) return 'Nieznany autor';
    return authors.join(', ');
  };

  const getImageUrl = () => {
    if (imageError || !book.volumeInfo.imageLinks?.thumbnail) {
      return '/placeholder-book.png'; // Fallback image
    }
    return book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:');
  };

  return (
    <div className="book-item">
      <div className="book-cover">
        <img
          src={getImageUrl()}
          alt={book.volumeInfo.title}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
      
      <div className="book-details">
        <h3 className="book-title">{book.volumeInfo.title}</h3>
        <p className="book-authors">{formatAuthors(book.volumeInfo.authors)}</p>
        
        {book.volumeInfo.publishedDate && (
          <p className="book-year">
            Rok wydania: {new Date(book.volumeInfo.publishedDate).getFullYear()}
          </p>
        )}

        {book.volumeInfo.categories && book.volumeInfo.categories.length > 0 && (
          <p className="book-categories">
            Kategorie: {book.volumeInfo.categories.slice(0, 3).join(', ')}
            {book.volumeInfo.categories.length > 3 && '...'}
          </p>
        )}

        {book.volumeInfo.description && (
          <p className="book-description">
            {truncateText(book.volumeInfo.description, 200)}
          </p>
        )}

        <div className="book-actions">
          {isInCollection ? (
            <button
              onClick={handleRemoveFromCollection}
              disabled={removeFromCollectionMutation.isPending}
              className="button button-danger"
            >
              {removeFromCollectionMutation.isPending ? 'Usuwam...' : 'Usuń z kolekcji'}
            </button>
          ) : (
            <button
              onClick={handleAddToCollection}
              disabled={addToCollectionMutation.isPending}
              className="button button-primary"
            >
              {addToCollectionMutation.isPending ? 'Dodaję...' : 'Dodaj do kolekcji'}
            </button>
          )}

          {book.volumeInfo.previewLink && (
            <a
              href={book.volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              Podgląd
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookItem;