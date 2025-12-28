import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:4002';
const PAYMENTS_ENDPOINT = `${API_BASE_URL}/payments`;
const PAYMENT_METHODS_ENDPOINT = `${PAYMENTS_ENDPOINT}/methods`;

export const PaymentApi = {
    createPayment: async (paymentData) => {
        return request(PAYMENTS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    },

    initializePayment: async (bookingId) => {
        return request(`${PAYMENTS_ENDPOINT}/initialize/${bookingId}`, {
            method: 'POST',
        });
    },

    paymentCallback: async (transactionId, status) => {
        return request(`${PAYMENTS_ENDPOINT}/callback`, {
            method: 'POST',
            body: JSON.stringify({ transactionId, status }),
        });
    },

    getAllPayments: async () => {
        return request(PAYMENTS_ENDPOINT);
    },

    getPaymentById: async (paymentId) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}`);
    },

    getPaymentByBooking: async (bookingId) => {
        return request(`${PAYMENTS_ENDPOINT}/booking/${bookingId}`);
    },

    updatePayment: async (paymentId, updateData) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    refundPayment: async (paymentId) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}/refund`, {
            method: 'PUT',
        });
    },

    // ===================== Payment Method Endpoints =====================

    /**
     * Get all payment methods for a user
     */
    getPaymentMethods: async (userId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/user/${userId}`);
    },

    /**
     * Get a specific payment method by ID
     */
    getPaymentMethodById: async (methodId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/${methodId}`);
    },

    /**
     * Add a new payment method
     */
    addPaymentMethod: async (methodData) => {
        return request(PAYMENT_METHODS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(methodData),
        });
    },

    /**
     * Create payment method from Stripe payment method ID
     */
    createPaymentMethodFromStripe: async (userId, stripePaymentMethodId, isDefault = false) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/stripe`, {
            method: 'POST',
            body: JSON.stringify({
                userId,
                stripePaymentMethodId,
                isDefault,
            }),
        });
    },

    /**
     * Update a payment method
     */
    updatePaymentMethod: async (methodId, updateData) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/${methodId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    /**
     * Delete a payment method
     */
    deletePaymentMethod: async (methodId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/${methodId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Set a payment method as default
     */
    setDefaultPaymentMethod: async (userId, methodId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/set-default`, {
            method: 'PUT',
            body: JSON.stringify({ userId }),
        });
    },

    /**
     * Get default payment method for a user
     */
    getDefaultPaymentMethod: async (userId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/user/${userId}/default`);
    },

    /**
     * Verify a payment method is valid
     */
    verifyPaymentMethod: async (methodId) => {
        return request(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/verify`);
    },

    // ===================== Payment Transaction Endpoints =====================

    /**
     * Get all payment transactions for a user
     */
    getPaymentTransactionsByUser: async (userId) => {
        return request(`${PAYMENTS_ENDPOINT}/transactions/user/${userId}`);
    },

    /**
     * Get all transactions for a specific booking
     */
    getPaymentTransactionsByBooking: async (bookingId) => {
        return request(`${PAYMENTS_ENDPOINT}/transactions/booking/${bookingId}`);
    },
};

export default PaymentApi;
