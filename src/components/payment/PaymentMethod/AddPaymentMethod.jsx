// src/components/payment/PaymentMethod/AddPaymentMethod.jsx
import React, { useState } from 'react';
import styles from './AddPaymentMethod.module.css';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

const AddPaymentMethod = ({ onAdd, onCancel }) => {
    const [methodType, setMethodType] = useState('card');
    const [formData, setFormData] = useState({
        type: '',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cardTypes = ['Visa', 'Mastercard', 'Amex', 'Discover'];
    const walletTypes = ['PayPal', 'Venmo', 'CashApp'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateCard = () => {
        const newErrors = {};

        if (!formData.type) {
            newErrors.type = 'Please select a card type';
        }

        if (!formData.cardNumber) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        if (!formData.cardHolder) {
            newErrors.cardHolder = 'Cardholder name is required';
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = 'Format: MM/YY';
        }

        if (!formData.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'Invalid CVV';
        }

        return newErrors;
    };

    const validateWallet = () => {
        const newErrors = {};

        if (!formData.type) {
            newErrors.type = 'Please select a wallet type';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = methodType === 'card' ? validateCard() : validateWallet();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            let paymentMethodData;

            if (methodType === 'card') {
                const cardNumber = formData.cardNumber.replace(/\s/g, '');
                const [expMonth, expYear] = formData.expiryDate.split('/');

                paymentMethodData = {
                    type: 'card',
                    cardLast4: cardNumber.slice(-4),
                    cardBrand: formData.type.toLowerCase(), // Visa, Mastercard, etc.
                    cardExpMonth: parseInt(expMonth, 10),
                    cardExpYear: parseInt(`20${expYear}`, 10), // Convert YY to YYYY
                    isDefault: false,
                };
            } else {
                paymentMethodData = {
                    type: 'wallet',
                    accountIdentifier: formData.email,
                    accountName: formData.type, // PayPal, Venmo, etc.
                    isDefault: false,
                };
            }

            await onAdd(paymentMethodData);
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Add Payment Method</h2>
                    <button className={styles.closeBtn} onClick={onCancel}>
                        ×
                    </button>
                </div>

                <div className={styles.methodTypeTabs}>
                    <button
                        className={`${styles.tab} ${methodType === 'card' ? styles.active : ''}`}
                        onClick={() => setMethodType('card')}
                    >
                        Credit/Debit Card
                    </button>
                    <button
                        className={`${styles.tab} ${methodType === 'wallet' ? styles.active : ''}`}
                        onClick={() => setMethodType('wallet')}
                    >
                        Online Wallet
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {methodType === 'card' ? (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Card Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select card type</option>
                                    {cardTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && <span className={styles.error}>{errors.type}</span>}
                            </div>

                            <Input
                                label="Card Number"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                error={errors.cardNumber}
                                maxLength="19"
                            />

                            <Input
                                label="Cardholder Name"
                                name="cardHolder"
                                value={formData.cardHolder}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                error={errors.cardHolder}
                            />

                            <div className={styles.row}>
                                <div className={styles.halfWidth}>
                                    <Input
                                        label="Expiry Date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        error={errors.expiryDate}
                                        maxLength="5"
                                    />
                                </div>
                                <div className={styles.halfWidth}>
                                    <Input
                                        label="CVV"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        error={errors.cvv}
                                        maxLength="4"
                                        type="password"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Wallet Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="">Select wallet type</option>
                                    {walletTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && <span className={styles.error}>{errors.type}</span>}
                            </div>

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                error={errors.email}
                            />
                        </>
                    )}

                    {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Payment Method'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPaymentMethod;
