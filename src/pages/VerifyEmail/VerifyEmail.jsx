// src/pages/VerifyEmail/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';

import { MdEmail } from 'react-icons/md';
import UserService from '../../services/userService';
import ProfileService from '../../services/profileService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        // Check verification status via UserService (centralized)
        const checkVerificationStatus = () => {
            try {
                const user = UserService.getUser();
                const profileComplete = ProfileService.isUserProfileComplete(); // Placeholder for profile completeness check
                if (user?.isVerified === true) {
                    // check user profile completeness
                    if (profileComplete) {
                        navigate('/dashboard');
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


    const handleVerify = async () => {
        setVerifying(true);
        try {
            await UserService.verifyEmail();
            alert('Email verified successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert(err.message);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
            <Card padding="lg">
                <MdEmail style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h1>Verify Your Email</h1>
                <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                    We've sent a verification email to <strong>{email}</strong>.
                    <br />Please click the link in that email to activate your account.
                </p>

                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Button variant="secondary" onClick={handleVerify} disabled={verifying}>
                        {verifying ? 'Verifying...' : 'Verify Now (Demo)'}
                    </Button>
                    <Button variant="outline">Resend Email</Button>
                </div>
            </Card>
        </div>
    );
};

export default VerifyEmail;
