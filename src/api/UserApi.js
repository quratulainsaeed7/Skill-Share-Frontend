const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:4001';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
import axios from "axios";

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
            // We want to manually handle non-2xx like fetch does
            validateStatus: () => true,
        });

        const resData = response.data ?? null;

        if (response.status < 200 || response.status >= 300) {
            const errorMessage = resData?.message || resData?.error || `HTTP ${response.status}: ${response.statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData;
    } catch (error) {
        // Axios throws for network errors (no response)
        if (!error.response) {
            throw new Error('Network error: Unable to reach the server. Is the backend running?');
        }

        const { status, statusText, data: errData } = error.response;
        const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
};

export const UserApi = {
    createUser: async (userData) => {
        return request(USERS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email: userData.email,
                name: userData.name || userData.fullName,
                password: userData.password,
                role: userData.role?.toUpperCase() || 'LEARNER',
            }),
        });
    },

    getAllUsers: async () => {
        return request(USERS_ENDPOINT);
    },

    getUserById: async (userId) => {
        return request(`${USERS_ENDPOINT}/${userId}`);
    },

    getUserByEmail: async (email) => {
        const encodedEmail = encodeURIComponent(email);
        return request(`${USERS_ENDPOINT}/by-email?email=${encodedEmail}`);
    },

    updateUser: async (userId, updateData) => {
        return request(`${USERS_ENDPOINT}/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                ...(updateData.email && { email: updateData.email }),
                ...(updateData.name && { name: updateData.name }),
                ...(updateData.fullName && { name: updateData.fullName }),
                ...(updateData.password && { password: updateData.password }),
                ...(updateData.role && { role: updateData.role.toUpperCase() }),
                ...(updateData.bio && { bio: updateData.bio }),
                ...(updateData.phone && { phone: updateData.phone }),
                ...(updateData.city && { city: updateData.city }),
                ...(updateData.profileCompleted !== undefined && { profileCompleted: updateData.profileCompleted }),
                ...(updateData.learnerProfile && { learnerProfile: updateData.learnerProfile }),
                ...(updateData.mentorProfile && { mentorProfile: updateData.mentorProfile }),
            }),
        });
    },

    deleteUser: async (userId) => {
        return request(`${USERS_ENDPOINT}/${userId}`, {
            method: 'DELETE',
        });
    },

    checkEmailExists: async (email) => {
        try {
            const user = await UserApi.getUserByEmail(email);
            return !!user;
        } catch (error) {
            return false;
        }
    },

    verifyCredentials: async (email, password) => {
        const user = await UserApi.getUserByEmail(email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.password !== password) {
            throw new Error('Invalid email or password');
        }

        if (!user.isVerified) {
            throw new Error('Please verify your email first');
        }

        return user;
    },

    verifyUser: async (userId, isVerified = true) => {
        return request(`${USERS_ENDPOINT}/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ isVerified }),
        });
    },
    loginUser: async (credentials) => {
        return request(`${USERS_ENDPOINT}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });
    }
};

export default UserApi;
