import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from '../api/axiosConfig';

interface MessageResponse {
    message: string;
}

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post<MessageResponse>(
                '/api/auth/signup',
                {username, email, password},
                {headers: {'Content-Type': 'application/json'}}
            );
            setSuccess(response.data.message);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            setError(msg || 'Nieznany błąd rejestracji');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vista-card">
            <h2 style={{color: '#fff', textAlign: 'center'}}>Rejestracja</h2>
            {error && <div style={{color: 'red', marginBottom: 10, textAlign: 'center'}}>{error}</div>}
            {success && <div style={{color: 'lime', marginBottom: 10, textAlign: 'center'}}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: 10}}>
                    <input
                        className="vista-input"
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={20}
                    />
                </div>
                <div style={{marginBottom: 10}}>
                    <input
                        className="vista-input"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        maxLength={50}
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
                        minLength={6}
                        maxLength={40}
                    />
                </div>
                <button
                    type="submit"
                    className="vista-button"
                    disabled={loading}
                    style={{width: '100%', marginBottom: 10}}
                >
                    {loading ? 'Rejestruję...' : 'Zarejestruj się'}
                </button>
            </form>
            <div style={{textAlign: 'center', marginTop: 16}}>
                <span style={{color: '#fff'}}>Masz już konto?</span>
                <Link to="/login" className="vista-button" style={{marginLeft: 8, padding: '6px 12px'}}>
                    Zaloguj się
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
