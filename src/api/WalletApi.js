// src/api/WalletApi.js
import request from './apiClient';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000';
const WALLET_ENDPOINT = `${API_BASE_URL}/api/wallet`;

export const WalletApi = {
    /**
     * Get wallet balance for a user
     * @param {string} userId - User ID
     * @returns {Promise<{balance: number}>}
     */
    getBalance: async (userId) => {
        return request(`${WALLET_ENDPOINT}/${userId}/balance`);
    },

    /**
     * Get full wallet details including stats
     * @param {string} userId - User ID
     * @returns {Promise<{walletId: string, userId: string, balance: number, totalEarned: number, totalSpent: number}>}
     */
    getWallet: async (userId) => {
        return request(`${WALLET_ENDPOINT}/${userId}`);
    },

    /**
     * Get transaction history for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array<{transactionId: string, amount: number, type: string, description: string, createdAt: string}>>}
     */
    getTransactions: async (userId) => {
        return request(`${WALLET_ENDPOINT}/${userId}/transactions`);
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
        return request(`${WALLET_ENDPOINT}/${userId}/earn`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
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
        return request(`${WALLET_ENDPOINT}/${userId}/spend`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
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
        return request(`${WALLET_ENDPOINT}/${userId}/adjust`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

