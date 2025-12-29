import React, { useState } from 'react';
import styles from './EnrollmentModal.module.css';
import Button from '../../common/Button/Button';
import { skillService } from '../../../services/skillService';

const EnrollmentModal = ({ skill, onClose, onEnroll, skillId, userId }) => {
    const [selectedPlan, setSelectedPlan] = useState('credits');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const paymentPlans = [
        {
            id: 'credits',
            name: 'Credit Payment',
            price: skill.priceCredits || skill.priceCash,
            currency: 'Credits',
            description: 'Use your wallet credits',
            icon: '🪙'
        },
        ...(skill.priceType === 'both' ? [{
            id: 'cash',
            name: 'Cash Payment',
            price: skill.priceCash,
            currency: 'PKR',
            description: 'One-time payment via Stripe',
            icon: '💵'
        }] : [])
    ];

    const handleEnroll = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // Make actual enrollment API call
            await skillService.enrollInSkill(skillId, userId, { paymentPlan: selectedPlan });
            onEnroll(selectedPlan); // Callback to parent for success handling
        } catch (err) {
            console.error('Enrollment failed:', err);
            const errorMessage = err.message || 'Failed to enroll in the skill';

            // Check if error is about missing payment method
            if (errorMessage.includes('No payment method') || errorMessage.includes('add a card')) {
                setError(
                    <div>
                        <p style={{ marginBottom: '0.5rem' }}>{errorMessage}</p>
                        <a
                            href="/wallet"
                            style={{
                                color: '#3b82f6',
                                textDecoration: 'underline',
                                fontWeight: 'bold'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                window.location.href = '/wallet';
                            }}
                        >
                            Go to Wallet to Add a Card →
                        </a>
                    </div>
                );
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Choose Your Payment Plan</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.skillInfo}>
                    <img src={skill.image} alt={skill.title} className={styles.skillImage} />
                    <div>
                        <h3>{skill.title}</h3>
                        <p className={styles.mentor}>by {skill.mentorName}</p>
                    </div>
                </div>

                <div className={styles.plans}>
                    {paymentPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            <div className={styles.planIcon}>{plan.icon}</div>
                            <div className={styles.planInfo}>
                                <h3>{plan.name}</h3>
                                <p className={styles.planDescription}>{plan.description}</p>
                                <div className={styles.planPrice}>
                                    <span className={styles.currency}>{plan.currency}</span>
                                    <span className={styles.amount}>{plan.price}</span>
                                </div>
                            </div>
                            <div className={styles.radioBtn}>
                                <div className={selectedPlan === plan.id ? styles.radioActive : ''}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    {error && (
                        <div style={{ padding: '0.75rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div className={styles.total}>
                        <span>Total:</span>
                        <span className={styles.totalAmount}>
                            {paymentPlans.find(p => p.id === selectedPlan)?.currency} {paymentPlans.find(p => p.id === selectedPlan)?.price}
                        </span>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={handleEnroll}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Confirm & Enroll'}
                        </Button>
                    </div>
                </div>

                <p className={styles.guarantee}>
                    🛡️ 30-Day Money-Back Guarantee
                </p>
            </div>
        </div>
    );
};

export default EnrollmentModal;
