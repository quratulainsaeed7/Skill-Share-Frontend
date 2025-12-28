import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input'; // Assuming we can simple input for now or just toggles
import styles from './Settings.module.css';
import UserService from '../../services/userService';

const Settings = () => {
    const navigate = useNavigate();
    // Use centralized UserService for user data
    const user = UserService.getUser();
    const [privacySettings, setPrivacySettings] = useState({
        showProfile: true,
        showCourses: true,
        showEmail: false
    });

    const handleToggle = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSave = () => {
        // Simulate save
        alert('Settings saved successfully!');
    };

    const handleLogout = () => {
        // Use UserService for centralized logout
        UserService.logout();
        navigate('/login');
    };

    // Safely handle null user state
    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.pageTitle}>Settings</h1>

                <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Privacy Settings</h2>
                <Card className={styles.card}>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h3>Public Profile</h3>
                            <p>Make your profile details visible to other users</p>
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={privacySettings.showProfile}
                                onChange={() => handleToggle('showProfile')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h3>Show Completed Courses</h3>
                            <p>Display your learning achievements on your profile</p>
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={privacySettings.showCourses}
                                onChange={() => handleToggle('showCourses')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h3>Show Email Address</h3>
                            <p>Allow others to see your email address</p>
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={privacySettings.showEmail}
                                onChange={() => handleToggle('showEmail')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </Card>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Actions</h2>
                <Card className={styles.card}>
                    <div className={styles.actionRow}>
                        <Button onClick={handleSave} variant="primary">Save Changes</Button>
                        <Button onClick={handleLogout} variant="outline" className={styles.logoutBtn}>Log Out</Button>
                    </div>
                </Card>
            </div>
            </div>
        </div>
    );
};

export default Settings;
