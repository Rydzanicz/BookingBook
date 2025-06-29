import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../index.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        color: isActive ? '#00c' : '#fff',
        textDecoration: 'none',
        margin: '0 12px',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <header
            className="vista-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24
            }}
        >
            <nav style={{ display: 'flex', alignItems: 'center' }}>
                <NavLink to="/dashboard" style={linkStyle}>
                    Dashboard
                </NavLink>
                <NavLink to="/collection" style={linkStyle}>
                    Kolekcja
                </NavLink>
            </nav>
            <button className="vista-button" onClick={handleLogout}>
                Wyloguj
            </button>
        </header>
    );
};

export default Header;