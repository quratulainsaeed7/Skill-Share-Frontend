// src/pages/Login/Login.jsx
import React from 'react';
import Card from '../../components/common/Card/Card';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <Card padding="lg">
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Welcome Back</h1>
                <LoginForm />
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Sign Up</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
