import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './ReportsAnalytics.module.css';

const ReportsAnalytics = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/reports`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Analytics & Reports</h2>
                <button className={styles.exportBtn} onClick={() => alert('Downloading PDF...')}>Export Reports</button>
            </div>

            <div className={styles.chartSection}>
                <h3>Revenue Growth Trends</h3>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.card}>
                    <h3>Completion Rate</h3>
                    <p>{data.completionRate.toFixed(1)}%</p>
                </div>
                <div className={styles.card}>
                    <h3>Total Bookings</h3>
                    <p>{data.bookingCount}</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
