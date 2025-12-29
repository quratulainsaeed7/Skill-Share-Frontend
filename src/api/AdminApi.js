import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AdminApi = {
    getUsers: async () => {
        return request(`${API_BASE_URL}/api/admin/users`);
    },

    verifyUser: async (id, isVerified) => {
        return request(`${API_BASE_URL}/api/admin/users/${id}/verify`, {
            method: 'PATCH',
            body: JSON.stringify({ isVerified })
        });
    },

    deleteUser: async (id, force = false) => {
        return request(`${API_BASE_URL}/api/admin/users/${id}?force=${force}`, {
            method: 'DELETE'
        });
    },

    changeRole: async (id, role) => {
        return request(`${API_BASE_URL}/api/admin/users/${id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role })
        });
    },

    adjustWallet: async (id, amount, type, reason) => {
        return request(`${API_BASE_URL}/api/admin/users/${id}/wallet`, {
            method: 'POST',
            body: JSON.stringify({ amount, type, reason })
        });
    },

    sanctionUser: async (id, action) => {
        return request(`${API_BASE_URL}/api/admin/users/${id}/sanction`, {
            method: 'POST',
            body: JSON.stringify({ action })
        });
    }
};

export default AdminApi;

