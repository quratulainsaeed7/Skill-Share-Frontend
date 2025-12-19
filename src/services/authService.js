// src/services/authService.js
import { UserApi } from '../api/UserApi';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'skillshare_users';
const CURRENT_USER_KEY = 'skillshare_current_user';
const TOKEN_KEY = 'skillshare_auth_token';

// Helper to get users from localStorage
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    // Check if email exists
    checkEmailExists: async (email) => {
        return await UserApi.checkEmailExists(email);
    },

    // Register new user
    register: async (userData) => {
        const users = getUsers();
        if (users.some((u) => u.email === userData.email)) {
            throw new Error('Email already exists');
        }

        if (users.some((u) => u.phone === userData.phone)) {
            throw new Error('Phone number already exists');
        }

        const response = await UserApi.createUser(userData);
        const newUser = {
            id: response.userId,
            ...userData,
            isVerified: false,
            profileCompleted: false,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        return { success: true, message: 'User registered successfully', userId: newUser.id };
    },

    // Login user
    login: async (email, password) => {
        const user = await UserApi.verifyCredentials(email, password);

        const token = uuidv4();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

        return { user, token };
    },

    // Verify email
    verifyEmail: async (email) => {
        const users = getUsers();
        const userIndex = users.findIndex((u) => u.email === email);

        if (userIndex === -1) throw new Error('User not found');

        await UserApi.verifyUser(users[userIndex].id);
        users[userIndex].isVerified = true;
        saveUsers(users);

        return true;
    },

    // Get current user (for page reloads)
    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        if (!userStr) return null;

        // Always refresh from "DB" to get latest data
        const user = JSON.parse(userStr);
        return user;
    },

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Update Profile
    updateProfile: async (userId, profileData) => {
        const updatedUser = await UserApi.updateUser(userId, profileData);

        const users = getUsers();
        const index = users.findIndex((u) => u.id === userId);

        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...profileData,
                profileCompleted: true,
            };
            saveUsers(users);
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    },
};
