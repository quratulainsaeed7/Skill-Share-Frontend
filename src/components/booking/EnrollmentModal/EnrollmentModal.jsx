import React, { useState } from 'react';
import styles from './EnrollmentModal.module.css';
import Button from '../../common/Button/Button';

const EnrollmentModal = ({ skill, onClose, onEnroll }) => {
    const [selectedPlan, setSelectedPlan] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentPlans = [
        {
            id: 'cash',
            name: 'Cash Payment',
            price: skill.priceCash,
            currency: 'Rs.',
            description: 'One-time payment',
            icon: '💵'
        },
        ...(skill.priceType === 'both' ? [{
            id: 'credits',
            name: 'Credit Payment',
            price: skill.priceCredits,
            currency: 'Credits',
            description: 'Use your credits',
            icon: '🪙'
        }] : [])
    ];

    const handleEnroll = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            onEnroll(selectedPlan);
            setIsProcessing(false);
        }, 1500);
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
