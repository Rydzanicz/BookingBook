import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authAPI, LoginRequest } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.token, data.user);
      setErrors({});
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      setErrors({
        general: error.response?.data?.message || 'Błąd logowania'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Podstawowa walidacja
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email jest wymagany';
    if (!formData.password) newErrors.password = 'Hasło jest wymagane';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Wyczyść błąd dla tego pola
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <button 
        type="submit" 
        disabled={loginMutation.isPending}
        className="submit-button"
      >
        {loginMutation.isPending ? 'Logowanie...' : 'Zaloguj się'}
      </button>
    </form>
  );
};

export default LoginForm;