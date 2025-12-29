import request from '../api/apiClient';

const TOKEN_KEY = 'skillshare_token';
const USER_KEY = 'skillshare_user';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role?: 'LEARNER' | 'MENTOR' | 'BOTH';
}

interface LoginResult {
    user: any;
    accessToken: string;
    message?: string;
}

interface RegisterResult {
    user: any;
    accessToken: string;
    message?: string;
}

class AuthService {
    /**
     * Login user with JWT authentication
     */
    async login(email: string, password: string): Promise<LoginResult> {
        try {
            const response = await request(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (response.accessToken) {
                this.setToken(response.accessToken);
                this.setUser(response.user);
            }

            return {
                user: response.user,
                accessToken: response.accessToken,
                message: response.message,
            };
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    /**
     * Register new user with JWT authentication
     */
    async register(userData: RegisterUserData): Promise<RegisterResult> {
        try {
            const response = await request(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role || 'LEARNER',
                }),
            });

            if (response.accessToken) {
                this.setToken(response.accessToken);
                this.setUser(response.user);
            }

            return {
                user: response.user,
                accessToken: response.accessToken,
                message: response.message,
            };
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    /**
     * Validate JWT token
     */
    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await request(`${API_BASE_URL}/api/auth/validate`, {
                method: 'POST',
                body: JSON.stringify({ token }),
            });

            return response.valid === true;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    /**
     * Refresh JWT token with latest user data
     * Called after email verification or profile completion
     */
    async refreshToken(userId: string): Promise<{ accessToken: string; user: any }> {
        try {
            const response = await request(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: 'POST',
                body: JSON.stringify({ userId }),
            });

            if (response.accessToken) {
                this.setToken(response.accessToken);
                this.setUser(response.user);
            }

            return {
                accessToken: response.accessToken,
                user: response.user,
            };
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    async getCurrentUserFromAPI() {
        try {
            const response = await request(`${API_BASE_URL}/api/auth/me`, {
                method: 'GET',
            });

            if (response.user) {
                this.setUser(response.user);
            }

            return response.user;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw error;
        }
    }

    /**
     * Store token securely (sessionStorage for security)
     */
    setToken(token: string): void {
        if (token) {
            sessionStorage.setItem(TOKEN_KEY, token);
        }
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    /**
     * Store user info
     */
    setUser(user: any): void {
        if (user) {
            sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    }

    /**
     * Get stored user
     */
    getUser(): any {
        const userJson = sessionStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Get current user from storage (synchronous)
     */
    getCurrentUser(): any {
        return this.getUser();
    }

    /**
     * Clear authentication data
     */
    clearAuth(): void {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    }

    /**
     * Logout user
     */
    logout(): void {
        this.clearAuth();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Update user profile and mark as complete
     */
    async updateProfile(userId: string, profileData: any): Promise<any> {
        try {
            // Call complete-profile endpoint which handles both profile creation and marking as complete
            const response = await request(`${API_BASE_URL}/api/users/${userId}/complete-profile`, {
                method: 'POST',
                body: JSON.stringify(profileData),
            });

            console.log('✅ Profile completed:', response);

            // Refresh JWT to get updated profileCompleted claim
            const refreshed = await this.refreshToken(userId);

            return refreshed.user;
        } catch (error: any) {
            console.error('❌ Profile update failed:', error);
            throw new Error(error.message || 'Profile update failed');
        }
    }

    /**
     * Check if email exists (for backward compatibility)
     */
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const UserApi = (await import('../api/UserApi')).default;
            return await UserApi.checkEmailExists(email);
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    }

    /**
     * Verify email (for backward compatibility)
     */
    async verifyEmail(): Promise<boolean> {
        try {
            const UserService = (await import('./UserService')).default;
            await UserService.verifyEmail();
            return true;
        } catch (error: any) {
            throw new Error(error.message || 'Email verification failed');
        }
    }
}

export const authService = new AuthService();
export default authService;
