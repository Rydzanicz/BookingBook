import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import '../index.css';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        ['authToken', 'tokenType', 'userId', 'username', 'email']
            .forEach(key => localStorage.removeItem(key));
        navigate('/login');
    };

    return (
        <header className="vista-header">
            <nav className="vista-nav">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        `vista-link${isActive ? ' active' : ''}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/collection"
                    className={({isActive}) =>
                        `vista-link${isActive ? ' active' : ''}`
                    }
                >
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
