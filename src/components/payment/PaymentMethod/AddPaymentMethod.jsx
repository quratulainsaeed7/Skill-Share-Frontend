// src/components/payment/PaymentMethod/AddPaymentMethod.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './AddPaymentMethod.module.css';
import Button from '../../common/Button/Button';

const stripePromise = loadStripe(import.meta.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51PWIT0E0bLkt7rhgSpfXvTF9LkczjM94AaiWgbn7BXhQN0zJAQxHf0g6ceikq7lEdxd2b6BjTCFrlZNiIfYoSKif00I3jlA96e');

const AddPaymentMethodForm = ({ onAdd, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Create a payment method with Stripe
            const cardElement = elements.getElement(CardElement);
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            // Send the Stripe payment method ID to backend
            const paymentMethodData = {
                stripePaymentMethodId: paymentMethod.id,
                type: 'card',
                isDefault: false,
            };

            await onAdd(paymentMethodData);
        } catch (err) {
            setError(err.message || 'Failed to add payment method');
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

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Card Details</label>
                        <div className={styles.cardElementContainer}>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                            padding: '12px',
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {error && <div className={styles.submitError}>{error}</div>}

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !stripe}>
                            {isSubmitting ? 'Adding...' : 'Add Card'}
                        </Button>
                    </div>
                </form>

                <p className={styles.secureNote}>
                    🔒 Your card details are secured by Stripe and never stored on our servers
                </p>
            </div>
        </div>
    );
};

const AddPaymentMethod = ({ onAdd, onCancel }) => {
    return (
        <Elements stripe={stripePromise}>
            <AddPaymentMethodForm onAdd={onAdd} onCancel={onCancel} />
        </Elements>
    );
};

export default AddPaymentMethod;
