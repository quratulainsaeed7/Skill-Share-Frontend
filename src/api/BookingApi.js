// src/api/BookingApi.js
/**
 * BookingApi - API client for booking-related backend endpoints.
 * 
 * Assumes a booking-service backend with the following endpoints:
 * - Bookings: CRUD operations and status updates (accept, reject, complete, cancel)
 * - Payments: Payment processing and refunds
 * - Reviews: Create and retrieve reviews for completed bookings
 * - Messages: Messaging between learners and mentors
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:4003';
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;
const PAYMENTS_ENDPOINT = `${API_BASE_URL}/payments`;
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;
const MESSAGES_ENDPOINT = `${API_BASE_URL}/messages`;

/**
 * Generic request helper with error handling.
 */
const request = async (url, options = {}) => {
    const method = options.method || 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
    const data = options.body ? JSON.parse(options.body) : undefined;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
            params: options.params,
            validateStatus: () => true,
        });

        const resData = response.data ?? null;

        if (response.status < 200 || response.status >= 300) {
            const errorMessage = resData?.message || resData?.error || `HTTP ${response.status}: ${response.statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData;
    } catch (error) {
        // If it's already an Error we threw above, re-throw it
        if (error.message && !error.response) {
            throw error;
        }

        // Handle axios network/response errors
        if (error.response) {
            const { status, statusText, data: errData } = error.response;
            const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        // Network error - no response received
        throw new Error('Unable to connect to booking service. Please check your connection.');
    }
};

export const BookingApi = {
    // ==================== BOOKING ENDPOINTS ====================

    /**
     * Create a new booking.
     * @param {Object} bookingData - Booking data (learnerId, mentorId, lessonId, bookingDate, etc.)
     * @returns {Promise<Object>} Created booking object
     */
    createBooking: async (bookingData) => {
        return request(BOOKINGS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    /**
     * Get all bookings.
     * @returns {Promise<Array>} Array of booking objects
     */
    getAllBookings: async () => {
        return request(BOOKINGS_ENDPOINT);
    },

    /**
     * Get a single booking by ID.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Booking object with payment and review relations
     */
    getBookingById: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    },

    /**
     * Get all bookings for a learner.
     * @param {string} learnerId - Learner's user ID
     * @returns {Promise<Array>} Array of booking objects
     */
    getBookingsByLearner: async (learnerId) => {
        return request(`${BOOKINGS_ENDPOINT}/learner/${learnerId}`);
    },

    /**
     * Get all bookings for a mentor.
     * @param {string} mentorId - Mentor's user ID
     * @returns {Promise<Array>} Array of booking objects
     */
    getBookingsByMentor: async (mentorId) => {
        return request(`${BOOKINGS_ENDPOINT}/mentor/${mentorId}`);
    },

    /**
     * Update a booking.
     * @param {string} bookingId - Booking ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<Object>} Updated booking object
     */
    updateBooking: async (bookingId, updateData) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    /**
     * Cancel a booking.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Cancelled booking object
     */
    cancelBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Accept a pending booking (mentor action).
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Accepted booking object
     */
    acceptBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/accept`, {
            method: 'PUT',
        });
    },

    /**
     * Reject a pending booking (mentor action).
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Rejected booking object
     */
    rejectBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/reject`, {
            method: 'PUT',
        });
    },

    /**
     * Mark a booking as completed.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Completed booking object
     */
    completeBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/complete`, {
            method: 'PUT',
        });
    },

    // ==================== PAYMENT ENDPOINTS ====================

    /**
     * Create a new payment for a booking.
     * @param {Object} paymentData - Payment data (bookingId, amount, gateway)
     * @returns {Promise<Object>} Created payment object
     */
    createPayment: async (paymentData) => {
        return request(PAYMENTS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    },

    /**
     * Get all payments.
     * @returns {Promise<Array>} Array of payment objects
     */
    getAllPayments: async () => {
        return request(PAYMENTS_ENDPOINT);
    },

    /**
     * Get a single payment by ID.
     * @param {string} paymentId - Payment ID
     * @returns {Promise<Object>} Payment object with booking relation
     */
    getPaymentById: async (paymentId) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}`);
    },

    /**
     * Get payment for a specific booking.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Payment object
     */
    getPaymentByBooking: async (bookingId) => {
        return request(`${PAYMENTS_ENDPOINT}/booking/${bookingId}`);
    },

    /**
     * Update a payment (e.g., update status, transactionId).
     * @param {string} paymentId - Payment ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<Object>} Updated payment object
     */
    updatePayment: async (paymentId, updateData) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    /**
     * Refund a completed payment.
     * @param {string} paymentId - Payment ID
     * @returns {Promise<Object>} Refunded payment object
     */
    refundPayment: async (paymentId) => {
        return request(`${PAYMENTS_ENDPOINT}/${paymentId}/refund`, {
            method: 'PUT',
        });
    },

    // ==================== REVIEW ENDPOINTS ====================

    /**
     * Create a review for a completed booking.
     * @param {Object} reviewData - Review data (bookingId, learnerId, mentorId, rating, comment)
     * @returns {Promise<Object>} Created review object
     */
    createReview: async (reviewData) => {
        return request(REVIEWS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    /**
     * Get all reviews.
     * @returns {Promise<Array>} Array of review objects
     */
    getAllReviews: async () => {
        return request(REVIEWS_ENDPOINT);
    },

    /**
     * Get a single review by ID.
     * @param {string} reviewId - Review ID
     * @returns {Promise<Object>} Review object with booking relation
     */
    getReviewById: async (reviewId) => {
        return request(`${REVIEWS_ENDPOINT}/${reviewId}`);
    },

    /**
     * Get review for a specific booking.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Review object
     */
    getReviewByBooking: async (bookingId) => {
        return request(`${REVIEWS_ENDPOINT}/booking/${bookingId}`);
    },

    /**
     * Get all reviews for a mentor.
     * @param {string} mentorId - Mentor's user ID
     * @returns {Promise<Array>} Array of review objects
     */
    getReviewsByMentor: async (mentorId) => {
        return request(`${REVIEWS_ENDPOINT}/mentor/${mentorId}`);
    },

    /**
     * Get all reviews by a learner.
     * @param {string} learnerId - Learner's user ID
     * @returns {Promise<Array>} Array of review objects
     */
    getReviewsByLearner: async (learnerId) => {
        return request(`${REVIEWS_ENDPOINT}/learner/${learnerId}`);
    },

    // ==================== MESSAGE ENDPOINTS ====================

    /**
     * Send a message between learner and mentor.
     * @param {Object} messageData - Message data (senderId, receiverId, bookingId, message)
     * @returns {Promise<Object>} Created message object
     */
    sendMessage: async (messageData) => {
        return request(MESSAGES_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    /**
     * Get all messages for a specific booking.
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Array>} Array of message objects sorted by sentAt
     */
    getMessagesByBooking: async (bookingId) => {
        return request(`${MESSAGES_ENDPOINT}/booking/${bookingId}`);
    },

    /**
     * Get all messages for a user (sent or received).
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of message objects
     */
    getMessagesByUser: async (userId) => {
        return request(`${MESSAGES_ENDPOINT}/user/${userId}`);
    },

    /**
     * Get conversation between two users.
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID
     * @returns {Promise<Array>} Array of message objects sorted by sentAt
     */
    getConversation: async (userId1, userId2) => {
        return request(`${MESSAGES_ENDPOINT}/conversation/${userId1}/${userId2}`);
    },

    /**
     * Mark a message as read.
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>} Updated message object
     */
    markMessageAsRead: async (messageId) => {
        return request(`${MESSAGES_ENDPOINT}/${messageId}/read`, {
            method: 'PUT',
        });
    },
};

export default BookingApi;
