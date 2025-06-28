import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import Header from '../components/Header';

interface Book {
    googleBookId: string;
    title: string;
    authors: string;
    description: string;
}

const CollectionPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string>('');
    const username = localStorage.getItem('username') || '';

    useEffect(() => {
        if (!username) {
            setError('Brak nazwy użytkownika.');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            params: { username }
        };

        axios.get<Book[]>(`/api/books/collection`, config)
            .then(resp => setBooks(resp.data))
            .catch(err => {
                console.error('Błąd pobierania kolekcji:', err);
                setError('Nie udało się pobrać kolekcji książek.');
            });
    }, [username]);

    return (
        <div className="vista-card" style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
            <Header />
            <h2 style={{ color: '#fff', marginBottom: 12 }}>Moja kolekcja</h2>

            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

            {books.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.3)' }}>
                        <th style={cellStyle}>ID książki</th>
                        <th style={cellStyle}>Tytuł</th>
                        <th style={cellStyle}>Autorzy</th>
                        <th style={cellStyle}>Opis</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map(book => (
                        <tr key={book.googleBookId} style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <td style={cellStyle}>{book.googleBookId}</td>
                            <td style={cellStyle}>{book.title}</td>
                            <td style={cellStyle}>{book.authors}</td>
                            <td style={cellStyle}>
                                {book.description && book.description.length > 100
                                    ? book.description.substring(0, 100) + '...'
                                    : book.description}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                !error && <p style={{ color: '#fff', textAlign: 'center' }}>Brak książek w kolekcji.</p>
            )}
        </div>
    );
};

const cellStyle: React.CSSProperties = {
    padding: 8,
    border: '1px solid rgba(255,255,255,0.6)',
    color: '#fff',
    backdropFilter: 'blur(5px)'
};

export default CollectionPage;
