import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_SKILL_SERVICE_URL || 'http://localhost:4006';
const LESSONS_ENDPOINT = `${API_BASE_URL}/lessons`;

export const LessonApi = {
    /**
     * Create a new lesson
     * @param {Object} lessonData - {skillId, description, duration, meetingLink?, schedule?}
     */
    createLesson: async (lessonData) => {
        return request(LESSONS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(lessonData),
        });
    },

    /**
     * Get all lessons for a specific skill
     * @param {string} skillId - UUID of the skill
     */
    getLessonsBySkill: async (skillId) => {
        return request(`${LESSONS_ENDPOINT}/skill/${skillId}`);
    },

    /**
     * Get a specific lesson by ID
     * @param {string} lessonId - UUID of the lesson
     */
    getLessonById: async (lessonId) => {
        return request(`${LESSONS_ENDPOINT}/${lessonId}`);
    },

    /**
     * Update a lesson
     * @param {string} lessonId - UUID of the lesson
     * @param {Object} updateData - Fields to update
     */
    updateLesson: async (lessonId, updateData) => {
        return request(`${LESSONS_ENDPOINT}/${lessonId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    },

    /**
     * Delete a lesson
     * @param {string} lessonId - UUID of the lesson
     */
    deleteLesson: async (lessonId) => {
        return request(`${LESSONS_ENDPOINT}/${lessonId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get lesson status
     * @param {string} lessonId - UUID of the lesson
     */
    getLessonStatus: async (lessonId) => {
        return request(`${LESSONS_ENDPOINT}/${lessonId}/status`);
    },
};

export default LessonApi;
