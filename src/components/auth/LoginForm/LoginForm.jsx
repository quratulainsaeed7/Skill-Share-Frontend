// src/components/auth/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

import styles from './LoginForm.module.css';
import UserService from '../../../services/UserService';
import ProfileService from '../../../services/ProfileService';

const LoginForm = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await UserService.loginUser(formData);

            if (user.data.isVerified === false) {

                navigate('/verify-email');
                return;
            }

            const userProfile = await ProfileService.getUserProfile();
            console.log('User profile:', userProfile);
            if (!userProfile.profileId) {
                navigate('/complete-profile');
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-error)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.875rem'
                }}>
                    {error}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                autoFocus
            />

            <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
            />

            <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    />
                    Remember me
                </label>
                <Link to="/forgot-password" className={styles.forgotPassword}>
                    Forgot Password?
                </Link>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
};

export default LoginForm;
