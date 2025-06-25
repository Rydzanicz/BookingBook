import React from 'react';
import { Book } from '../../api/books';
import BookItem from './BookItem';

interface BookListProps {
    books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
    if (!books || books.length === 0) {
        return (
            <div className="book-list-empty">
                <p>Brak książek do wyświetlenia</p>
            </div>
        );
    }

    return (
        <div className="book-list">
            <div className="book-grid">
                {books.map((book) => (
                    <BookItem key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default BookList;