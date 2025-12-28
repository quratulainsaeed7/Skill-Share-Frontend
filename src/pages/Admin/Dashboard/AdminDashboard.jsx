import React, { useEffect, useState, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import html2canvas from 'html2canvas';
import { MdDownload, MdAssessment } from 'react-icons/md';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeLearners: 0,
        totalRevenue: 0,
        activeSkills: 0
    });

    const [reports, setReports] = useState({ userGrowth: [], monthlyRevenue: [], bookingCount: 0 });
    const [activity, setActivity] = useState([]);

    const userGrowthRef = useRef(null);
    const revenueRef = useRef(null);

    const downloadChart = async (ref, title) => {
        if (ref.current) {
            try {
                const canvas = await html2canvas(ref.current, { backgroundColor: getComputedStyle(document.body).getPropertyValue('--color-bg-card').trim() });
                const link = document.createElement('a');
                link.download = `${title}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (err) {
                console.error("Chart download failed", err);
            }
        }
    };

    const downloadFullReport = async () => {
        try {
            // Fetch Finance Data (since it's not in state)
            const financeRes = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/finance`);
            const financeData = await financeRes.json();

            const totalRev = financeData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
            const netFees = totalRev * 0.1; // 10% platform fee
            const txnCount = financeData.length;

            let csv = "--- DASHBOARD SUMMARY ---\n";
            csv += "Metric,Value\n";
            csv += `Total Users,${stats.totalUsers}\n`;
            csv += `Active Learners,${stats.activeLearners}\n`;
            csv += `Active Skills,${stats.activeSkills}\n`;
            csv += `Total Bookings,${reports.bookingCount}\n\n`;

            csv += "--- FINANCIAL SUMMARY ---\n";
            csv += `Total Revenue,${totalRev.toFixed(2)}\n`;
            csv += `Net Fees (10%),${netFees.toFixed(2)}\n`;
            csv += `Transaction Count,${txnCount}\n\n`;

            csv += "--- RECENT ACTIVITY ---\n";
            csv += "Action,Details,Date\n";
            activity.forEach(a => {
                csv += `${a.actionType},"${a.details.replace(/"/g, '""')}",${new Date(a.createdAt).toLocaleString()}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Admin_Report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Failed to generate report");
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch basic dashboard stats
                const statsRes = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/dashboard`);
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }

                // Fetch detailed reports for charts
                // Fetch detailed reports for charts
                const repRes = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/reports`);
                if (repRes.ok) {
                    const data = await repRes.json();
                    setReports(data);
                }

                // Fetch recent activity
                // Fetch recent activity
                const actRes = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/activity`);
                if (actRes.ok) {
                    const data = await actRes.json();
                    setActivity(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                <button onClick={downloadFullReport} className={styles.reportBtn}>
                    <MdAssessment /> Download Full Report
                </button>
            </div>

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
                <div className={styles.statCard}>
                    <h3>Total Bookings</h3>
                    <p className={styles.number}>{reports.bookingCount}</p>
                </div>
            </div>

            <div className={styles.chartsArea}>
                <div className={styles.chartContainer}>
                    <h3>Recent Activity</h3>
                    <ul className={styles.activityList}>
                        {activity.length > 0 ? (
                            activity.map(log => (
                                <li key={log.logId} className={styles.activityItem}>
                                    <div className={styles.activityContent}>
                                        <span className={styles.actionType}>{log.actionType}</span>
                                        <span className={styles.details}>{log.details}</span>
                                    </div>
                                    <span className={styles.timestamp}>{new Date(log.createdAt).toLocaleString()}</span>
                                </li>
                            ))
                        ) : (
                            <p>No recent activity.</p>
                        )}
                    </ul>
                </div>
                <div className={styles.chartContainer}>
                    <div className={styles.chartHeader}>
                        <h3>User Growth (Last 6 Months)</h3>
                        <button onClick={() => downloadChart(userGrowthRef, 'UserGrowth')} className={styles.downloadBtn} title="Download PNG"><MdDownload /></button>
                    </div>
                    <div style={{ width: '100%', height: 300 }} ref={userGrowthRef}>
                        {reports.userGrowth && reports.userGrowth.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <LineChart data={reports.userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="var(--color-primary)" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '50px' }}>Loading or No Data Available</p>
                        )}
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <div className={styles.chartHeader}>
                        <h3>Revenue Growth Trends</h3>
                        <button onClick={() => downloadChart(revenueRef, 'RevenueGrowth')} className={styles.downloadBtn} title="Download PNG"><MdDownload /></button>
                    </div>
                    <div style={{ width: '100%', height: 300 }} ref={revenueRef}>
                        {reports.monthlyRevenue && reports.monthlyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={reports.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip cursor={{ fill: 'var(--color-bg-body)' }} contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} itemStyle={{ color: 'var(--color-text-primary)' }} />
                                    <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '50px' }}>Loading or No Data Available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
