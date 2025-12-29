import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected Route Guard Component
 * Enforces strict workflow progression:
 * 1. REGISTER → 2. LOGIN → 3. EMAIL_VERIFIED → 4. PROFILE_COMPLETED → 5. FULL_APP_ACCESS
 * 
 * Handles:
 * - Page refresh
 * - Deep links
 * - Unauthenticated access
 * - Workflow checkpoints (email verification, profile completion)
 */
const ProtectedRoute = ({ children, requiredRole = null, bypassWorkflow = false }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Log route access attempts for debugging
        if (!loading) {
            if (!isAuthenticated) {
                console.warn('🚫 Unauthorized access attempt to:', location.pathname);
            } else if (requiredRole && user?.role !== requiredRole && user?.role !== 'BOTH' && user?.role !== 'ADMIN') {
                console.warn('🚫 Insufficient permissions. Required:', requiredRole, 'User role:', user?.role);
            } else if (!user?.emailVerified) {
                console.warn('⚠️ Email not verified. Redirecting to verification page.');
            } else if (!user?.profileCompleted) {
                console.warn('⚠️ Profile not completed. Redirecting to profile completion page.');
            }
        }
    }, [isAuthenticated, loading, location.pathname, requiredRole, user]);

    // Show nothing while checking authentication (prevents UI flicker)
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

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Enforce workflow checkpoints (unless explicitly bypassed)
    if (!bypassWorkflow) {
        // Step 1: Email verification required
        if (!user?.emailVerified && location.pathname !== '/verify-email') {
            console.log('🔄 Redirecting to email verification');
            return <Navigate to="/verify-email" replace />;
        }

        // Step 2: Profile completion required (only after email is verified)
        if (user?.emailVerified && !user?.profileCompleted && location.pathname !== '/complete-profile') {
            console.log('🔄 Redirecting to profile completion');
            return <Navigate to="/complete-profile" replace />;
        }
    }

    // Check role-based access if required
    if (requiredRole) {
        const hasRequiredRole =
            user?.role === requiredRole ||
            user?.role === 'BOTH' ||
            user?.role === 'ADMIN';

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // User is authenticated and authorized, render children
    return <>{children}</>;
};

export default ProtectedRoute;
