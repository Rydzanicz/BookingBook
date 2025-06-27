import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/login', {
                state: { message: 'Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.' }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Błąd rejestracji');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-form-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Rejestracja</h2>

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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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

                <div className="form-group">
                    <label htmlFor="confirmPassword">Potwierdź hasło:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                </button>

                <p>
                    Masz już konto? <a href="/login">Zaloguj się</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;
