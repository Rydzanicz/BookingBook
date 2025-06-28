import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

interface LoginResponse {
    accessToken: string;
    id: number;
    username: string;
    email: string;
    tokenType: string;
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post<LoginResponse>('/api/auth/signin', {
                username,
                password,
            });

            const { accessToken, id, username: user, email, tokenType } = response.data;

            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('tokenType', tokenType);
            localStorage.setItem('userId', id.toString());
            localStorage.setItem('username', user);
            localStorage.setItem('email', email);

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Błąd logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ddd', borderRadius: 4 }}>
            <h2>Logowanie</h2>
            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
