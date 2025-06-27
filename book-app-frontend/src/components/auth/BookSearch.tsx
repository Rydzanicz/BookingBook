import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookSearch, useAddBook } from '../../hooks/useBooks';
import BookList from "../books/BookList";

const ITEMS_PER_PAGE = 20;

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [page, setPage]   = useState(0);
    const { data, isLoading } = useBookSearch(query, page);
    const addBook = useAddBook();
    const { user } = useAuth();

    const handleSearch = () => setPage(0);

    return (
        <div>
            <input
                type="text"
                placeholder="Wyszukaj książki..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Szukaj</button>

            {isLoading && <p>Ładowanie...</p>}

            {data && (
                <>
                    <BookList
                        books={data.items}
                        onAdd={book => addBook.mutate({
                            username: user!.username,
                            googleBookId: book.id,
                            title: book.volumeInfo.title,
                            authors: book.volumeInfo.authors?.join(', '),
                            description: book.volumeInfo.description,
                            publishedDate: book.volumeInfo.publishedDate,
                            pageCount: book.volumeInfo.pageCount,
                            categories: book.volumeInfo.categories?.join(', '),
                            thumbnailUrl: book.volumeInfo.imageLinks?.thumbnail
                        })}
                    />
                    <div>
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                            Poprzednia
                        </button>
                        <button
                            disabled={(page + 1) * ITEMS_PER_PAGE >= (data.totalItems || 0)}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Następna
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BookSearch;
