import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>BookApp</h1>
          <h2>Zaloguj się</h2>
          <p>Zarządzaj swoją kolekcją przeczytanych książek</p>
        </div>

        <LoginForm onSuccess={() => {}} />

        <div className="auth-footer">
          <p>
            Nie masz konta?{' '}
            <Link to="/register" className="auth-link">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;