import React, { useState } from 'react';
import { useBookSearch, useAddBook } from '../../hooks/useBooks';
import BookList from './BookList';

const ITEMS_PER_PAGE = 10;

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useBookSearch(query, page);
    const add = useAddBook();

    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); setPage(1); }}>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search…"
                />
            </form>

            {isLoading && <p>Loading…</p>}

            {data?.items && (
                <BookList books={data.items} onAdd={add.mutate} />
            )}

            {data && data.totalItems > ITEMS_PER_PAGE && (
                <div>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>{page}</span>
                    <button
                        disabled={page * ITEMS_PER_PAGE >= data.totalItems}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookSearch;
