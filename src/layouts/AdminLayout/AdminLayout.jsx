import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    MdPeople,
    MdClass,
    MdAttachMoney,
    MdAnalytics,
    MdSettings,
    MdLogout,
    MdPerson
} from 'react-icons/md';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import styles from './AdminLayout.module.css';
import navbarStyles from '../../components/common/Navbar/Navbar.module.css'; // Importing navbar styles for consistency

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        // Perform logout logic here (clear tokens, etc)
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/users', label: 'User Management', icon: <MdPeople /> },
        { path: '/admin/categories', label: 'Categories', icon: <MdClass /> },
        { path: '/admin/finance', label: 'Finance', icon: <MdAttachMoney /> },
    ];

    return (
        <div className={styles.layoutContainer}>
            {/* Top Navigation Bar mimicking public Navbar */}
            <nav className={styles.topNavbar}>
                <div className={styles.logoSection}>
                    <span className={navbarStyles.logo}>SkillShare.pk</span>
                </div>

                <div className={styles.centerTitle}>
                    <h3>Admin Portal</h3>
                </div>

                <div className={styles.rightActions}>
                    <ThemeToggle />
                    <div className={styles.adminProfile}>
                        {/*<span className={styles.adminName}>Admin User</span>*/}
                        <div className={styles.avatar}>A</div>
                    </div>
                </div>
            </nav>

            {/* Main Body: Sidebar + Content */}
            <div className={styles.bodyContainer}>
                <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                    <nav className={styles.nav}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            <MdLogout /> <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main className={styles.mainContent}>
                    <div className={styles.contentScroll}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
