import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../../../services/notificationService.ts';
import styles from './NotificationDropdown.module.css';

const NotificationDropdown = ({ userId, isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchNotifications();
        }
    }, [isOpen, userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await notificationService.getUserNotifications(userId);
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError(err.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            // Update local state
            setNotifications(prev =>
                prev.map(n =>
                    n.notificationId === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(userId);
            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <div className={styles.header}>
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                    <button
                        className={styles.markAllBtn}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <span>⚠️</span>
                        <p>{error}</p>
                        <button onClick={fetchNotifications}>Retry</button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>🔔</span>
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {notifications.map((notification) => {
                            const formatted = notificationService.getFormattedMessage(notification);
                            return (
                                <div
                                    key={notification.notificationId}
                                    className={`${styles.item} ${notification.isRead ? styles.read : styles.unread}`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.notificationId)}
                                >
                                    <div className={styles.icon}>
                                        {formatted.icon}
                                    </div>
                                    <div className={styles.details}>
                                        <div className={styles.title}>{formatted.title}</div>
                                        <div className={styles.message}>{formatted.message}</div>
                                        <div className={styles.timestamp}>
                                            {formatTimestamp(notification.createdAt)}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className={styles.unreadDot}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
