// src/services/walletService.js
import { v4 as uuidv4 } from 'uuid';

const PAYMENT_METHODS_KEY = 'skillshare_payment_methods';
const TRANSACTIONS_KEY = 'skillshare_transactions';

// Helper to get payment methods from localStorage
const getPaymentMethods = () => {
    const methods = localStorage.getItem(PAYMENT_METHODS_KEY);
    return methods ? JSON.parse(methods) : [];
};

// Helper to save payment methods
const savePaymentMethods = (methods) => {
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
};

// Helper to get transactions from localStorage
const getTransactions = () => {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
};

// Helper to save transactions
const saveTransactions = (transactions) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const walletService = {
    // Get all payment methods for a user
    getPaymentMethods: async (userId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const methods = getPaymentMethods();
        return methods.filter((m) => m.userId === userId);
    },

    // Add a new payment method
    addPaymentMethod: async (userId, methodData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const methods = getPaymentMethods();
        const newMethod = {
            id: uuidv4(),
            userId,
            ...methodData,
            createdAt: new Date().toISOString(),
        };

        methods.push(newMethod);
        savePaymentMethods(methods);
        return newMethod;
    },

    // Update a payment method
    updatePaymentMethod: async (methodId, updates) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const methods = getPaymentMethods();
        const index = methods.findIndex((m) => m.id === methodId);
        
        if (index === -1) {
            throw new Error('Payment method not found');
        }

        methods[index] = {
            ...methods[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        savePaymentMethods(methods);
        return methods[index];
    },

    // Delete a payment method
    deletePaymentMethod: async (methodId) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const methods = getPaymentMethods();
        const filtered = methods.filter((m) => m.id !== methodId);
        savePaymentMethods(filtered);
        return true;
    },

    // Set a payment method as default
    setDefaultPaymentMethod: async (userId, methodId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const methods = getPaymentMethods();
        const userMethods = methods.map((m) => {
            if (m.userId === userId) {
                return {
                    ...m,
                    isDefault: m.id === methodId,
                };
            }
            return m;
        });

        savePaymentMethods(userMethods);
        return true;
    },

    // Get all transactions for a user
    getTransactions: async (userId, filters = {}) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        let transactions = getTransactions();
        transactions = transactions.filter((t) => 
            t.userId === userId || t.recipientId === userId
        );

        // Apply filters
        if (filters.type) {
            transactions = transactions.filter((t) => t.type === filters.type);
        }

        if (filters.paymentMethodId) {
            transactions = transactions.filter((t) => t.paymentMethodId === filters.paymentMethodId);
        }

        if (filters.startDate) {
            transactions = transactions.filter((t) => 
                new Date(t.createdAt) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            transactions = transactions.filter((t) => 
                new Date(t.createdAt) <= new Date(filters.endDate)
            );
        }

        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return transactions;
    },

    // Create a new transaction (when booking a course)
    createTransaction: async (transactionData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const transactions = getTransactions();
        const newTransaction = {
            id: uuidv4(),
            ...transactionData,
            status: 'completed',
            createdAt: new Date().toISOString(),
        };

        transactions.push(newTransaction);
        saveTransactions(transactions);
        return newTransaction;
    },

    // Get wallet balance (total incoming - total outgoing)
    getBalance: async (userId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const transactions = getTransactions();
        const userTransactions = transactions.filter((t) => 
            (t.userId === userId || t.recipientId === userId) && t.status === 'completed'
        );

        const balance = userTransactions.reduce((acc, transaction) => {
            if (transaction.type === 'incoming' || transaction.recipientId === userId) {
                return acc + transaction.amount;
            } else {
                return acc - transaction.amount;
            }
        }, 0);

        return balance;
    },

    // Get transaction statistics
    getTransactionStats: async (userId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const transactions = getTransactions();
        const userTransactions = transactions.filter((t) => 
            (t.userId === userId || t.recipientId === userId) && t.status === 'completed'
        );

        const totalIncoming = userTransactions
            .filter((t) => t.type === 'incoming' || t.recipientId === userId)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalOutgoing = userTransactions
            .filter((t) => t.type === 'outgoing' && t.userId === userId)
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncoming,
            totalOutgoing,
            balance: totalIncoming - totalOutgoing,
            transactionCount: userTransactions.length,
        };
    },

    // Initialize demo data for testing (can be called from Wallet page)
    initializeDemoData: async (userId, demoData) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        // Add demo payment methods
        const currentMethods = getPaymentMethods();
        const newMethods = [
            ...currentMethods,
            ...demoData.paymentMethods.filter(
                (dm) => !currentMethods.some((cm) => cm.userId === userId && cm.cardNumber === dm.cardNumber)
            ),
        ];
        savePaymentMethods(newMethods);

        // Add demo transactions
        const currentTransactions = getTransactions();
        const newTransactions = [
            ...currentTransactions,
            ...demoData.transactions.filter(
                (dt) => !currentTransactions.some((ct) => ct.userId === userId && ct.description === dt.description)
            ),
        ];
        saveTransactions(newTransactions);

        return true;
    },
};
