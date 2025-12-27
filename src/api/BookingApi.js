import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:4003';
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;

export const BookingApi = {
    createBookingWithCredits: async (bookingData) => {
        return request(BOOKINGS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ ...bookingData, paymentMethod: 'wallet' }),
        });
    },

    createBookingWithCash: async (bookingData) => {
        return request(BOOKINGS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    createBooking: async (bookingData) => {
        return request(BOOKINGS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    getAllBookings: async () => {
        return request(BOOKINGS_ENDPOINT);
    },

    getBookingById: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    },

    getBookingsByLearner: async (learnerId) => {
        return request(`${BOOKINGS_ENDPOINT}/learner/${learnerId}`);
    },

    getBookingsByMentor: async (mentorId) => {
        return request(`${BOOKINGS_ENDPOINT}/mentor/${mentorId}`);
    },

    updateBooking: async (bookingId, updateData) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    cancelBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'DELETE',
        });
    },

    acceptBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/accept`, {
            method: 'PUT',
        });
    },

    rejectBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/reject`, {
            method: 'PUT',
        });
    },

    completeBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/complete`, {
            method: 'PUT',
        });
    },
};

export default BookingApi;
