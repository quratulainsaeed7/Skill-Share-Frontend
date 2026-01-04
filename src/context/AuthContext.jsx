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
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from storage on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const storedToken = authService.getToken();
            const storedUser = authService.getUser();

            if (storedToken && storedUser) {
                // Validate token with backend
                const isValid = await authService.validateToken(storedToken);

                if (isValid) {
                    // Refresh user data from backend to get latest emailVerified/profileCompleted status
                    try {
                        const userId = storedUser.userId || storedUser.id;
                        const refreshed = await authService.refreshToken(userId);
                        setToken(refreshed.accessToken);
                        setUser(refreshed.user);
                        setIsAuthenticated(true);
                        console.log('✅ Auth initialized with refreshed user data:', refreshed.user);
                    } catch (refreshError) {
                        // If refresh fails, use stored data as fallback
                        console.warn('⚠️ Token refresh failed, using stored data:', refreshError);
                        setToken(storedToken);
                        setUser(storedUser);
                        setIsAuthenticated(true);
                    }
                } else {
                    // Token invalid or expired, clear storage
                    authService.clearAuth();
                }
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            authService.clearAuth();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            setToken(response.accessToken);
            setUser(response.user);
            setIsAuthenticated(true);

            return response.user;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authService.register({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'LEARNER',
            });

            setToken(response.accessToken);
            setUser(response.user);
            setIsAuthenticated(true);

            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.clearAuth();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        authService.setUser(updatedUser);
    };

    const verifyEmail = async (verificationToken) => {
        try {
            console.log('🔐 Verifying email with token:', verificationToken);
            // Verify email via user-service - NO AUTH REQUIRED
            const response = await fetch(`${import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000'}/api/users/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // NO Authorization header - this is a public endpoint
                },
                body: JSON.stringify({ token: verificationToken }),
            });

            const data = await response.json();
            console.log('✅ Email verification response:', data);

            if (data.success && data.userId) {
                // Refresh JWT to get updated emailVerified claim
                const refreshed = await authService.refreshToken(data.userId);
                setUser(refreshed.user);
                setToken(refreshed.accessToken);
                return refreshed.user;
            } else {
                throw new Error(data.message || 'Email verification failed');
            }
        } catch (error) {
            console.error('❌ Email verification failed:', error);
            throw error;
        }
    };

    const completeProfile = async (profileData) => {
        if (!user) throw new Error("No user logged in");
        const userId = user.userId || user.id;

        // updateProfile already refreshes the token internally
        const updatedUser = await authService.updateProfile(userId, profileData);

        // Get the refreshed token that was stored by authService
        const refreshedToken = authService.getToken();

        // Update context state with new user and token
        setUser(updatedUser);
        setToken(refreshedToken);

        console.log('✅ Profile completed, user updated:', updatedUser);
        return updatedUser;
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
        verifyEmail,
        completeProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

