import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USERS_ENDPOINT = `${API_BASE_URL}/api/users`;
const PROFILE_ENDPOINT = `${API_BASE_URL}/api/users/profile`;

export const ProfileApi = {
    /**
     * Complete user profile - calls /users/{userId}/complete-profile
     */
    createProfile: async (userId, profileData) => {
        return request(`${USERS_ENDPOINT}/${userId}/complete-profile`, {
            method: 'POST',
            body: JSON.stringify(profileData || {}),
        });
    },

    getProfile: async (userId) => {
        return request(`${PROFILE_ENDPOINT}/${userId}`);
    },

    updateProfile: async (userId, updateData) => {
        return request(`${PROFILE_ENDPOINT}/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData || {}),
        });
    },

    deleteProfile: async (userId) => {
        return request(`${PROFILE_ENDPOINT}/${userId}`, {
            method: 'DELETE',
        });
    },
};

export default ProfileApi;


