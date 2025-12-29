import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:4008';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/notifications`;

const request = async (url, options = {}) => {
    const method = options.method || 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
    const data = options.body;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
            validateStatus: () => true,
        });

        const resData = response.data ?? null;

        if (response.status < 200 || response.status >= 300) {
            const errorMessage = resData?.message || resData?.error || `HTTP ${response.status}: ${response.statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData;
    } catch (error) {
        if (!error.response) {
            throw new Error('Network error: Unable to reach the notification server.');
        }

        const { status, statusText, data: errData } = error.response;
        const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
};

export const NotificationApi = {
    /**
     * Get all notifications for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of notifications
     */
    getUserNotifications: async (userId) => {
        return request(`${NOTIFICATIONS_ENDPOINT}/${userId}`);
    },

    /**
     * Mark a notification as read
     * @param {string} notificationId - Notification ID
     * @returns {Promise<Object>} Updated notification
     */
    markAsRead: async (notificationId) => {
        return request(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`, {
            method: 'PATCH',
        });
    },

    /**
     * Mark all notifications as read for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Result
     */
    markAllAsRead: async (userId) => {
        const notifications = await NotificationApi.getUserNotifications(userId);
        const unreadNotifications = notifications.filter(n => !n.isRead);

        await Promise.all(
            unreadNotifications.map(n => NotificationApi.markAsRead(n.notificationId))
        );

        return { markedCount: unreadNotifications.length };
    },

    /**
     * Create a notification (internal use)
     * @param {Object} notificationData - Notification data
     * @returns {Promise<Object>} Created notification
     */
    createNotification: async (notificationData) => {
        return request(NOTIFICATIONS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(notificationData),
        });
    },
};

export default NotificationApi;
