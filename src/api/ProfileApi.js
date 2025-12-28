import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:4000';
const PROFILE_ENDPOINT = `${API_BASE_URL}/profile`;

const request = async (url, options = {}) => {
    const method = options.method || 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
    const data = options.body;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
            validateStatus: () => true,
        });

        const resData = response.data ?? null;

        if (response.status < 200 || response.status >= 300) {
            const errorMessage = resData?.message || resData?.error || `HTTP ${response.status}: ${response.statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData;
    } catch (error) {
        if (!error.response) {
            throw new Error('Network error: Unable to reach the server. Is the backend running?');
        }
        const { status, statusText, data: errData } = error.response;
        const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
};

export const ProfileApi = {
    createProfile: async (userId, profileData) => {
        return request(`${PROFILE_ENDPOINT}/${userId}`, {
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

