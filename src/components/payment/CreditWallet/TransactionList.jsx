// src/components/payment/CreditWallet/TransactionList.jsx
import React, { useState } from 'react';
import styles from './TransactionList.module.css';

const TransactionList = ({ transactions, paymentMethods }) => {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const getPaymentMethodName = (methodId) => {
        const method = paymentMethods.find((m) => m.id === methodId);
        if (!method) return 'Unknown';
        
        if (method.cardType === 'card') {
            return `${method.type} •••• ${method.cardNumber.slice(-4)}`;
        }
        return `${method.type} (${method.email})`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            });
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount);
    };

    const getTransactionIcon = (type) => {
        return type === 'incoming' ? '↓' : '↑';
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'amount') {
            return b.amount - a.amount;
        }
        return 0;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Transaction History</h2>
                <div className={styles.controls}>
                    <select
                        className={styles.filter}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Transactions</option>
                        <option value="incoming">Incoming</option>
                        <option value="outgoing">Outgoing</option>
                    </select>
                    <select
                        className={styles.sort}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                    </select>
                </div>
            </div>

            {sortedTransactions.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>💸</div>
                    <h3>No Transactions Yet</h3>
                    <p>Your transaction history will appear here once you start booking courses.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {sortedTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className={`${styles.transaction} ${
                                transaction.type === 'incoming'
                                    ? styles.incoming
                                    : styles.outgoing
                            }`}
                        >
                            <div className={styles.iconWrapper}>
                                <span className={styles.icon}>
                                    {getTransactionIcon(transaction.type)}
                                </span>
                            </div>
                            <div className={styles.details}>
                                <h3 className={styles.description}>
                                    {transaction.description || 'Course Booking'}
                                </h3>
                                <div className={styles.meta}>
                                    <span className={styles.date}>
                                        {formatDate(transaction.createdAt)}
                                    </span>
                                    {transaction.paymentMethodId && (
                                        <>
                                            <span className={styles.separator}>•</span>
                                            <span className={styles.method}>
                                                {getPaymentMethodName(transaction.paymentMethodId)}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {transaction.courseName && (
                                    <p className={styles.courseName}>{transaction.courseName}</p>
                                )}
                            </div>
                            <div className={styles.amountWrapper}>
                                <span className={styles.amount}>
                                    {transaction.type === 'incoming' ? '+' : '-'}
                                    {formatAmount(transaction.amount)}
                                </span>
                                <span
                                    className={`${styles.status} ${
                                        styles[transaction.status]
                                    }`}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
