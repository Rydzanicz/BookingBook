import React from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import CollectionList from '../components/collection/CollectionList';

const CollectionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: collection = [], isLoading } = useCollection();

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/collection" className="active">
            My Collection ({collection.length})
          </Link>
          <button onClick={logout}>Logout</button>
        </nav>

        <h1>My Collection</h1>
        {isLoading
            ? <p>Loading...</p>
            : <CollectionList />
        }
      </div>
  );
};

export default CollectionPage;
