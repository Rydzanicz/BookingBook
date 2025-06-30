import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
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

            const {accessToken, id, username: user, email, tokenType} = response.data;

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
        <div className="vista-card">
            <h2 style={{color: '#fff', textAlign: 'center'}}>Logowanie</h2>
            {error && <div style={{color: 'red', marginBottom: 10, textAlign: 'center'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: 10}}>
                    <input
                        className="vista-input"
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{marginBottom: 10}}>
                    <input
                        className="vista-input"
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="vista-button"
                    disabled={loading}
                    style={{width: '100%', marginBottom: 10}}
                >
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>
            <div style={{textAlign: 'center', marginTop: 16}}>
                <span style={{color: '#fff'}}>Nie masz konta?</span>
                <Link to="/register" className="vista-button" style={{marginLeft: 8, padding: '6px 12px'}}>
                    Zarejestruj się
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
