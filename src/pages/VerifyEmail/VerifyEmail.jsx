// src/pages/VerifyEmail/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';

import { MdEmail } from 'react-icons/md';
import UserService from '../../services/UserService';
import ProfileService from '../../services/profileService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);

    // Auto-verify if token is present in URL
    useEffect(() => {
        if (token) {
            handleVerifyWithToken();
        }
    }, [token]);

    useEffect(() => {
        // Check verification status via UserService (centralized)
        const checkVerificationStatus = () => {
            try {
                const user = UserService.getUser();
                const profileComplete = ProfileService.isUserProfileComplete(); // Placeholder for profile completeness check
                if (user?.isVerified === true || user?.emailVerified === true) {
                    // check user profile completeness
                    if (profileComplete == true) {
                        navigate('/skills');
                    } else {
                        navigate('/complete-profile');
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkVerificationStatus();
    }, [navigate]);


    const handleVerifyWithToken = async () => {
        if (!token) {
            setError('No verification token provided');
            return;
        }

        setVerifying(true);
        setError(null);
        try {
            const response = await UserService.verifyEmailWithToken(token);

            // Update user in session storage
            const user = UserService.getUser();
            if (user) {
                user.emailVerified = true;
                user.isVerified = true;
                UserService.setUser(user);
            }

            alert('Email verified successfully!');

            const profileComplete = await ProfileService.isUserProfileComplete();
            if (profileComplete == true) {
                navigate('/skills');
            } else {
                navigate('/complete-profile');
            }
        } catch (err) {
            setError(err.message || 'Verification failed');
            alert(err.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            alert('Email address not found. Please register again.');
            return;
        }

        try {
            await UserService.resendVerificationEmail(email);
            alert('Verification email sent! Please check your inbox.');
        } catch (err) {
            alert(err.message || 'Failed to resend email');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
            <Card padding="lg">
                <MdEmail style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h1>Verify Your Email</h1>

                {token ? (
                    <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                        {verifying ? 'Verifying your email...' : error ? error : 'Email verified!'}
                    </p>
                ) : (
                    <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                        We've sent a verification email to {email && <strong>{email}</strong>}.
                        <br />Please click the link in that email to activate your account.
                    </p>
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
