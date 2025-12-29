// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Welcome to SkillShare Pakistan</h1>
                <p className={styles.heroSubtitle}>
                    Connect, Learn, and Grow with local mentors.
                </p>
                <div className={styles.buttonGroup}>
                    <Link to="/signup?role=learner">
                        <Button variant="primary" size="lg">Find a Mentor</Button>
                    </Link>
                    <Link to="/signup?role=mentor">
                        <Button variant="secondary" size="lg">Become a Mentor</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
