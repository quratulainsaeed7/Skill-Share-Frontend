import request from './apiClient';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000';
const BOOKINGS_ENDPOINT = `${API_BASE_URL}/api/booking`;

export const BookingApi = {
    /**
     * Create a new booking
     * Note: Payment is handled during skill enrollment, not during booking
     * skillId is derived from lessonId (normalized approach)
     * @param {Object} bookingData - {learnerId, mentorId, lessonId, bookingDate, startTime, endTime}
     */
    createBooking: async (bookingData) => {
        return request(BOOKINGS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    /**
     * Create bulk bookings for all enrolled students in a skill
     * Mentor schedules a lesson, system creates bookings for all enrolled students
     * @param {Object} bulkBookingData - {mentorId, lessonId, bookingDate, startTime, endTime}
     */
    scheduleBulkMeeting: async (bulkBookingData) => {
        return request(`${BOOKINGS_ENDPOINT}/bulk`, {
            method: 'POST',
            body: JSON.stringify(bulkBookingData),
        });
    },

    /**
     * Get all bookings (admin only)
     */
    getAllBookings: async () => {
        return request(BOOKINGS_ENDPOINT);
    },

    /**
     * Get a specific booking by ID
     * @param {string} bookingId - UUID of the booking
     */
    getBookingById: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    },

    /**
     * Get all bookings for a learner
     * @param {string} learnerId - UUID of the learner
     */
    getBookingsByLearner: async (learnerId) => {
        return request(`${BOOKINGS_ENDPOINT}?learnerId=${learnerId}`);
    },

    /**
     * Get all bookings for a mentor
     * @param {string} mentorId - UUID of the mentor
     */
    getBookingsByMentor: async (mentorId) => {
        return request(`${BOOKINGS_ENDPOINT}?mentorId=${mentorId}`);
    },

    /**
     * Update a booking
     * @param {string} bookingId - UUID of the booking
     * @param {Object} updateData - Fields to update
     */
    updateBooking: async (bookingId, updateData) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    /**
     * Cancel a booking
     * @param {string} bookingId - UUID of the booking
     */
    cancelBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Accept a booking (mentor action)
     * State Transition: PENDING → ACCEPTED
     * @param {string} bookingId - UUID of the booking
     */
    acceptBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/accept`, {
            method: 'POST',
        });
    },

    /**
     * Reject a booking (mentor action)
     * State Transition: PENDING → REJECTED
     * @param {string} bookingId - UUID of the booking
     */
    rejectBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/reject`, {
            method: 'POST',
        });
    },

    /**
     * Complete a booking (mentor action after session)
     * State Transition: ACCEPTED → COMPLETED
     * @param {string} bookingId - UUID of the booking
     */
    completeBooking: async (bookingId) => {
        return request(`${BOOKINGS_ENDPOINT}/${bookingId}/complete`, {
            method: 'POST',
        });
    },
};

export default BookingApi;
