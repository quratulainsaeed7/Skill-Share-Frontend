// src/pages/Login/Login.jsx
import React from 'react';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaRocket, FaStar } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.brandingContent}>
                    <div className={styles.logo}>
                        <FaGraduationCap className={styles.logoIcon} />
                        <span className={styles.logoText}>SkillShare</span>
                    </div>
                    
                    <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
                    <p className={styles.welcomeSubtitle}>
                        Continue your learning journey and connect with amazing mentors
                    </p>
                    
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <FaUsers className={styles.featureIcon} />
                            <div>
                                <h3>Connect with Experts</h3>
                                <p>Learn from industry professionals</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaRocket className={styles.featureIcon} />
                            <div>
                                <h3>Accelerate Your Growth</h3>
                                <p>Master new skills at your own pace</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <FaStar className={styles.featureIcon} />
                            <div>
                                <h3>Track Your Progress</h3>
                                <p>See your improvements over time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Log In</h2>
                        <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
                    </div>
                    
                    <LoginForm />
                    
                    <div className={styles.signupPrompt}>
                        <span>New to SkillShare?</span>
                        <Link to="/signup" className={styles.signupLink}>Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
