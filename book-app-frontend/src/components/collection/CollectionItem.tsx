import React from 'react';
import { useRemoveBook } from '../../hooks/useBooks';
import { useAuth } from '../../context/AuthContext';
import { UserBook } from '../../api/books';

interface CollectionItemProps {
    book: UserBook;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ book }) => {
    const { user }   = useAuth();
    const removeBook = useRemoveBook();

    return (
        <div>
            <h3>{book.title}</h3>
            <button
                onClick={() =>
                    removeBook.mutate({ username: user!.username, googleBookId: book.googleBookId })
                }
            >
                Usuń z kolekcji
            </button>
        </div>
    );
};

export default CollectionItem;
