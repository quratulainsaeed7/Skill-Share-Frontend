// src/pages/Signup/Signup.jsx
import React from 'react';
import SignupForm from '../../components/auth/SignupForm/SignupForm';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChartLine, FaAward, FaHandshake } from 'react-icons/fa';
import styles from './Signup.module.css';

const Signup = () => {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.brandingContent}>
                    <div className={styles.logo}>
                        <FaGraduationCap className={styles.logoIcon} />
                        <span className={styles.logoText}>SkillShare</span>
                    </div>
                    
                    <h1 className={styles.welcomeTitle}>Start Your Learning Journey</h1>
                    <p className={styles.welcomeSubtitle}>
                        Join thousands of learners and mentors in our growing community
                    </p>
                    
                    <div className={styles.benefits}>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>
                                <FaChartLine />
                            </div>
                            <div>
                                <h3>Learn & Grow</h3>
                                <p>Access expert knowledge and practical skills</p>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>
                                <FaAward />
                            </div>
                            <div>
                                <h3>Earn Certifications</h3>
                                <p>Validate your achievements</p>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>
                                <FaHandshake />
                            </div>
                            <div>
                                <h3>Network & Connect</h3>
                                <p>Build meaningful professional relationships</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Create Account</h2>
                        <p className={styles.formSubtitle}>Get started with your free account</p>
                    </div>
                    
                    <SignupForm />
                    
                    <div className={styles.loginPrompt}>
                        <span>Already have an account?</span>
                        <Link to="/login" className={styles.loginLink}>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
