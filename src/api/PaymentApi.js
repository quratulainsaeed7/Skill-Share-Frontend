import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:4004';
const PAYMENTS_ENDPOINT = `${API_BASE_URL}/payments`;

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
};

export default PaymentApi;
