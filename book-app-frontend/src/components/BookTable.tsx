import React, {useState} from 'react';
import axios from '../api/axiosConfig';

interface Book {
    googleBookId: string;
    title: string;
    authors: string[] | null;
    description: string | null;
    publishedDate: string | null;
    pdfAcsTokenLink: string | null;
}

interface BookTableProps {
    books: Book[];
    username: string;
    buttonLabel?: string;
    apiPath?: string;
    apiType?: 'POST' | 'DELETE';
    shouldRefresh?: boolean;
    onRefresh?: () => void;
}

const BookTable: React.FC<BookTableProps> = ({
                                                 books,
                                                 username,
                                                 buttonLabel = "Dodaj",
                                                 apiPath = "/api/books/collection/add",
                                                 apiType = "POST",
                                                 shouldRefresh = false,
                                                 onRefresh
                                             }) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleAction = async (book: Book) => {
        setMessage(null);
        if (!username) {
            setMessage('Brak zalogowanego użytkownika!');
            return;
        }

        try {
            const requestData = {
                googleBookId: book.googleBookId,
                title: book.title,
                username: username,
                authors: book.authors ? book.authors.join(', ') : '',
                description: book.description,
                publishedDate: book.publishedDate,
                pdfAcsTokenLink: book.pdfAcsTokenLink
            };
            let response;
            switch (apiType) {
                case 'DELETE':
                    response = await axios.delete(apiPath, {
                        data: requestData
                    });
                    break;
                default:
                    response = await axios.post(apiPath, requestData, {
                        headers: {'Content-Type': 'application/json'}
                    });
            }
            setMessage(response.data.message || 'Operacja zakończona sukcesem!');
            if (shouldRefresh && onRefresh) {
                onRefresh();
            }
        } catch (err: any) {
            setMessage(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Błąd podczas wykonywania operacji'
            );
        }
    };

    const handleDownload = (link: string) => {
        window.open(link, '_blank');
    };

    if (books.length === 0) return null;

    return (
        <div className={'vista-table'}>
            {message && (
                <div
                    style={{
                        marginBottom: 12,
                        color: message.includes('Błąd') ? 'red' : 'lime',
                        textAlign: 'center'
                    }}
                >
                    {message}
                </div>
            )}
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 16}}>
                <thead>
                <tr>
                    <th style={cellStyle}>ID</th>
                    <th style={cellStyle}>Tytuł</th>
                    <th style={cellStyle}>Autorzy</th>
                    <th style={cellStyle}>Data publikacji</th>
                    <th style={cellStyle}>Opis</th>
                    <th style={cellStyle}>Akcja</th>
                </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <tr key={book.googleBookId}>
                        <td style={cellStyle}>{book.googleBookId}</td>
                        <td style={cellStyle}>{book.title}</td>
                        <td style={cellStyle}>
                            {book.authors?.length ? book.authors.join(', ') : '-'}
                        </td>
                        <td style={cellStyle}>{book.publishedDate || '-'}</td>
                        <td style={cellStyle}>
                            {book.description
                                ? book.description.length > 100
                                    ? book.description.slice(0, 100) + '…'
                                    : book.description
                                : '-'}
                        </td>
                        <td style={cellStyle}>
                            <button
                                className="vista-button"
                                onClick={() => handleAction(book)}
                                style={{marginRight: 8}}>
                                {buttonLabel}
                            </button>
                            {book.pdfAcsTokenLink && (
                                <button
                                    className="vista-button"
                                    onClick={() => handleDownload(book.pdfAcsTokenLink!)}>
                                    Pobierz plik
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const cellStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: 8
};

export default BookTable;
