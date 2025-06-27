import React from 'react';
import BookItem from './BookItem';

interface BookListProps {
    books: any[];
    onAdd: (b: any) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onAdd }) => (
    <ul>
        {books.map(book => (
            <BookItem key={book.id} book={book} onAdd={onAdd} />
        ))}
    </ul>
);

export default BookList;
