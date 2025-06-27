import React from 'react';

interface BookItemProps {
  book: any;
  onAdd: (b: any) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onAdd }) => {
  const info = book.volumeInfo;
  const user = JSON.parse(localStorage.getItem('user')!);

  const payload = {
    username: user.username,
    googleBookId: book.id,
    title: info.title,
    authors: info.authors,
    description: info.description,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    categories: info.categories,
    thumbnailUrl: info.imageLinks?.thumbnail
  };

  return (
      <li>
        <strong>{info.title}</strong> by {info.authors?.join(', ')}
        <button onClick={() => onAdd(payload)}>Add to collection</button>
      </li>
  );
};

export default BookItem;
