import request from './apiClient';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/api/notifications`;

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
