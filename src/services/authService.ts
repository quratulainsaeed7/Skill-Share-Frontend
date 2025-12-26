import UserService from './userService';
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
            const updatedUser = await UserApi.updateUser(userId, profileData);

            const currentUser = UserService.getUser();
            const mergedUser = {
                ...currentUser,
                ...updatedUser,
                ...profileData,
                profileCompleted: true
            };

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
