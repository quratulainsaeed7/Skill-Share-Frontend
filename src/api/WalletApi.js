// src/api/WalletApi.js
import axios from 'axios';

const WALLET_SERVICE_URL = import.meta.env.VITE_WALLET_SERVICE_URL || 'http://localhost:4005';

const walletClient = axios.create({
    baseURL: `${WALLET_SERVICE_URL}/wallet`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const WalletApi = {
    /**
     * Get wallet balance for a user
     * @param {string} userId - User ID
     * @returns {Promise<{balance: number}>}
     */
    getBalance: async (userId) => {
        const response = await walletClient.get(`/${userId}/balance`);
        return response.data;
    },

    /**
     * Get full wallet details including stats
     * @param {string} userId - User ID
     * @returns {Promise<{walletId: string, userId: string, balance: number, totalEarned: number, totalSpent: number}>}
     */
    getWallet: async (userId) => {
        const response = await walletClient.get(`/${userId}`);
        return response.data;
    },

    /**
     * Get transaction history for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array<{transactionId: string, amount: number, type: string, description: string, createdAt: string}>>}
     */
    getTransactions: async (userId) => {
        const response = await walletClient.get(`/${userId}/transactions`);
        return response.data;
    },

    /**
     * Earn credits (after completing a lesson as mentor)
     * @param {string} userId - User ID
     * @param {Object} data - Transaction data
     * @param {number} data.amount - Credits to earn
     * @param {string} [data.bookingId] - Related booking ID
     * @param {string} [data.description] - Transaction description
     * @returns {Promise<Object>}
     */
    earnCredits: async (userId, data) => {
        const response = await walletClient.post(`/${userId}/earn`, data);
        return response.data;
    },

    /**
     * Spend credits (when booking a lesson as learner)
     * @param {string} userId - User ID
     * @param {Object} data - Transaction data
     * @param {number} data.amount - Credits to spend
     * @param {string} data.bookingId - Related booking ID
     * @param {string} [data.description] - Transaction description
     * @returns {Promise<Object>}
     */
    spendCredits: async (userId, data) => {
        const response = await walletClient.post(`/${userId}/spend`, data);
        return response.data;
    },

    /**
     * Adjust credits (admin only)
     * @param {string} userId - User ID
     * @param {Object} data - Adjustment data
     * @param {number} data.amount - Credits to adjust (positive or negative)
     * @param {string} [data.description] - Reason for adjustment
     * @returns {Promise<Object>}
     */
    adjustCredits: async (userId, data) => {
        const response = await walletClient.patch(`/${userId}/adjust`, data);
        return response.data;
    },
};
