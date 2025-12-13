// src/components/auth/SignupForm/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Card from '../../common/Card/Card';
import { useAuth } from '../../../context/AuthContext';
import styles from './SignupForm.module.css';
import clsx from 'clsx';
import { authService } from '../../../services/authService'; // Direct check for uniqueness

const PAK_CITIES = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
    'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad'
];

const SignupForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        city: '',
        role: '',
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

        if (!formData.phone.match(/^(\+92|03)\d{9}$/))
            newErrors.phone = "Invalid Pakistani phone number (+92... or 03...)";

        if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (!formData.city) newErrors.city = "Please select a city";
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
            await signup({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                city: formData.city,
                role: formData.role
            });
            navigate('/verify-email?email=' + encodeURIComponent(formData.email));
        } catch (err) {
            setErrors(prev => ({ ...prev, form: err.message }));
        } finally {
            setLoading(false);
        }
    };

    const RoleCard = ({ value, label, icon: Icon, desc }) => (
        <div
            className={clsx(styles.roleCard, { [styles.selected]: formData.role === value })}
            onClick={() => setFormData(prev => ({ ...prev, role: value }))}
        >
            <Icon className={styles.roleIcon} />
            <span className={styles.roleTitle}>{label}</span>
            <span className={styles.roleDesc}>{desc}</span>
            <input
                type="radio"
                name="role"
                value={value}
                checked={formData.role === value}
                onChange={() => { }}
                style={{ display: 'none' }}
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.roles}>
                <RoleCard
                    value="learner"
                    label="Learner"
                    icon={FaUserGraduate}
                    desc="Find mentors"
                />
                <RoleCard
                    value="mentor"
                    label="Mentor"
                    icon={FaChalkboardTeacher}
                    desc="Share skills"
                />
                <RoleCard
                    value="both"
                    label="Both"
                    icon={FaUsers}
                    desc="Learn & Teach"
                />
            </div>
            {errors.role && <span style={{ color: 'var(--color-error)' }}>{errors.role}</span>}

            <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="Enter your full name"
            />

            <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="your.email@example.com"
            />

            <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+92 3XX XXXXXXX"
            />

            <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Select your city"
                list="cities"
            />
            <datalist id="cities">
                {PAK_CITIES.map(city => <option key={city} value={city} />)}
            </datalist>

            <div>
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a strong password"
                />
                <div className={styles.passwordStrength}>
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={clsx(styles.strengthBar, {
                                [styles.active]: passwordStrength >= 1,
                                [styles.medium]: passwordStrength >= 3,
                                [styles.strong]: passwordStrength >= 4
                            })}
                            style={{ opacity: passwordStrength >= s ? 1 : 0.3 }}
                        />
                    ))}
                </div>
            </div>

            <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
            />

            <label className={styles.terms}>
                <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                />
                I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.termsAccepted && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>{errors.termsAccepted}</span>}
            {errors.form && <div style={{ color: 'var(--color-error)', textAlign: 'center' }}>{errors.form}</div>}

            <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
    );
};

export default SignupForm;
