import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeLearners: 0,
        totalRevenue: 0,
        activeSkills: 0
    });

    useEffect(() => {
        // Fetch stats from backend
        // For now mocking or fetching from presumed endpoint
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:3004/admin/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <p className={styles.number}>{stats.totalUsers}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Active Learners</h3>
                    <p className={styles.number}>{stats.activeLearners}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Revenue</h3>
                    <p className={styles.number}>${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Active Skills</h3>
                    <p className={styles.number}>{stats.activeSkills}</p>
                </div>
            </div>

            <div className={styles.chartsArea}>
                <div className={styles.chartContainer}>
                    <h3>Recent Activity</h3>
                    <p>Chart Placeholder..</p>
                </div>
                <div className={styles.chartContainer}>
                    <h3>User Growth</h3>
                    <p>Chart Placeholder..</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
