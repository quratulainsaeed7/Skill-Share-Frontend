// src/pages/VerifyEmail/VerifyEmail.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';

import { MdEmail } from 'react-icons/md';
import UserService from '../../services/UserService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();

    const [verifying, setVerifying] = useState(false);

    const handleVerify = async () => {
        setVerifying(true);
        try {
            await UserService.verifyEmail();
            alert('Email verified successfully!');
            navigate('/login');
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
