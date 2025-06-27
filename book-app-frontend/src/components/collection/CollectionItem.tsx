import React, { useState } from 'react';
import { useRemoveBook } from '../../hooks/useBooks';

interface CollectionItemProps {
  book: {
    googleBookId: string;
    title: string;
  };
}

const CollectionItem: React.FC<CollectionItemProps> = ({ book }) => {
  const remove = useRemoveBook();
  const [show, setShow] = useState(false);

  return (
      <div>
        <h3>{book.title}</h3>
        <button onClick={() => remove.mutate(book.googleBookId)}>Remove</button>
      </div>
  );
};

export default CollectionItem;
