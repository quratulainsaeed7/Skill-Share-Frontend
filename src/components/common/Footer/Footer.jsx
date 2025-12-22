// src/components/common/Footer/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <p className={styles.copyright}>
                    &copy; {new Date().getFullYear()} SkillShare.pk. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
