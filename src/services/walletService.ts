import { WalletApi } from '../api/WalletApi';

interface EarnCreditsData {
    amount: number;
    bookingId?: string;
    description?: string;
}

interface SpendCreditsData {
    amount: number;
    bookingId: string;
    description?: string;
}

interface TransactionData {
    userId: string;
    type: 'incoming' | 'outgoing';
    amount: number;
    description?: string;
    bookingId?: string;
}

interface TransactionStats {
    totalIncoming: number;
    totalOutgoing: number;
    balance: number;
    transactionCount: number;
}

export const walletService = {

    staticInteger: 0,

    getBalance: async (userId: string): Promise<number> => {
        try {
            const data = await WalletApi.getBalance(userId);
            return data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Failed to fetch wallet balance');
        }
    },

    getWallet: async (userId: string): Promise<any> => {
        try {
            return await WalletApi.getWallet(userId);
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw new Error('Failed to fetch wallet details');
        }
    },

    getTransactions: async (userId: string, filters: any = {}): Promise<any[]> => {
        try {
            return await WalletApi.getTransactions(userId);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw new Error('Failed to fetch transactions');
        }
    },

    getTransactionStats: async (userId: string): Promise<TransactionStats> => {
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

    earnCredits: async (userId: string, data: EarnCreditsData): Promise<any> => {
        try {
            return await WalletApi.earnCredits(userId, data);
        } catch (error) {
            console.error('Error earning credits:', error);
            throw new Error('Failed to earn credits');
        }
    },

    spendCredits: async (userId: string, data: SpendCreditsData): Promise<any> => {
        try {
            return await WalletApi.spendCredits(userId, data);
        } catch (error: any) {
            console.error('Error spending credits:', error);
            throw new Error(error.response?.data?.message || 'Failed to spend credits');
        }
    },

    createTransaction: async (transactionData: TransactionData): Promise<any> => {
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

    getPaymentMethods: async (userId: string): Promise<any[]> => {
        console.warn('Payment methods are not supported by backend wallet-service');
        return [];
    },

    addPaymentMethod: async (userId: string, methodData: any): Promise<never> => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    updatePaymentMethod: async (methodId: string, updates: any): Promise<never> => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    deletePaymentMethod: async (methodId: string): Promise<never> => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },

    setDefaultPaymentMethod: async (userId: string, methodId: string): Promise<never> => {
        throw new Error('Payment methods are not supported. Backend uses credit-based wallet system.');
    },
};

export default walletService;
