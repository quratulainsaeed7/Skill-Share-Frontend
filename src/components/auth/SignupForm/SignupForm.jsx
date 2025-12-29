// src/components/auth/SignupForm/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Card from '../../common/Card/Card';
import styles from './SignupForm.module.css';
import clsx from 'clsx';
import UserService from '../../../services/UserService';




const SignupForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner',
        termsAccepted: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Initialize role from URL
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam) {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [searchParams]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') {
            calculatePasswordStrength(value);
        }

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const calculatePasswordStrength = (pass) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setPasswordStrength(score);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim() || formData.fullName.length < 2)
            newErrors.fullName = "Name must be at least 2 characters";

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Invalid email address";

        if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (!formData.role) newErrors.role = "Please select a role";
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await UserService.registerUser(formData);
            console.log('Registration successful');
            navigate('/verify-email');
        } catch (err) {
            setErrors(prev => ({ ...prev, form: err.message }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.form && (
                <div className={styles.errorAlert}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7V7h2v6zm0-8H7V3h2v2z"/>
                    </svg>
                    {errors.form}
                </div>
            )}

            <div className={styles.inputGroup}>
                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                />
            </div>

            <div className={styles.inputGroup}>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Enter your email"
                />
            </div>

            <div className={styles.inputGroup}>
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a password"
                />
            </div>

            <div className={styles.inputGroup}>
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Re-enter your password"
                />
            </div>

            <div className={styles.roleSelect}>
                <label className={styles.roleLabel}>I am a:</label>
                <div className={styles.roleButtons}>
                    <button
                        type="button"
                        className={clsx(styles.roleButton, { [styles.roleActive]: formData.role === 'learner' })}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'learner' }))}
                    >
                        <FaUserGraduate className={styles.roleIcon} />
                        Learner
                    </button>
                    <button
                        type="button"
                        className={clsx(styles.roleButton, { [styles.roleActive]: formData.role === 'mentor' })}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'mentor' }))}
                    >
                        <FaChalkboardTeacher className={styles.roleIcon} />
                        Mentor
                    </button>
                    <button
                        type="button"
                        className={clsx(styles.roleButton, { [styles.roleActive]: formData.role === 'both' })}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'both' }))}
                    >
                        <FaUsers className={styles.roleIcon} />
                        Both
                    </button>
                </div>
            </div>

            <label className={styles.checkbox}>
                <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                />
                <span>
                    I agree to the SkillShare <a href="/terms" className={styles.checkboxLink}>Terms of Use</a> and <a href="/privacy" className={styles.checkboxLink}>Privacy Policy</a>
                </span>
            </label>
            {errors.termsAccepted && <span className={styles.errorText}>{errors.termsAccepted}</span>}

            <Button type="submit" fullWidth disabled={loading} className={styles.submitButton}>
                {loading ? 'Creating Account...' : 'Sign up'}
            </Button>
        </form>
    );
};

export default SignupForm;
