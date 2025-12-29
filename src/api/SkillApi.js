// src/api/SkillApi.js
/**
 * SkillApi - API client for skill/course-related backend endpoints via API Gateway.
 * 
 * All requests go through API Gateway at /api/skills
 */
import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const SKILLS_ENDPOINT = `${API_BASE_URL}/api/skills`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/api/categories`;

/**
 * Build query params object from filters.
 * Backend is expected to handle these query parameters for filtering/sorting.
 */
const buildQueryParams = (filters = {}) => {
    const params = {};

    if (filters.search) {
        params.search = filters.search;
    }

    if (filters.categories && filters.categories.length > 0) {
        // Send as comma-separated string or array depending on backend expectation
        params.categories = filters.categories.join(',');
    }

    if (filters.mode && filters.mode !== 'all') {
        params.mode = filters.mode;
    }

    if (filters.city) {
        params.city = filters.city;
    }

    if (filters.priceTypes && filters.priceTypes.length > 0) {
        params.priceTypes = filters.priceTypes.join(',');
    }

    if (filters.priceRange && filters.priceRange.length === 2) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
    }

    if (filters.minRating) {
        params.minRating = filters.minRating;
    }

    if (filters.sortBy) {
        params.sortBy = filters.sortBy;
    }

    return params;
};

export const SkillApi = {
    /**
     * Get all categories with their subcategories.
     * @returns {Promise<Array>} Array of category objects
     */
    getCategories: async () => {
        return request(CATEGORIES_ENDPOINT);
    },

    /**
     * Get all skills (no filters).
     * @returns {Promise<Array>} Array of skill objects
     */
    getAllSkills: async () => {
        return request(SKILLS_ENDPOINT);
    },

    /**
     * Get skills with filters applied.
     * Filtering/sorting is handled by the backend.
     * @param {Object} filters - Filter options
     * @returns {Promise<Array>} Filtered array of skill objects
     */
    getSkills: async (filters = {}) => {
        const params = buildQueryParams(filters);
        return request(SKILLS_ENDPOINT, { params });
    },

    /**
     * Get a single skill by ID.
     * @param {string} id - Skill ID
     * @returns {Promise<Object>} Skill object
     */
    getSkillById: async (id) => {
        return request(`${SKILLS_ENDPOINT}/${id}`);
    },

    /**
     * Get courses enrolled by a learner.
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of enrolled courses
     */
    getEnrolledCourses: async (userId) => {
        return request(`${SKILLS_ENDPOINT}/enrolled/${userId}`);
    },

    /**
     * Get courses taught by a mentor.
     * @param {string} userId - Mentor's user ID
     * @returns {Promise<Array>} Array of taught courses
     */
    getTaughtCourses: async (userId) => {
        return request(`${SKILLS_ENDPOINT}/taught/${userId}`);
    },

    /**
     * Get students enrolled in a mentor's courses.
     * @param {string} userId - Mentor's user ID
     * @returns {Promise<Array>} Array of enrolled students
     */
    getEnrolledStudents: async (userId) => {
        return request(`${SKILLS_ENDPOINT}/mentor/${userId}/students`);
    },

    /**
     * Enroll a learner in a skill/course.
     * @param {string} skillId - Skill ID
     * @param {string} userId - Learner's user ID
     * @param {string} mentorId - Mentor's user ID
     * @param {Object} paymentData - Payment information (paymentMethod, etc.)
     * @returns {Promise<Object>} Enrollment result
     */
    enrollInSkill: async (skillId, userId, mentorId, paymentData = {}) => {
        return request(`${SKILLS_ENDPOINT}/${skillId}/enroll`, {
            method: 'POST',
            body: JSON.stringify({ userId, mentorId, paymentMethod: paymentData.paymentMethod }),
        });
    },

    /**
     * Unenroll a learner from a skill/course.
     * @param {string} skillId - Skill ID
     * @param {string} userId - Learner's user ID
     * @returns {Promise<Object>} Unenrollment result with refund info
     */
    unenrollFromSkill: async (skillId, userId, mentorId) => {
        return request(`${SKILLS_ENDPOINT}/${skillId}/unenroll`, {
            method: 'POST',
            body: JSON.stringify({ userId, mentorId }),
        });
    },

    /**
     * Create a new skill/course.
     * @param {Object} skillData - Skill data including mentorId, name, description, etc.
     * @returns {Promise<Object>} Created skill object
     */
    createSkill: async (skillData) => {
        return request(SKILLS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(skillData),
        });
    },

    getMentorId: async (userId) => {
        return request(`${SKILLS_ENDPOINT}/mentor/${userId}/id`);
    },

    /**
     * Get progress for a specific skill enrollment.
     * @param {string} skillId - Skill ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Progress object with completedLessons, totalLessons, and progress percentage
     */
    getProgress: async (skillId, userId) => {
        return request(`${SKILLS_ENDPOINT}/${skillId}/progress/${userId}`);
    },
};

export default SkillApi;
