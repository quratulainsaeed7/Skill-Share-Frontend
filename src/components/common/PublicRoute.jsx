import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Public Route Guard Component
 * Redirects authenticated users away from auth pages (login/signup)
 * Prevents logged-in users from seeing login screen
 */
const PublicRoute = ({ children, redirectTo = '/home' }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show nothing while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    // Redirect authenticated users away from public pages
    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // User is not authenticated, render public page
    return <>{children}</>;
};

export default PublicRoute;
