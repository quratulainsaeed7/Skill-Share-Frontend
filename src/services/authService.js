// src/services/authService.js
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
    checkEmailExists: (email) => {
        const users = getUsers();
        return users.some((u) => u.email === email);
    },

    // Register new user
    register: async (userData) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const users = getUsers();
        if (users.some((u) => u.email === userData.email)) {
            throw new Error('Email already exists');
        }

        if (users.some((u) => u.phone === userData.phone)) {
            throw new Error('Phone number already exists');
        }

        const newUser = {
            id: uuidv4(),
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
        await new Promise((resolve) => setTimeout(resolve, 800));

        const users = getUsers();
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.isVerified) {
            throw new Error('Please verify your email first');
        }

        const token = uuidv4(); // Mock token
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

        return { user, token };
    },

    // Verify email
    verifyEmail: async (email) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const users = getUsers();
        const userIndex = users.findIndex((u) => u.email === email);

        if (userIndex === -1) throw new Error('User not found');

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
        const users = getUsers();
        const freshUser = users.find(u => u.id === user.id);
        return freshUser || user;
    },

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Update Profile
    updateProfile: async (userId, profileData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const users = getUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) throw new Error('User not found');

        // Merge learner profile data into top-level user object for easier access
        const updatedUser = {
            ...users[index],
            ...profileData,
            profileCompleted: true
        };

        // If learner profile has degree/institution, add to user level
        if (profileData.learnerProfile) {
            updatedUser.degree = profileData.learnerProfile.degree;
            updatedUser.institution = profileData.learnerProfile.institution;
        }

        users[index] = updatedUser;

        saveUsers(users);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));

        return users[index];
    }
};
