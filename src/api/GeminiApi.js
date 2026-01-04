// src/api/GeminiApi.js
/**
 * GeminiApi - API client for AI/Gemini service endpoints.
 * 
 * Provides AI-powered features:
 * - Generate study roadmaps for skills and lessons
 * - Generate quizzes from content
 * - Academic chatbot assistance
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000';
const AI_ENDPOINT = `${API_BASE_URL}/api/ai`;

/**
 * Get auth token from sessionStorage
 */
const getAuthToken = () => {
    const token = sessionStorage.getItem('skillshare_token');
    return token;
};

/**
 * Generic request helper with error handling and auth.
 */
const request = async (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    try {
        const response = await axios({
            url,
            method: options.method || 'GET',
            headers,
            data: options.body,
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error(`API Error [${options.method || 'GET'} ${url}]:`, error);
        throw error.response?.data || error.message || 'An error occurred';
    }
};

/**
 * Generate a 4-week study roadmap for a skill
 * @param {string} skillId - The skill ID
 * @returns {Promise} Roadmap data (array of weeks with daily tasks)
 */
export const generateSkillRoadmap = async (skillId) => {
    return request(`${AI_ENDPOINT}/generate-roadmap/${skillId}`, {
        method: 'POST',
    });
};

/**
 * Generate a focused roadmap for a single lesson
 * @param {string} lessonId - The lesson ID
 * @returns {Promise} Roadmap data
 */
export const generateLessonRoadmap = async (lessonId) => {
    return request(`${AI_ENDPOINT}/generate-lesson-roadmap/${lessonId}`, {
        method: 'POST',
    });
};

/**
 * Generate a quiz for a specific lesson
 * @param {string} lessonId - The lesson ID
 * @returns {Promise} Quiz data (array of questions with options)
 */
export const generateLessonQuiz = async (lessonId) => {
    return request(`${AI_ENDPOINT}/generate-quiz/${lessonId}`, {
        method: 'POST',
    });
};

/**
 * Generate a comprehensive quiz for an entire skill
 * @param {string} skillId - The skill ID
 * @returns {Promise} Quiz data (array of questions)
 */
export const generateSkillQuiz = async (skillId) => {
    return request(`${AI_ENDPOINT}/generate-skill-quiz/${skillId}`, {
        method: 'POST',
    });
};

/**
 * Chat with AI assistant about a specific skill or lesson
 * @param {Object} chatData
 * @param {string} chatData.question - User's question
 * @param {string} chatData.contextId - Skill or Lesson ID
 * @param {'skill'|'lesson'} chatData.type - Context type
 * @param {Array} [chatData.history] - Previous conversation history
 * @returns {Promise} AI response
 */
export const chatWithContext = async (chatData) => {
    return request(`${AI_ENDPOINT}/chat`, {
        method: 'POST',
        body: chatData,
    });
};

/**
 * General academic chat without specific context
 * @param {Object} chatData
 * @param {string} chatData.question - User's question
 * @param {Array} [chatData.history] - Previous conversation history
 * @returns {Promise} AI response
 */
export const generalChat = async (chatData) => {
    return request(`${AI_ENDPOINT}/general-chat`, {
        method: 'POST',
        body: chatData,
    });
};

/**
 * Upload files and generate content (for future use if needed)
 * @param {string} lessonId - The lesson ID
 * @param {Array} files - Array of file objects with fileData and fileType
 * @returns {Promise} Response data
 */
export const uploadFilesForLesson = async (lessonId, files) => {
    // This would be handled in the lesson service, just a placeholder
    // Files should be base64 encoded with MIME type
    return { message: 'Files should be attached to lesson entity' };
};

const GeminiApi = {
    generateSkillRoadmap,
    generateLessonRoadmap,
    generateLessonQuiz,
    generateSkillQuiz,
    chatWithContext,
    generalChat,
    uploadFilesForLesson,
};

export default GeminiApi;
