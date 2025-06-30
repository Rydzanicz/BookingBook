import React, {useState, FormEvent, ChangeEvent, useCallback} from 'react';
import axios from '../api/axiosConfig';
import BookTable from './BookTable';
import {useInfiniteScroll} from '../hooks/useInfiniteScroll';

interface Book {
    googleBookId: string;
    title: string;
    authors: string[] | null;
    description: string | null;
    publishedDate: string | null;
    pdfAcsTokenLink: string | null;
}

interface SpringDataPage {
    content: Book[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    last: boolean;
}

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const username = localStorage.getItem('username') || '';

    const fetchBooks = useCallback(async (newQuery: string, nextPage: number, reset: boolean = false) => {
        setLoading(true);
        try {
            const res = await axios.get<SpringDataPage>('/api/google/search', {
                params: {
                    query: newQuery,
                    page: nextPage,
                    size: 5,
                    _ts: Date.now()
                }
            });
            const newItems = res.data.content || [];
            setBooks(prev => reset ? newItems : [...prev, ...newItems]);
            setHasMore(!res.data.last);
            setPage(nextPage);
            setError('');
        } catch {
            setError('Błąd podczas pobierania książek');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setBooks([]);
        await fetchBooks(query, 0, true);
    };

    const fetchMore = useCallback(async () => {
        if (hasMore && !loading) {
            await fetchBooks(query, page + 1);
        }
    }, [query, page, hasMore, loading, fetchBooks]);

    const {isFetching} = useInfiniteScroll({fetchMore, hasMore, loading});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (!e.target.value.trim()) {
            setBooks([]);
            setHasMore(false);
            setPage(0);
        }
    };

    return (
        <div className="vista-card">
            <form onSubmit={handleSearch} style={{display: 'flex', gap: 8, marginBottom: 16}}>
                <input
                    type="text"
                    placeholder="Wpisz tytuł książki..."
                    value={query}
                    className={'vista-input'}
                    onChange={handleInputChange}
                    style={{flex: 1, padding: 8, fontSize: 16}}
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="vista-button">
                    {loading ? 'Szukam...' : 'Szukaj'}
                </button>
            </form>

            {error && <div style={{color: 'red', marginBottom: '16px'}}>{error}</div>}

            <BookTable
                books={books}
                username={username}
                buttonLabel="Dodaj do kolekcji"
                apiPath="/api/books/collection/add"
                apiType="POST"
            />

            {(loading || isFetching) && (
                <div style={{textAlign: 'center', padding: '20px', color: '#555'}}>
                    Ładowanie...
                </div>
            )}

            {!hasMore && books.length > 0 && (
                <div style={{textAlign: 'center', padding: '20px', color: '#555'}}>
                    Koniec wyników
                </div>
            )}
        </div>
    );
};

export default BookSearch;
