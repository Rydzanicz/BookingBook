import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from '../api/axiosConfig';
import BookTable from './BookTable';

interface Book {
    googleBookId: string;
    title: string;
    authors: string[] | null;
    description: string | null;
    publishedDate: string | null;
    pdfAcsTokenLink: string | null;
}

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const username = localStorage.getItem('username') || '';

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setBooks([]);
        setError('');
        setLoading(true);

        try {
            const response = await axios.get<Book[]>(
                `/api/google/search?query=${encodeURIComponent(query)}`,
                { params: { _ts: Date.now() } }
            );
            setBooks(response.data || []);
        } catch (err: any) {
            console.error(err);
            setError('Błąd podczas pobierania książek');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Wpisz tytuł książki..."
                    value={query}
                    onChange={handleInputChange}
                    style={{ flex: 1, padding: 8, fontSize: 16 }}
                />
                <button type="submit" disabled={loading || !query.trim()} style={{ padding: '8px 16px' }}>
                    {loading ? 'Szukam...' : 'Szukaj'}
                </button>
            </form>

            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

            <BookTable
                books={books}
                username={username}
                buttonLabel="Dodaj do kolekcji"
                apiPath="/api/books/collection/add"
                apiType = "POST"
            /></div>
    );
};

export default BookSearch;
