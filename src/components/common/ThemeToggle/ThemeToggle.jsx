// src/components/common/ThemeToggle/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.toggleButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <MdDarkMode className={styles.icon} />
            ) : (
                <MdLightMode className={styles.icon} />
            )}
        </button>
    );
};

export default ThemeToggle;
