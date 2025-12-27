import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_REVIEW_SERVICE_URL || 'http://localhost:4006';
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;

export const ReviewApi = {
    createReview: async (reviewData) => {
        return request(REVIEWS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    getAllReviews: async () => {
        return request(REVIEWS_ENDPOINT);
    },

    getReviewById: async (reviewId) => {
        return request(`${REVIEWS_ENDPOINT}/${reviewId}`);
    },

    getReviewByBooking: async (bookingId) => {
        return request(`${REVIEWS_ENDPOINT}/booking/${bookingId}`);
    },

    getReviewsByMentor: async (mentorId) => {
        return request(`${REVIEWS_ENDPOINT}/mentor/${mentorId}`);
    },

    getAverageRatingForMentor: async (mentorId) => {
        return request(`${REVIEWS_ENDPOINT}/mentor/${mentorId}/rating`);
    },

    getReviewsByLearner: async (learnerId) => {
        return request(`${REVIEWS_ENDPOINT}/learner/${learnerId}`);
    },
};

export default ReviewApi;
