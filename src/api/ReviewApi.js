import request from './apiClient';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000';
const REVIEWS_ENDPOINT = `${API_BASE_URL}/api/reviews`;

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
