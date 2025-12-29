// src/pages/Wallet/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { walletService } from '../../services/walletService';
import { generateSampleWalletData } from '../../mock/walletData';
import styles from './Wallet.module.css';
import PaymentMethodCard from '../../components/payment/PaymentMethod/PaymentMethodCard';
import AddPaymentMethod from '../../components/payment/PaymentMethod/AddPaymentMethod';
import TransactionList from '../../components/payment/CreditWallet/TransactionList';
import Button from '../../components/common/Button/Button';
import UserService from '../../services/UserService';

const Wallet = () => {
    // Use centralized UserService instead of useAuth
    const user = UserService.getUser();
    // Use userId for consistency with UserService storage format
    const userId = user?.userId || user?.id || null;
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        balance: 0,
        totalIncoming: 0,
        totalOutgoing: 0,
        transactionCount: 0,
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadWalletData();
        }
    }, [userId]);

    const loadWalletData = async () => {
        try {
            setLoading(true);
            // Use userId variable for consistency with UserService
            const [methods, walletTrans, paymentTrans, walletStats] = await Promise.all([
                walletService.getPaymentMethods(userId),
                walletService.getTransactions(userId),
                walletService.getPaymentTransactions(userId),
                walletService.getTransactionStats(userId),
            ]);

            setPaymentMethods(methods);

            // Combine wallet transactions and payment transactions
            const combinedTransactions = [
                ...walletTrans.map(t => ({ ...t, source: 'wallet' })),
                ...paymentTrans.map(t => ({ ...t, source: 'payment' }))
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setTransactions(combinedTransactions);
            setStats(walletStats);
        } catch (error) {
            console.error('Error loading wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = async (methodData) => {
        try {
            // Include user's email for Stripe Customer creation
            const dataWithEmail = {
                ...methodData,
                email: user?.email || null,
            };
            await walletService.addPaymentMethod(userId, dataWithEmail);
            await loadWalletData();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    };

    const handleDeletePaymentMethod = async (methodId) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            try {
                await walletService.deletePaymentMethod(methodId);
                await loadWalletData();
            } catch (error) {
                console.error('Error deleting payment method:', error);
            }
        }
    };

    const handleSetDefaultPaymentMethod = async (methodId) => {
        try {
            console.log('Setting default for userId:', userId, 'methodId:', methodId);
            await walletService.setDefaultPaymentMethod(userId, methodId);
            await loadWalletData();
        } catch (error) {
            console.error('Error setting default payment method:', error);
            alert(`Failed to set default payment method: ${error.message}`);
        }
    };

    const handleLoadDemoData = async () => {
        if (window.confirm('This will add sample payment methods and transactions. Continue?')) {
            try {
                const demoData = generateSampleWalletData(user.id);
                await walletService.initializeDemoData(user.id, demoData);
                await loadWalletData();
            } catch (error) {
                console.error('Error loading demo data:', error);
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading wallet...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Wallet</h1>
                    <p className={styles.subtitle}>
                        Manage your payment methods and track transactions
                    </p>
                </div>
                {paymentMethods.length === 0 && transactions.length === 0 && (
                    <Button variant="outline" onClick={handleLoadDemoData}>
                        Load Sample Data
                    </Button>
                )}
            </div>

            {/* Wallet Overview */}
            <div className={styles.overview}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>↓</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Incoming</p>
                        <h2 className={`${styles.statValue} ${styles.incoming}`}>
                            {formatCurrency(stats.totalIncoming)}
                        </h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>↓</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Balance</p>
                        <h2 className={`${styles.statValue} ${styles.incoming}`}>
                            {formatCurrency(stats.balance)}
                        </h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>↑</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Outgoing</p>
                        <h2 className={`${styles.statValue} ${styles.outgoing}`}>
                            {formatCurrency(stats.totalOutgoing)}
                        </h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Transactions</p>
                        <h2 className={styles.statValue}>{stats.transactionCount}</h2>
                    </div>
                </div>
            </div>

            {/* Payment Methods Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Payment Methods</h2>
                    <Button onClick={() => setShowAddModal(true)}>
                        + Add Payment Method
                    </Button>
                </div>

                {paymentMethods.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>💳</div>
                        <h3>No Payment Methods</h3>
                        <p>Add a credit card or online wallet to start making payments</p>
                        <Button onClick={() => setShowAddModal(true)} style={{ marginTop: '1rem' }}>
                            Add Your First Payment Method
                        </Button>
                    </div>
                ) : (
                    <div className={styles.paymentGrid}>
                        {paymentMethods.map((method) => (
                            <PaymentMethodCard
                                key={method.id}
                                method={method}
                                onDelete={handleDeletePaymentMethod}
                                onSetDefault={handleSetDefaultPaymentMethod}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Transactions Section */}
            <section className={styles.section}>
                <TransactionList
                    transactions={transactions}
                    paymentMethods={paymentMethods}
                />
            </section>

            {/* Add Payment Method Modal */}
            {showAddModal && (
                <AddPaymentMethod
                    onAdd={handleAddPaymentMethod}
                    onCancel={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
};

export default Wallet;
