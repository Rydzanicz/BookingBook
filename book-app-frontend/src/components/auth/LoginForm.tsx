// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const { login } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();

    // Celowa ścieżka po zalogowaniu – jeśli użytkownik
    // przyszedł z przekierowania, wróci do „location.state.from”,
    // inaczej idzie na /search (strona wyszukiwania książek).
    const from = (location.state as any)?.from?.pathname || '/search';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.username, formData.password);
            // Przekieruj na stronę wyszukiwania po udanym logowaniu
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Błąd logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Logowanie</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>

                <p>
                    Nie masz konta? <a href="/register">Zarejestruj się</a>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
