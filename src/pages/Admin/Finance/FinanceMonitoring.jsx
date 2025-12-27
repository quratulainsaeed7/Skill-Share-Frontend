import React, { useState, useEffect } from 'react';
import styles from './FinanceMonitoring.module.css';

const FinanceMonitoring = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await fetch('http://localhost:3004/admin/finance');
                const data = await res.json();
                setPayments(data);
                setLoading(false);
            } catch (error) { console.error(error); }
        };
        fetchFinance();
    }, []);

    const totalRevenue = payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const platformFees = totalRevenue * 0.1; // Assuming 10% fee

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Financial Monitoring</h2>
                <button className={styles.exportBtn} onClick={() => alert('Exporting Financial Report...')}>Export CSV</button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Revenue</h3>
                    <p>${totalRevenue.toFixed(2)}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Net Fees (10%)</h3>
                    <p>${platformFees.toFixed(2)}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Transactions</h3>
                    <p>{payments.length}</p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <h3>Recent Transactions</h3>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.payment_id}>
                                <td>{p.payment_id}</td>
                                <td>${p.amount}</td>
                                <td>{p.status}</td>
                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceMonitoring;
