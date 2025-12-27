// src/pages/Signup/Signup.jsx
import React from 'react';
import Card from '../../components/common/Card/Card';
import SignupForm from '../../components/auth/SignupForm/SignupForm';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <Card padding="lg">
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h1>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Join the SkillShare Community
                </p>
                <SignupForm />
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Login</Link>
                </p>
            </Card>
        </div>
    );
};

export default Signup;
