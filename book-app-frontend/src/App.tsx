// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from "./components/auth/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient();

const App: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login"    element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/search"
                        element={
                            <PrivateRoute>
                                <SearchPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Domyślne przekierowanie */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
