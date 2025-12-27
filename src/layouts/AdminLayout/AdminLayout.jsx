import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdClass,
    MdAttachMoney,
    MdAnalytics,
    MdSettings,
    MdLogout
} from 'react-icons/md';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        // Perform logout logic here (clear tokens, etc)
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
        { path: '/admin/users', label: 'User Management', icon: <MdPeople /> },
        { path: '/admin/skills', label: 'Skills & Courses', icon: <MdClass /> },
        { path: '/admin/finance', label: 'Finance', icon: <MdAttachMoney /> },
        { path: '/admin/reports', label: 'Reports', icon: <MdAnalytics /> },
        { path: '/admin/settings', label: 'Settings', icon: <MdSettings /> },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.logoArea}>
                    <h2>SkillShare Admin</h2>
                </div>

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

                <div className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <MdLogout /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h3>Admin Portal</h3>
                    <div className={styles.profile}>
                        <span>Admin User</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>
                <div className={styles.contentScroll}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
