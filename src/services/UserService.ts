import UserApi from '../api/UserApi';

// Storage key for the single user object in sessionStorage
const USER_STORAGE_KEY = 'user';

/**
 * UserService - Centralized service for all user-related operations.
 * All user data access must go through this service.
 * Uses sessionStorage with a single 'user' key storing the full User object.
 */
class UserService {

    // ==================== SESSION STORAGE HELPERS ====================

    /**
     * Retrieves the current user from sessionStorage.
     * @returns The user object or null if not authenticated.
     */
    static getUser() {
        try {
            const userJson = sessionStorage.getItem(USER_STORAGE_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Failed to parse user from sessionStorage:', error);
            return null;
        }
    }

    /**
     * Stores the user object in sessionStorage.
     * @param user - The full user object to store.
     */
    static setUser(user) {
        if (!user) {
            console.warn('Attempted to set null/undefined user');
            return;
        }
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    /**
     * Clears the user from sessionStorage (logout).
     */
    static clearUser() {
        sessionStorage.removeItem(USER_STORAGE_KEY);
    }

    /**
     * Checks if a user is currently authenticated.
     * @returns True if a user exists in sessionStorage.
     */
    static isAuthenticated() {
        return this.getUser() !== null;
    }

    /**
     * Gets a specific field from the stored user object.
     * @param field - The field name to retrieve (e.g., 'userId', 'name', 'role').
     * @returns The field value or null if user doesn't exist.
     */
    static getUserField(field) {
        const user = this.getUser();
        return user ? user[field] : null;
    }

    // ==================== API METHODS ====================

    /**
     * Registers a new user and stores them in sessionStorage.
     */
    static async registerUser(userData) {
        // Add missing fields for registration
        userData.isVerified = false;
        userData.createdAt = new Date().toISOString();
        userData.updatedAt = new Date().toISOString();

        try {
            const user = await UserApi.createUser(userData);
            console.log('User registered:', user);

            // Store full user object in sessionStorage
            this.setUser(user);

            return { success: true, data: user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    }

    /**
     * Verifies the user's email and updates the stored user object.
     */
    static async verifyEmail() {
        try {
            const user = this.getUser();
            if (!user?.userId) {
                throw new Error('No user found in session');
            }

            const response = await UserApi.verifyUser(user.userId);

            // Update the stored user with verified status
            const updatedUser = { ...user, isVerified: true };
            this.setUser(updatedUser);

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Email verification failed');
        }
    }

    /**
     * Verifies email with token from URL
     */
    static async verifyEmailWithToken(token: string) {
        try {
            const response = await UserApi.verifyEmailWithToken(token);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Email verification failed');
        }
    }

    /**
     * Resends verification email
     */
    static async resendVerificationEmail(email: string) {
        try {
            const response = await UserApi.resendVerificationEmail(email);
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to resend verification email');
        }
    }

    /**
     * Logs in a user and stores them in sessionStorage.
     */
    static async loginUser(credentials) {
        try {
            const user = await UserApi.loginUser(credentials);
            console.log('User logged in:', user);

            // Store full user object in sessionStorage (replaces individual field storage)
            this.setUser(user);

            return { success: true, data: user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    /**
     * Logs out the current user by clearing sessionStorage.
     */
    static logout() {
        this.clearUser();
    }

    /**
     * Updates the stored user object with new data.
     * Useful after profile updates or other user modifications.
     */
    static updateStoredUser(updates) {
        const currentUser = this.getUser();
        if (!currentUser) {
            console.warn('Cannot update user: no user in session');
            return null;
        }
        const updatedUser = { ...currentUser, ...updates };
        this.setUser(updatedUser);
        return updatedUser;
    }

    /**
     * Gets user/mentor details by user ID from the backend.
     */
    static async getUserById(userId: string) {
        try {
            return await UserApi.getUserById(userId);
        } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
            throw error;
        }
    }
}

export default UserService;