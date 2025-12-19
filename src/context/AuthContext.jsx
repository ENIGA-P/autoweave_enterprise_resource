import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const token = localStorage.getItem('token');
        if (token) {
            // Ideally, verify token with backend here
            // For now, we'll assume it's valid and set a dummy user or fetch user profile
            // api.get('/auth/me').then(response => setUser(response.data)).catch(() => logout());
            setUser({ name: 'Owner', role: 'owner' }); // Mock user
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // const response = await api.post('/auth/login', { username, password });
            // const { token, user } = response.data;

            // Mock login with specific credentials
            if (username === 'samytex@gmail.com' && password === 'samy@1978') {
                const token = 'mock-jwt-token';
                const user = { name: 'Samy', role: 'owner' };

                localStorage.setItem('token', token);
                setUser(user);
                return true;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
