// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Auth restoration failed", error);
                localStorage.removeItem('skillshare_auth_token');
                localStorage.removeItem('skillshare_current_user');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const { user: loggedInUser } = await authService.login(email, password);
        setUser(loggedInUser);
        return loggedInUser;
    };

    const signup = async (userData) => {
        return await authService.register(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const verifyEmail = async (email) => {
        await authService.verifyEmail(email);
    };

    const completeProfile = async (profileData) => {
        if (!user) throw new Error("No user logged in");
        const updatedUser = await authService.updateProfile(user.id, profileData);
        setUser(updatedUser);
        return updatedUser;
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        verifyEmail,
        completeProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
