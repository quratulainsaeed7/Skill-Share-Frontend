import UserService from './UserService';
import UserApi from '../api/UserApi';

const TOKEN_KEY = 'skillshare_auth_token';

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role: 'learner' | 'mentor';
    [key: string]: any;
}

interface LoginResult {
    user: any;
    token: string;
}

interface RegisterResult {
    success: boolean;
    message: string;
    userId?: string;
}

export const authService = {
    checkEmailExists: async (email: string): Promise<boolean> => {
        try {
            return await UserApi.checkEmailExists(email);
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    },

    register: async (userData: RegisterUserData): Promise<RegisterResult> => {
        try {
            const result = await UserService.registerUser(userData);
            return {
                success: true,
                message: 'User registered successfully',
                userId: result.data?.userId || result.data?.id
            };
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    login: async (email: string, password: string): Promise<LoginResult> => {
        try {
            const result = await UserService.loginUser({ email, password });
            const user = result.data;

            const token = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
            sessionStorage.setItem(TOKEN_KEY, token);

            return { user, token };
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    },

    verifyEmail: async (email: string): Promise<boolean> => {
        try {
            await UserService.verifyEmail();
            return true;
        } catch (error: any) {
            throw new Error(error.message || 'Email verification failed');
        }
    },

    getCurrentUser: () => {
        return UserService.getUser();
    },

    logout: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        UserService.clearUser();
    },

    updateProfile: async (userId: string, profileData: any): Promise<any> => {
        try {
            console.log('🔄 updateProfile called with:', { userId, profileData });
            const updatedUser = await UserApi.updateUser(userId, profileData);
            console.log('✅ Backend returned updated user:', updatedUser);

            const currentUser = UserService.getUser();
            console.log('📋 Current user from storage:', {
                userId: currentUser.userId,
                role: currentUser.role
            });

            const mergedUser = {
                ...currentUser,
                ...updatedUser,
                ...profileData,
                // Explicitly preserve critical user fields that should never be overwritten
                userId: currentUser.userId,
                email: updatedUser.email || currentUser.email,
                role: updatedUser.role || currentUser.role,
                profileCompleted: true
            };

            console.log('🎯 Merged user to be stored:', {
                userId: mergedUser.userId,
                role: mergedUser.role,
                profileCompleted: mergedUser.profileCompleted
            });

            if (profileData.learnerProfile) {
                mergedUser.degree = profileData.learnerProfile.degree;
                mergedUser.institution = profileData.learnerProfile.institution;
            }

            UserService.setUser(mergedUser);
            return mergedUser;
        } catch (error: any) {
            throw new Error(error.message || 'Profile update failed');
        }
    },

    isAuthenticated: (): boolean => {
        return UserService.isAuthenticated();
    },

    getToken: (): string | null => {
        return sessionStorage.getItem(TOKEN_KEY);
    }
};

export default authService;
