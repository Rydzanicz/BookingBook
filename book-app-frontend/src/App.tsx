import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
