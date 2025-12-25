// src/services/authService.js
/**
 * authService - Authentication facade that delegates to UserService.
 * 
 * REFACTORED: Removed all localStorage "database" logic.
 * Now uses UserService + UserApi as the single source of truth.
 * User data comes from backend API, stored only in sessionStorage via UserService.
 */
import UserService from './UserService';
import UserApi from '../api/UserApi';

// Token storage key (sessionStorage only)
const TOKEN_KEY = 'skillshare_auth_token';

export const authService = {
    /**
     * Check if email already exists in the backend.
     * Uses real API call via UserApi.
     */
    checkEmailExists: async (email) => {
        try {
            return await UserApi.checkEmailExists(email);
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    },

    /**
     * Register a new user via the backend API.
     * User is stored in sessionStorage via UserService after successful registration.
     */
    register: async (userData) => {
        try {
            // Use UserService.registerUser which calls the real API
            const result = await UserService.registerUser(userData);
            return {
                success: true,
                message: 'User registered successfully',
                userId: result.data?.userId || result.data?.id
            };
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    /**
     * Login user via the backend API.
     * User is stored in sessionStorage via UserService after successful login.
     */
    login: async (email, password) => {
        try {
            // Use UserService.loginUser which calls the real API
            const result = await UserService.loginUser({ email, password });
            const user = result.data;

            // Generate a session token (in production, this would come from the backend)
            const token = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
            sessionStorage.setItem(TOKEN_KEY, token);

            return { user, token };
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    },

    /**
     * Verify user's email via the backend API.
     * Updates the stored user object with verified status.
     */
    verifyEmail: async (email) => {
        try {
            // Use UserService.verifyEmail which calls the real API
            await UserService.verifyEmail();
            return true;
        } catch (error) {
            throw new Error(error.message || 'Email verification failed');
        }
    },

    /**
     * Get the current authenticated user from sessionStorage.
     * No localStorage database - user comes only from sessionStorage.
     */
    getCurrentUser: () => {
        return UserService.getUser();
    },

    /**
     * Logout the current user.
     * Clears sessionStorage via UserService.
     */
    logout: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        UserService.clearUser();
    },

    /**
     * Update user profile via the backend API.
     * Updates the stored user object after successful update.
     */
    updateProfile: async (userId, profileData) => {
        try {
            // Call the real API to update user profile
            const updatedUser = await UserApi.updateUser(userId, profileData);

            // Merge the update with stored user and save to sessionStorage
            const currentUser = UserService.getUser();
            const mergedUser = {
                ...currentUser,
                ...updatedUser,
                ...profileData,
                profileCompleted: true
            };

            // Handle learner profile specific fields
            if (profileData.learnerProfile) {
                mergedUser.degree = profileData.learnerProfile.degree;
                mergedUser.institution = profileData.learnerProfile.institution;
            }

            UserService.setUser(mergedUser);
            return mergedUser;
        } catch (error) {
            throw new Error(error.message || 'Profile update failed');
        }
    },

    /**
     * Check if user is currently authenticated.
     */
    isAuthenticated: () => {
        return UserService.isAuthenticated();
    },

    /**
     * Get the current auth token from sessionStorage.
     */
    getToken: () => {
        return sessionStorage.getItem(TOKEN_KEY);
    }
};
