// src/components/payment/PaymentMethod/PaymentMethodCard.jsx
import React from 'react';
import styles from './PaymentMethodCard.module.css';
import Button from '../../common/Button/Button';

const PaymentMethodCard = ({ method, onDelete, onSetDefault }) => {
    const getCardIcon = (type) => {
        const typeStr = (type || '').toLowerCase();
        switch (typeStr) {
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
            case 'card':
                return '💳';
            case 'wallet':
                return '💰';
            default:
                return '💰';
        }
    };

    const formatCardNumber = (last4) => {
        if (!last4) return '';
        return `•••• •••• •••• ${last4}`;
    };

    const formatExpiryDate = (month, year) => {
        if (!month || !year) return '';
        return `${String(month).padStart(2, '0')}/${year}`;
    };

    return (
        <div className={`${styles.card} ${method.isDefault ? styles.default : ''}`}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{getCardIcon(method.cardBrand || method.type)}</span>
                    <div className={styles.info}>
                        <h3 className={styles.type}>
                            {method.cardBrand || method.type || 'Payment Method'}
                        </h3>
                        {method.cardLast4 ? (
                            <>
                                <p className={styles.number}>{formatCardNumber(method.cardLast4)}</p>
                                {(method.cardExpMonth && method.cardExpYear) && (
                                    <p className={styles.expiry}>
                                        Exp: {formatExpiryDate(method.cardExpMonth, method.cardExpYear)}
                                    </p>
                                )}
                            </>
                        ) : method.accountIdentifier ? (
                            <p className={styles.email}>{method.accountIdentifier}</p>
                        ) : null}
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
                        onClick={() => onSetDefault(method.methodId)}
                    >
                        Set as Default
                    </button>
                )}
                <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(method.methodId)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
