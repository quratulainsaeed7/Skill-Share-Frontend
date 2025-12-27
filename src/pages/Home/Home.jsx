// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1>Welcome to SkillShare Pakistan</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                Connect, Learn, and Grow with local mentors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/signup?role=learner">
                    <Button variant="primary" size="lg">Find a Mentor</Button>
                </Link>
                <Link to="/signup?role=mentor">
                    <Button variant="secondary" size="lg">Become a Mentor</Button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
