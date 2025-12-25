// src/services/skillService.js
/**
 * skillService - Service layer for skill/course operations.
 * 
 * REFACTORED: Removed all mock data dependencies.
 * Now uses SkillApi for real backend API calls.
 * Filtering and sorting are delegated to the backend.
 */
import SkillApi from '../api/SkillApi';

export const skillService = {
    /**
     * Get all categories with subcategories.
     * @returns {Promise<Array>} Array of category objects
     */
    getCategories: async () => {
        try {
            return await SkillApi.getCategories();
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    },

    /**
     * Get all skills without filters.
     * @returns {Promise<Array>} Array of all skill objects
     */
    getAllSkills: async () => {
        try {
            return await SkillApi.getAllSkills();
        } catch (error) {
            console.error('Failed to fetch all skills:', error);
            throw error;
        }
    },

    /**
     * Get skills with filters applied.
     * All filtering/sorting is handled by the backend.
     * 
     * @param {Object} filters - Filter options:
     *   - search: string - Search query for title, description, mentor, tags
     *   - categories: string[] - Array of category/subcategory names
     *   - mode: 'online' | 'in-person' | 'all' - Teaching mode filter
     *   - city: string - City filter (for in-person mode)
     *   - priceTypes: string[] - ['cash', 'credits', 'both']
     *   - priceRange: [number, number] - [min, max] cash price range
     *   - minRating: number - Minimum rating filter
     *   - sortBy: string - 'highest_rated' | 'lowest_price' | 'highest_price' | 'most_reviews'
     * 
     * @returns {Promise<Array>} Filtered array of skill objects
     */
    getSkills: async (filters = {}) => {
        try {
            return await SkillApi.getSkills(filters);
        } catch (error) {
            console.error('Failed to fetch skills with filters:', error);
            throw error;
        }
    },

    /**
     * Get a single skill by its ID.
     * @param {string} id - Skill ID
     * @returns {Promise<Object|null>} Skill object or null if not found
     */
    getSkillById: async (id) => {
        try {
            return await SkillApi.getSkillById(id);
        } catch (error) {
            console.error(`Failed to fetch skill ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get courses enrolled by a learner.
     * @param {string} userId - Learner's user ID
     * @returns {Promise<Array>} Array of enrolled course objects
     */
    getEnrolledCourses: async (userId) => {
        if (!userId) return [];
        try {
            return await SkillApi.getEnrolledCourses(userId);
        } catch (error) {
            console.error(`Failed to fetch enrolled courses for user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Get courses taught by a mentor.
     * @param {string} userId - Mentor's user ID
     * @returns {Promise<Array>} Array of taught course objects
     */
    getTaughtCourses: async (userId) => {
        if (!userId) return [];
        try {
            return await SkillApi.getTaughtCourses(userId);
        } catch (error) {
            console.error(`Failed to fetch taught courses for user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Get students enrolled in mentor's courses.
     * @param {string} userId - Mentor's user ID
     * @returns {Promise<Array>} Array of student objects
     */
    getEnrolledStudents: async (userId) => {
        if (!userId) return [];
        try {
            return await SkillApi.getEnrolledStudents(userId);
        } catch (error) {
            console.error(`Failed to fetch enrolled students for mentor ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Enroll a learner in a skill/course.
     * @param {string} skillId - Skill ID to enroll in
     * @param {string} userId - Learner's user ID
     * @returns {Promise<Object>} Enrollment result
     */
    enrollInSkill: async (skillId, userId) => {
        try {
            return await SkillApi.enrollInSkill(skillId, userId);
        } catch (error) {
            console.error(`Failed to enroll user ${userId} in skill ${skillId}:`, error);
            throw error;
        }
    }
};
