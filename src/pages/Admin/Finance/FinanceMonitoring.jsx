import React, { useState, useEffect } from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import styles from './FinanceMonitoring.module.css';

const FinanceMonitoring = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

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

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <MdArrowDropDown style={{ opacity: 0.3 }} />;
        return sortConfig.direction === 'asc' ? <MdArrowDropUp /> : <MdArrowDropDown />;
    };

    const sortedPayments = [...payments].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'amount') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else if (sortConfig.key === 'created_at') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        } else {
            aVal = aVal?.toString().toLowerCase() || '';
            bVal = bVal?.toString().toLowerCase() || '';
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleExport = () => {
        if (!payments.length) return alert('No data to export');
        const headers = ["Payment ID", "Amount", "Status", "Date"];
        const rows = payments.map(p => [
            p.paymentId,
            p.amount,
            p.status,
            new Date(p.created_at).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'financial_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Financial Monitoring</h2>
                <button className={styles.exportBtn} onClick={handleExport}>Export CSV</button>
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
                            <th onClick={() => handleSort('paymentId')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>ID {getSortIcon('paymentId')}</div>
                            </th>
                            <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Amount {getSortIcon('amount')}</div>
                            </th>
                            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Status {getSortIcon('status')}</div>
                            </th>
                            <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Date {getSortIcon('created_at')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPayments.map(p => (
                            <tr key={p.paymentId}>
                                <td>{p.paymentId}</td>
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
