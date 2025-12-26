// src/services/walletService.js
// REFACTORED: Removed all localStorage logic - now fully backed by wallet-service API

import { WalletApi } from '../api/WalletApi';

export const walletService = {
    /**
     * Get wallet balance for a user
     * @param {string} userId - User ID
     * @returns {Promise<number>} Balance in credits
     */
    getBalance: async (userId) => {
        try {
            const data = await WalletApi.getBalance(userId);
            return data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Failed to fetch wallet balance');
        }
    },

    /**
     * Get full wallet details including statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Wallet data with balance, totalEarned, totalSpent
     */
    getWallet: async (userId) => {
        try {
            return await WalletApi.getWallet(userId);
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw new Error('Failed to fetch wallet details');
        }
    },

    /**
     * Get transaction history for a user
     * Server-side filtering and sorting applied
     * @param {string} userId - User ID
     * @param {Object} filters - Filter options (not implemented client-side, backend handles all filtering)
     * @returns {Promise<Array>} Array of transactions
     */
    getTransactions: async (userId, filters = {}) => {
        try {
            // Backend returns transactions already sorted by date (newest first)
            return await WalletApi.getTransactions(userId);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw new Error('Failed to fetch transactions');
        }
    },

    /**
     * Get transaction statistics
     * Calculated server-side from wallet entity
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Stats including totalEarned, totalSpent, balance, transactionCount
     */
    getTransactionStats: async (userId) => {
        try {
            const wallet = await WalletApi.getWallet(userId);
            const transactions = await WalletApi.getTransactions(userId);

            return {
                totalIncoming: wallet.totalEarned,
                totalOutgoing: wallet.totalSpent,
                balance: wallet.balance,
                transactionCount: transactions.length,
            };
        } catch (error) {
            console.error('Error fetching transaction stats:', error);
            throw new Error('Failed to fetch transaction statistics');
        }
    },

    /**
     * Earn credits (when completing a lesson as mentor)
     * @param {string} userId - User ID
     * @param {Object} data - Transaction data
     * @param {number} data.amount - Credits to earn
     * @param {string} [data.bookingId] - Related booking ID
     * @param {string} [data.description] - Transaction description
     * @returns {Promise<Object>} Updated wallet
     */
    earnCredits: async (userId, data) => {
        try {
            return await WalletApi.earnCredits(userId, data);
        } catch (error) {
            console.error('Error earning credits:', error);
            throw new Error('Failed to earn credits');
        }
    },

    /**
     * Spend credits (when booking a lesson as learner)
     * @param {string} userId - User ID
     * @param {Object} data - Transaction data
     * @param {number} data.amount - Credits to spend
     * @param {string} data.bookingId - Related booking ID (required)
     * @param {string} [data.description] - Transaction description
     * @returns {Promise<Object>} Updated wallet
     */
    spendCredits: async (userId, data) => {
        try {
            return await WalletApi.spendCredits(userId, data);
        } catch (error) {
            console.error('Error spending credits:', error);
            // Backend will throw if insufficient balance
            throw new Error(error.response?.data?.message || 'Failed to spend credits');
        }
    },

    /**
     * Create a transaction (legacy method for backward compatibility)
     * Maps to spendCredits for outgoing or earnCredits for incoming
     * @deprecated Use spendCredits or earnCredits directly
     */
    createTransaction: async (transactionData) => {
        const { userId, type, amount, description, bookingId } = transactionData;

        if (type === 'outgoing') {
            return await walletService.spendCredits(userId, {
                amount,
                bookingId: bookingId || 'legacy-transaction',
                description,
            });
        } else if (type === 'incoming') {
            return await walletService.earnCredits(userId, {
                amount,
                bookingId,
                description,
            });
        } else {
            throw new Error('Invalid transaction type. Use "incoming" or "outgoing"');
        }
    },

    // =======================================================================
    // Payment Methods - NOT SUPPORTED BY BACKEND
    // The wallet-service uses a credit-based system, not external payment methods
    // These methods return empty arrays for backward compatibility with UI
    // =======================================================================

    /**
     * Get payment methods - NOT SUPPORTED
     * Backend uses credit-based wallet system
     * @deprecated Backend does not support external payment methods
     * @returns {Promise<Array>} Empty array
     */
    getPaymentMethods: async (userId) => {
        console.warn('Payment methods are not supported by backend wallet-service');
        return [];
    },

    /**
     * Add payment method - NOT SUPPORTED
     * @deprecated Backend does not support external payment methods
     * @throws {Error} Always throws unsupported operation error
     */
    addPaymentMethod: async (userId, methodData) => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    /**
     * Update payment method - NOT SUPPORTED
     * @deprecated Backend does not support external payment methods
     * @throws {Error} Always throws unsupported operation error
     */
    updatePaymentMethod: async (methodId, updates) => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    /**
     * Delete payment method - NOT SUPPORTED
     * @deprecated Backend does not support external payment methods
     * @throws {Error} Always throws unsupported operation error
     */
    deletePaymentMethod: async (methodId) => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    /**
     * Set default payment method - NOT SUPPORTED
     * @deprecated Backend does not support external payment methods
     * @throws {Error} Always throws unsupported operation error
     */
    setDefaultPaymentMethod: async (userId, methodId) => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },
};
