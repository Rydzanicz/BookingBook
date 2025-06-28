
import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from '../api/axiosConfig';

interface Book {
    googleBookId: string;
    title: string;
    authors: string[] | null;
    description: string | null;
    publishedDate: string | null;
}

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

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

            {/* Tabela wyników */}
            {books.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: 8 }}>Tytuł</th>
                        <th style={{ border: '1px solid #ddd', padding: 8 }}>Autorzy</th>
                        <th style={{ border: '1px solid #ddd', padding: 8 }}>Data publikacji</th>
                        <th style={{ border: '1px solid #ddd', padding: 8 }}>Opis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map(book => (
                        <tr key={book.googleBookId}>
                            <td style={{ border: '1px solid #ddd', padding: 8 }}>{book.googleBookId}</td>
                            <td style={{ border: '1px solid #ddd', padding: 8 }}>{book.title}</td>
                            <td style={{ border: '1px solid #ddd', padding: 8 }}>
                                {book.authors?.length ? book.authors.join(', ') : '-'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: 8 }}>
                                {book.publishedDate || '-'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: 8 }}>
                                {book.description
                                    ? book.description.length > 100
                                        ? book.description.slice(0, 100) + '…'
                                        : book.description
                                    : '-'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookSearch;
