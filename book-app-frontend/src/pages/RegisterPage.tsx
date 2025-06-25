import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
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
    <div className="register-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>BookApp</h1>
          <h2>Utwórz konto</h2>
          <p>Rozpocznij zarządzanie swoją biblioteką książek</p>
        </div>

        <RegisterForm onSuccess={() => {}} />

        <div className="auth-footer">
          <p>
            Masz już konto?{' '}
            <Link to="/login" className="auth-link">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;