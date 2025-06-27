import React from 'react';
import { useCollection, useRemoveBook } from '../../hooks/useBooks';

const CollectionList: React.FC = () => {
  const { data } = useCollection();
  const remove = useRemoveBook();

  return (
      <ul>
        {data?.map((b: any) => (
            <li key={b.id}>
              {b.title}
              <button onClick={() => remove.mutate(b.googleBookId)}>
                Remove
              </button>
            </li>
        ))}
      </ul>
  );
};

export default CollectionList;
