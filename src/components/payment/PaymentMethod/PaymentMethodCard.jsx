// src/components/payment/PaymentMethod/PaymentMethodCard.jsx
import React from 'react';
import styles from './PaymentMethodCard.module.css';
import Button from '../../common/Button/Button';

const PaymentMethodCard = ({ method, onDelete, onSetDefault }) => {
    const getCardIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'visa':
                return '💳';
            case 'mastercard':
                return '💳';
            case 'amex':
                return '💳';
            case 'discover':
                return '💳';
            case 'paypal':
                return '🅿️';
            case 'venmo':
                return 'V';
            case 'cashapp':
                return '$';
            default:
                return '💰';
        }
    };

    const formatCardNumber = (number) => {
        if (!number) return '';
        return `•••• •••• •••• ${number.slice(-4)}`;
    };

    const formatExpiryDate = (expiry) => {
        if (!expiry) return '';
        return expiry;
    };

    return (
        <div className={`${styles.card} ${method.isDefault ? styles.default : ''}`}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{getCardIcon(method.type)}</span>
                    <div className={styles.info}>
                        <h3 className={styles.type}>{method.type}</h3>
                        {method.cardType === 'card' ? (
                            <>
                                <p className={styles.number}>{formatCardNumber(method.cardNumber)}</p>
                                <p className={styles.expiry}>Exp: {formatExpiryDate(method.expiryDate)}</p>
                            </>
                        ) : (
                            <p className={styles.email}>{method.email}</p>
                        )}
                    </div>
                </div>
                {method.isDefault && (
                    <span className={styles.defaultBadge}>Default</span>
                )}
            </div>

            <div className={styles.actions}>
                {!method.isDefault && (
                    <button
                        className={styles.setDefaultBtn}
                        onClick={() => onSetDefault(method.id)}
                    >
                        Set as Default
                    </button>
                )}
                <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(method.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
