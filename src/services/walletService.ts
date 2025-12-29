import { WalletApi } from '../api/WalletApi';
import { PaymentApi } from '../api/PaymentApi';

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

interface PaymentMethodData {
    type: 'card' | 'wallet' | 'bank_account' | 'upi';
    stripePaymentMethodId?: string;
    cardLast4?: string;
    cardBrand?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    accountIdentifier?: string;
    accountName?: string;
    isDefault?: boolean;
    metadata?: Record<string, any>;
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
        try {
            const methods = await PaymentApi.getPaymentMethods(userId);
            return methods || [];
        } catch (error: any) {
            console.error('Error fetching payment methods:', error);
            // Return empty array instead of throwing error for better UX
            if (error.response?.status === 404) {
                return [];
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
        }
    },

    addPaymentMethod: async (userId: string, methodData: PaymentMethodData): Promise<any> => {
        try {
            // If stripePaymentMethodId is provided, use the Stripe endpoint
            if (methodData.stripePaymentMethodId) {
                return await PaymentApi.createPaymentMethodFromStripe(
                    userId,
                    methodData.stripePaymentMethodId,
                    methodData.isDefault || false
                );
            }

            // Otherwise, validate required fields for manual entry
            if (!methodData.type) {
                throw new Error('Payment method type is required');
            }

            // Prepare the data to send to the API
            const payload = {
                userId,
                ...methodData,
            };

            const newMethod = await PaymentApi.addPaymentMethod(payload);
            return newMethod;
        } catch (error: any) {
            console.error('Error adding payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to add payment method');
        }
    },

    updatePaymentMethod: async (methodId: string, updates: Partial<PaymentMethodData>): Promise<any> => {
        try {
            if (!methodId) {
                throw new Error('Payment method ID is required');
            }

            const updatedMethod = await PaymentApi.updatePaymentMethod(methodId, updates);
            return updatedMethod;
        } catch (error: any) {
            console.error('Error updating payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to update payment method');
        }
    },

    deletePaymentMethod: async (methodId: string): Promise<{ message: string }> => {
        try {
            if (!methodId) {
                throw new Error('Payment method ID is required');
            }

            const result = await PaymentApi.deletePaymentMethod(methodId);
            return result;
        } catch (error: any) {
            console.error('Error deleting payment method:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete payment method');
        }
    },

    setDefaultPaymentMethod: async (userId: string, methodId: string): Promise<any> => {
        try {
            if (!userId || !methodId) {
                throw new Error('User ID and Payment method ID are required');
            }

            console.log('Setting default payment method:', { userId, methodId });
            const updatedMethod = await PaymentApi.setDefaultPaymentMethod(userId, methodId);
            return updatedMethod;
        } catch (error: any) {
            console.error('Error setting default payment method:', error);
            console.error('Error details:', error.response?.data);
            throw new Error(error.response?.data?.message || error.message || 'Failed to set default payment method');
        }
    },

    getDefaultPaymentMethod: async (userId: string): Promise<any | null> => {
        try {
            const defaultMethod = await PaymentApi.getDefaultPaymentMethod(userId);
            return defaultMethod;
        } catch (error: any) {
            console.error('Error fetching default payment method:', error);
            // Return null if no default method found
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch default payment method');
        }
    },

    verifyPaymentMethod: async (methodId: string): Promise<{ valid: boolean; reason?: string }> => {
        try {
            if (!methodId) {
                throw new Error('Payment method ID is required');
            }

            const result = await PaymentApi.verifyPaymentMethod(methodId);
            return result;
        } catch (error: any) {
            console.error('Error verifying payment method:', error);
            return {
                valid: false,
                reason: error.response?.data?.message || 'Failed to verify payment method',
            };
        }
    },

    createPaymentMethodFromStripe: async (
        userId: string,
        stripePaymentMethodId: string,
        isDefault: boolean = false
    ): Promise<any> => {
        try {
            if (!userId || !stripePaymentMethodId) {
                throw new Error('User ID and Stripe Payment Method ID are required');
            }

            const newMethod = await PaymentApi.createPaymentMethodFromStripe(
                userId,
                stripePaymentMethodId,
                isDefault
            );
            return newMethod;
        } catch (error: any) {
            console.error('Error creating payment method from Stripe:', error);
            throw new Error(error.response?.data?.message || 'Failed to create payment method from Stripe');
        }
    },

    getPaymentTransactions: async (userId: string): Promise<any[]> => {
        try {
            const transactions = await PaymentApi.getPaymentTransactionsByUser(userId);
            return transactions || [];
        } catch (error: any) {
            console.error('Error fetching payment transactions:', error);
            // Return empty array instead of throwing error
            if (error.response?.status === 404) {
                return [];
            }
            return [];
        }
    },
};

export default walletService;
