const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:4001';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error: Unable to reach the server. Is the backend running?');
        }
        throw error;
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
                // ...(updateData.email && { email: updateData.email }),
                // ...(updateData.name && { name: updateData.name }),
                // ...(updateData.fullName && { name: updateData.fullName }),
                // ...(updateData.password && { password: updateData.password }),
                // ...(updateData.role && { role: updateData.role.toUpperCase() }),
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
};

export default UserApi;
