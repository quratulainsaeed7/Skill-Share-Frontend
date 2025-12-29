import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import styles from './Navbar.module.css';
import dropdownStyles from './NavbarDropdown.module.css';
import { MdPerson, MdWallet, MdSettings, MdLogout, MdBook, MdNotifications } from 'react-icons/md';
import UserService from '../../../services/UserService';
import notificationService from '../../../services/notificationService.ts';

const Navbar = () => {
    // Use centralized UserService instead of direct localStorage access
    const user = UserService.getUser();
    const userRole = user?.role || null;
    const userName = user?.name || null;
    const userID = user?.userId || null;

    console.log('Navbar - User Role:', userRole); // Debug log

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    // Fetch unread notification count
    useEffect(() => {
        if (userID) {
            fetchUnreadCount();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [userID]);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount(userID);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const handleLogout = () => {
        UserService.logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get initials for avatar placeholder
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>
                SkillShare.pk
            </Link>

            <div className={styles.navLinks}>
                {userRole === 'ADMIN' ? (
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                        Categories
                    </NavLink>
                ) : (
                    <NavLink
                        to="/skills"
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                        Browse Skills
                    </NavLink>
                )}

                {
                    <>
                        {/* My Meetings - Show for both Learners and Mentors, but only once */}
                        {(userRole === 'LEARNER' || userRole === 'MENTOR' || userRole === 'BOTH') && (
                            <NavLink
                                to="/meetings"
                                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                My Meetings
                            </NavLink>
                        )}
                    </>
                }
            </div>

            <div className={styles.actions}>
                <ThemeToggle />
                <div className={styles.authButtons}>
                    {userID ? (
                        <>
                            {/* Notification Bell */}
                            <div className={styles.notificationContainer} ref={notificationRef}>
                                <button
                                    className={styles.notificationButton}
                                    onClick={() => {
                                        setIsNotificationOpen(!isNotificationOpen);
                                        if (!isNotificationOpen) {
                                            // Refresh notifications when opening
                                            fetchUnreadCount();
                                        }
                                    }}
                                    aria-label="Notifications"
                                >
                                    <MdNotifications size={24} />
                                    {unreadCount > 0 && (
                                        <span className={styles.badge}>
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                <NotificationDropdown
                                    userId={userID}
                                    isOpen={isNotificationOpen}
                                    onClose={() => {
                                        setIsNotificationOpen(false);
                                        fetchUnreadCount(); // Refresh count after closing
                                    }}
                                />
                            </div>

                            {/* Profile Dropdown */}
                            <div className={dropdownStyles.dropdownContainer} ref={dropdownRef}>
                                <button
                                    className={dropdownStyles.profileButton}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className={dropdownStyles.avatar}>
                                        {getInitials(userName)}
                                    </div>
                                </button>

                                <div className={`${dropdownStyles.dropdownMenu} ${isDropdownOpen ? dropdownStyles.open : ''}`}>
                                    <div className={dropdownStyles.userInfo}>
                                        <span className={dropdownStyles.userName}>{userName || 'User'}</span>
                                        {/* <span className={dropdownStyles.userEmail}>{user.email}</span> */}
                                    </div>

                                    <Link to="/profile" className={dropdownStyles.menuItem} onClick={() => setIsDropdownOpen(false)}>
                                        <MdPerson /> Profile
                                    </Link>
                                    <Link to="/wallet" className={dropdownStyles.menuItem} onClick={() => setIsDropdownOpen(false)}>
                                        <MdWallet /> Wallet
                                    </Link>
                                    <Link to="/settings" className={dropdownStyles.menuItem} onClick={() => setIsDropdownOpen(false)}>
                                        <MdSettings /> Settings
                                    </Link>
                                    <button className={`${dropdownStyles.menuItem} ${dropdownStyles.danger}`} onClick={handleLogout}>
                                        <MdLogout /> Log Out
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" size="sm">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
