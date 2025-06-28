import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookSearch from '../components/BookSearch';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
                    Wyloguj
                </button>
            </header>
            <BookSearch />
        </div>
    );
};

export default DashboardPage;
