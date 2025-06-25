import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { collectionAPI, CollectionBook } from '../api/collection';
import { useAuth } from '../hooks/useAuth';
import CollectionList from '../components/collection/CollectionList';

const CollectionPage: React.FC = () => {
  const { logout } = useAuth();

  // POPRAWKA: Dodanie jawnego typowania <CollectionBook[]> i poprawna nazwa funkcji
  const { data: collection } = useQuery<CollectionBook[]>({
    queryKey: ['userCollection'],
    queryFn: collectionAPI.getCollection // POPRAWKA: getCollection zamiast getUserCollection
  });

  const handleLogout = () => {
    logout();
  };

  // POPRAWKA: Funkcja helper do bezpiecznego sprawdzenia długości kolekcji
  const getCollectionCount = (): number => {
    if (!collection || !Array.isArray(collection)) return 0;
    return collection.length;
  };

  return (
      <div className="collection-page">
        <div className="main-container">
          <header className="app-header">
            <div className="header-content">
              <h1>BookApp</h1>
              <nav className="main-nav">
                <Link to="/" className="nav-link">
                  Wyszukaj książki
                </Link>
                <Link to="/collection" className="nav-link active">
                  {/* POPRAWKA: Użycie funkcji helper zamiast bezpośredniego dostępu */}
                  Moja kolekcja ({getCollectionCount()})
                </Link>
              </nav>
              <div className="user-menu">
                <button onClick={handleLogout} className="logout-button">
                  Wyloguj się
                </button>
              </div>
            </div>
          </header>

          <main className="main-content">
            <CollectionList />
          </main>

          <footer className="app-footer">
            <div className="footer-content">
              <p>&copy; 2025 BookApp - Zarządzaj swoją kolekcją książek</p>
            </div>
          </footer>
        </div>
      </div>
  );
};

export default CollectionPage;