import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <div className="unauthorized-icon">🔒</div>
                <h1 className="unauthorized-title">Access Denied</h1>
                <p className="unauthorized-message">
                    You don't have permission to access this page.
                    <br />
                    Please contact your administrator if you believe this is an error.
                </p>
                <div className="unauthorized-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="unauthorized-btn btn-secondary"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="unauthorized-btn btn-primary"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
