import React, {useEffect, useState} from 'react';
import axios from '../api/axiosConfig';
import Header from '../components/Header';
import BookTable from '../components/BookTable';

interface Book {
    googleBookId: string;
    title: string;
    authors: string[] | null;
    description: string | null;
    publishedDate: string | null;
    pdfAcsTokenLink: string | null;
}

const CollectionPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string>('');
    const username = localStorage.getItem('username') || '';

    const fetchCollectionData = async () => {
        if (!username) {
            setError('Brak nazwy użytkownika.');
            return;
        }

        try {
            const response = await axios.get<Book[]>(`/api/books/collection`, {
                params: {username}
            });
            const booksWithAuthorsArray = response.data.map(book => ({
                ...book,
                authors: book.authors && typeof book.authors === 'string'
                    ? (book.authors as string).split(',').map((a: string) => a.trim())
                    : book.authors
            }));
            setBooks(booksWithAuthorsArray);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 429) {
                setError('Przekroczono limit zapytań. Spróbuj ponownie za chwilę.');
            } else {
                console.error('Błąd pobierania kolekcji:', err);
                setError('Nie udało się pobrać kolekcji książek.');
            }
        }
    }

    useEffect(() => {
        fetchCollectionData();
    }, [username]);

    return (
        <>
            <Header/>
            <div className="vista-card">
                <h2 style={{color: '#fff', marginBottom: 12}}>Moja kolekcja</h2>

                {error && <div style={{color: 'red', marginBottom: 16}}>{error}</div>}

                <BookTable
                    books={books}
                    username={username}
                    buttonLabel="Usuń"
                    apiPath="/api/books/collection"
                    apiType="DELETE"
                    shouldRefresh={true}
                    onRefresh={fetchCollectionData}
                />
            </div>
        </>
    );
};

export default CollectionPage;
