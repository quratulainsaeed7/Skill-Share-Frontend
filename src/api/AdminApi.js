const API_BASE_URL = import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008/admin';

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
            url: `${API_BASE_URL}${url}`,
            method,
            headers,
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const AdminApi = {
    getUsers: async () => {
        return request('/users');
    },

    verifyUser: async (id, isVerified) => {
        return request(`/users/${id}/verify`, {
            method: 'PATCH',
            body: { isVerified }
        });
    },

    deleteUser: async (id, force = false) => {
        return request(`/users/${id}?force=${force}`, {
            method: 'DELETE'
        });
    },

    changeRole: async (id, role) => {
        return request(`/users/${id}/role`, {
            method: 'PATCH',
            body: { role }
        });
    },

    adjustWallet: async (id, amount, type, reason) => {
        return request(`/users/${id}/wallet`, {
            method: 'POST',
            body: { amount, type, reason }
        });
    },

    sanctionUser: async (id, action) => {
        return request(`/users/${id}/sanction`, {
            method: 'POST',
            body: { action }
        });
    }
};

export default AdminApi;
