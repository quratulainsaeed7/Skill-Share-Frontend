import NotificationApi from '../api/NotificationApi.js';

export interface Notification {
    notificationId: string;
    userId: string;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

class NotificationService {
    /**
     * Get all notifications for a user
     */
    async getUserNotifications(userId: string): Promise<Notification[]> {
        try {
            return await NotificationApi.getUserNotifications(userId);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            throw error;
        }
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: string): Promise<Notification> {
        try {
            return await NotificationApi.markAsRead(notificationId);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<{ markedCount: number }> {
        try {
            return await NotificationApi.markAllAsRead(userId);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const notifications = await this.getUserNotifications(userId);
            return notifications.filter(n => !n.isRead).length;
        } catch (error) {
            console.error('Failed to get unread count:', error);
            return 0;
        }
    }

    /**
     * Parse JSON message if it's a stringified object
     */
    private parseMessage(message: string): any {
        try {
            // Check if message starts with { or [ (likely JSON)
            if (message.trim().startsWith('{') || message.trim().startsWith('[')) {
                return JSON.parse(message);
            }
            return message;
        } catch {
            return message;
        }
    }

    /**
     * Get formatted notification message based on type
     */
    getFormattedMessage(notification: Notification): { title: string; message: string; icon: string } {
        const type = notification.type.toUpperCase();

        const typeMap: Record<string, { title: string; icon: string }> = {
            'EMAIL_VERIFIED': { title: 'Email Verified', icon: '✅' },
            'BOOKING_CREATED': { title: 'Booking Created', icon: '📅' },
            'BOOKING_SCHEDULED': { title: 'Meeting Scheduled', icon: '🎯' },
            'BOOKING_CONFIRMED': { title: 'Booking Confirmed', icon: '✔️' },
            'BOOKING_CANCELLED': { title: 'Booking Cancelled', icon: '❌' },
            'BOOKING_COMPLETED': { title: 'Session Completed', icon: '🎓' },
            'LESSON_SCHEDULED': { title: 'Lesson Scheduled', icon: '📚' },
            'LESSON_COMPLETED': { title: 'Lesson Completed', icon: '✅' },
            'MESSAGE_RECEIVED': { title: 'New Message', icon: '💬' },
            'SKILL_CREATED': { title: 'New Skill Available', icon: '🆕' },
            'SKILL_COMPLETED': { title: 'Skill Completed', icon: '🎉' },
            'PAYMENT_SUCCESS': { title: 'Payment Successful', icon: '💳' },
            'PAYMENT_FAILED': { title: 'Payment Failed', icon: '⚠️' },
            'REFUND_PROCESSED': { title: 'Refund Processed', icon: '💰' },
            'ENROLLMENT_SUCCESS': { title: 'Enrollment Successful', icon: '🎉' },
        };

        const config = typeMap[type] || { title: 'Notification', icon: '🔔' };

        // Parse the message to handle JSON payloads
        const parsedMessage = this.parseMessage(notification.message);
        let displayMessage = notification.message;

        // Format message based on type and parsed data
        if (type === 'MESSAGE_RECEIVED' && typeof parsedMessage === 'object') {
            displayMessage = 'You have a new message';
        } else if (typeof parsedMessage === 'object') {
            // For other JSON payloads, try to extract meaningful info
            displayMessage = parsedMessage.message || parsedMessage.description || 'View details';
        }

        return {
            ...config,
            message: displayMessage,
        };
    }
}

export default new NotificationService();
