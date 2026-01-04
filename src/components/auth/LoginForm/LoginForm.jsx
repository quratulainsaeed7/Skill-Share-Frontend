// src/components/auth/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import { useAuth } from '../../../context/AuthContext';

import styles from './LoginForm.module.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

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
            const user = await login(formData.email, formData.password);

            // Redirect admin users to admin dashboard
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                // Workflow-based navigation (JWT claims drive redirects)
                // ProtectedRoute will handle automatic redirects based on emailVerified and profileCompleted
                navigate('/skills');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
                <div className={styles.errorAlert}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7V7h2v6zm0-8H7V3h2v2z" />
                    </svg>
                    {error}
                </div>
            )}

            <div className={styles.inputGroup}>
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    autoFocus
                />
            </div>

            <div className={styles.inputGroup}>
                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                />
            </div>

            <Button type="submit" fullWidth disabled={loading} className={styles.submitButton}>
                {loading ? 'Logging in...' : 'Log in'}
            </Button>

            <div className={styles.forgotPasswordLink}>
                <a href="/forgot-password">Forgot Password?</a>
            </div>
        </form>
    );
};

export default LoginForm;
