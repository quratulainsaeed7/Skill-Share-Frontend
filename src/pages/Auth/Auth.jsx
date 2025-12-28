// src/pages/Auth/Auth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import SignupForm from '../../components/auth/SignupForm/SignupForm';
import styles from './Auth.module.css';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialMode = location.pathname === '/signup' ? 'signup' : 'login';
    const [activeCard, setActiveCard] = useState(initialMode);

    console.log('Auth component loaded, path:', location.pathname, 'activeCard:', activeCard);

    useEffect(() => {
        // Update active card when route changes
        const mode = location.pathname === '/signup' ? 'signup' : 'login';
        setActiveCard(mode);
    }, [location.pathname]);

    const switchCard = (mode) => {
        setActiveCard(mode);
        // Update the URL to match the active card
        navigate(mode === 'signup' ? '/signup' : '/login', { replace: true });
    };

    return (
        <div className={`${styles.container} ${activeCard === 'login' ? styles.containerLogin : styles.containerSignup}`}>
            <div className={styles.background}>
                <div className={styles.backgroundShape1}></div>
                <div className={styles.backgroundShape2}></div>
                <div className={styles.backgroundShape3}></div>
            </div>

            <div className={styles.branding}>
                <div className={styles.logo}>
                    <FaGraduationCap className={styles.logoIcon} />
                    <span className={styles.logoText}>SkillShare</span>
                </div>
                <p className={styles.tagline}>Learn. Grow. Share.</p>
            </div>

            <div className={styles.cardDeck}>
                {/* Login Card */}
                <div 
                    className={`${styles.card} ${styles.loginCard} ${activeCard === 'login' ? styles.cardActive : styles.cardBehind}`}
                    style={{ zIndex: activeCard === 'login' ? 2 : 1 }}
                >
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Welcome Back</h2>
                        <p className={styles.cardSubtitle}>Log in to continue your journey</p>
                    </div>
                    
                    <LoginForm />
                    
                    <div className={styles.cardFooter}>
                        <span>Don't have an account?</span>
                        <button 
                            type="button"
                            onClick={() => switchCard('signup')} 
                            className={styles.switchButton}
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Signup Card */}
                <div 
                    className={`${styles.card} ${styles.signupCard} ${activeCard === 'signup' ? styles.cardActive : styles.cardBehind}`}
                    style={{ zIndex: activeCard === 'signup' ? 2 : 1 }}
                >
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Join SkillShare</h2>
                        <p className={styles.cardSubtitle}>Start learning from the best</p>
                    </div>
                    
                    <SignupForm />
                    
                    <div className={styles.cardFooter}>
                        <span>Already have an account?</span>
                        <button 
                            type="button"
                            onClick={() => switchCard('login')} 
                            className={styles.switchButton}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
