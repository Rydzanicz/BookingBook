import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { collectionAPI, CollectionBook } from '../api/collection';
import { useAuth } from '../hooks/useAuth';
import BookSearch from '../components/books/BookSearch';

const DashboardPage: React.FC = () => {
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
    <div className="dashboard-page">
      <div className="main-container">
        <header className="app-header">
          <div className="header-content">
            <h1>BookApp</h1>
            <nav className="main-nav">
              <Link to="/" className="nav-link active">
                Wyszukaj książki
              </Link>
              <Link to="/collection" className="nav-link">
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
          <div className="welcome-section">
            <h2>Witaj w BookApp!</h2>
            <p>Wyszukaj książki i dodaj je do swojej kolekcji przeczytanych pozycji.</p>
          </div>

          <div className="search-section">
            <BookSearch />
          </div>
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

export default DashboardPage;