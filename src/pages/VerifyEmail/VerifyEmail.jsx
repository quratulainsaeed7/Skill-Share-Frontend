// src/pages/VerifyEmail/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

/**
 * Email Verification Page
 * Step 3 of user onboarding workflow:
 * REGISTER → LOGIN → EMAIL_VERIFIED → PROFILE_COMPLETED → FULL_APP_ACCESS
 */
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { user, verifyEmail } = useAuth();
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Auto-verify if token is present in URL
    useEffect(() => {
        if (token) {
            handleVerifyWithToken();
        } else if (user?.emailVerified) {
            // Already verified, redirect to profile completion
            navigate('/complete-profile', { replace: true });
        }
    }, [token, user, navigate]);


    const handleVerifyWithToken = async () => {
        if (!token) {
            setError('No verification token provided');
            return;
        }

        setVerifying(true);
        setError(null);
        try {
            console.log('🔐 Attempting to verify email with token');

            // If user is logged in, use the context method which refreshes the JWT
            if (user) {
                await verifyEmail(token);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/complete-profile', { replace: true });
                }, 2000);
            } else {
                // User not logged in - verify directly without JWT refresh
                const response = await fetch(`${import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000'}/api/users/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                console.log('✅ Verification response:', data);

                if (data.success) {
                    setSuccess(true);
                    // Redirect to login after successful verification
                    setTimeout(() => {
                        navigate('/login?verified=true', { replace: true });
                    }, 2000);
                } else {
                    throw new Error(data.message || 'Email verification failed');
                }
            }
        } catch (err) {
            console.error('❌ Verification error:', err);
            setError(err.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendEmail = async () => {
        if (!user?.email) {
            setError('Email address not found. Please login again.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL || 'http://72.62.176.58.sslip.io:3000'}/api/users/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            });

            const data = await response.json();
            alert(data.message || 'Verification email sent! Please check your inbox.');
        } catch (err) {
            setError(err.message || 'Failed to resend email');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
            <Card padding="lg">
                <MdEmail style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h1>Verify Your Email</h1>

                {token ? (
                    <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                        {verifying ? 'Verifying your email...' :
                            success ? '✓ Email verified successfully! Redirecting...' :
                                error ? error : 'Processing...'}
                    </p>
                ) : (
                    <>
                        <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                            We've sent a verification email to {user?.email && <strong>{user.email}</strong>}.
                            <br />Please click the link in that email to activate your account.
                        </p>
                        {error && <p style={{ color: 'var(--color-error)', margin: '1rem 0' }}>{error}</p>}
                    </>
                )}

                {!token && (
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button variant="outline" onClick={handleResendEmail}>Resend Email</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default VerifyEmail;
