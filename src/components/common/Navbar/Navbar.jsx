import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';
import dropdownStyles from './NavbarDropdown.module.css';
import { MdPerson, MdWallet, MdSettings, MdLogout, MdDashboard, MdBook } from 'react-icons/md';
import UserService from '../../../services/UserService';

const Navbar = () => {
    // Use centralized UserService instead of direct localStorage access
    const user = UserService.getUser();
    const userRole = user?.role || null;
    const userName = user?.name || null;
    const userID = user?.userId || null;

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                <NavLink
                    to="/skills"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                    Browse Skills
                </NavLink>

                {
                    <>
                        {/* Learner Links */}
                        {(userRole === 'LEARNER' || userRole === 'BOTH') && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    My Learnings
                                </NavLink>
                                <NavLink
                                    to="/meetings"
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    My Meetings
                                </NavLink>
                            </>
                        )}

                        {/* Mentor Links */}
                        {(userRole === 'MENTOR' || userRole === 'BOTH') && (
                            <>
                                <NavLink
                                    to="/dashboard?view=mentor" // We'll handle this query param in Dashboard
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    My Bookings
                                </NavLink>
                                <NavLink
                                    to="/meetings"
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                >
                                    My Meetings
                                </NavLink>
                            </>
                        )}
                    </>
                }
            </div>

            <div className={styles.actions}>
                <ThemeToggle />
                <div className={styles.authButtons}>
                    {userID ? (
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
