import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password).catch(alert);
  };

  return (
      <form onSubmit={onSubmit}>
        <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
        />
        <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
        />
        <button type="submit">Log in</button>
      </form>
  );
};

export default LoginForm;
