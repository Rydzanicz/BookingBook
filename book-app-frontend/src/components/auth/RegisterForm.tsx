import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form.username, form.email, form.password).catch(alert);
  };

  return (
      <form onSubmit={onSubmit}>
        <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            required
        />
        <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
        />
        <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            required
        />
        <button type="submit">Register</button>
      </form>
  );
};

export default RegisterForm;
