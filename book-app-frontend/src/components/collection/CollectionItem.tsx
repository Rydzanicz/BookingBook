import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionAPI, CollectionBook } from '../../api/collection';

interface CollectionItemProps {
  book: CollectionBook;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ book }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => collectionAPI.removeFromCollection(book.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      setShowConfirmDelete(false);
    },
    onError: (error) => {
      console.error('Error removing book from collection:', error);
    }
  });

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="collection-item">
      <div className="collection-item-content">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="collection-item-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        <div className="collection-item-details">
          <h3 className="collection-item-title">{book.volumeInfo.title}</h3>
          
          {book.volumeInfo.authors && book.volumeInfo.authors.length > 0 && (
            <p className="collection-item-authors">
              Autor: {book.volumeInfo.authors.join(', ')}
            </p>
          )}
          
          {book.volumeInfo.publishedDate && (
            <p className="collection-item-published">
              Rok wydania: {new Date(book.volumeInfo.publishedDate).getFullYear()}
            </p>
          )}
          
          {book.volumeInfo.pageCount && (
            <p className="collection-item-pages">
              Liczba stron: {book.volumeInfo.pageCount}
            </p>
          )}
          
          <p className="collection-item-added">
            Dodano: {formatDate(book.addedAt)}
          </p>
          
          {book.volumeInfo.categories && book.volumeInfo.categories.length > 0 && (
            <p className="collection-item-categories">
              Kategorie: {book.volumeInfo.categories.slice(0, 3).join(', ')}
              {book.volumeInfo.categories.length > 3 && '...'}
            </p>
          )}
          
          {book.volumeInfo.description && (
            <div className="collection-item-description">
              <p>
                {showFullDescription
                  ? book.volumeInfo.description
                  : truncateText(book.volumeInfo.description, 150)
                }
              </p>
              {book.volumeInfo.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="toggle-description-button"
                >
                  {showFullDescription ? 'Pokaż mniej' : 'Pokaż więcej'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="collection-item-actions">
        {!showConfirmDelete ? (
          <button
            onClick={handleDeleteClick}
            className="remove-button"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Usuwanie...' : 'Usuń z kolekcji'}
          </button>
        ) : (
          <div className="confirm-delete">
            <p>Czy na pewno chcesz usunąć tę książkę z kolekcji?</p>
            <div className="confirm-buttons">
              <button
                onClick={handleConfirmDelete}
                className="confirm-button"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Usuwanie...' : 'Tak, usuń'}
              </button>
              <button
                onClick={handleCancelDelete}
                className="cancel-button"
                disabled={deleteMutation.isPending}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
        
        {deleteMutation.isError && (
          <p className="error-message">
            Wystąpił błąd podczas usuwania książki. Spróbuj ponownie.
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionItem;