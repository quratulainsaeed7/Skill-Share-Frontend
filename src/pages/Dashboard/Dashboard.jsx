import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LearnerDashboard from '../../components/dashboard/LearnerDashboard';
import MentorDashboard from '../../components/dashboard/MentorDashboard';

const Dashboard = () => {
    const user = localStorage.getItem('userID')
    const role = localStorage.getItem('role')
    const [searchParams, setSearchParams] = useSearchParams();
    const viewParam = searchParams.get('view');

    const [activeView, setActiveView] = React.useState('learner');

    useEffect(() => {
        if (viewParam) {
            setActiveView(viewParam);
        } else if (role === 'mentor') {
            setActiveView('mentor');
        } else {
            setActiveView('learner');
        }
    }, [viewParam, role]);

    const handleViewChange = (view) => {
        setActiveView(view);
        setSearchParams({ view });
    };

    if (!user) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Dashboard</h1>

                {role === 'BOTH' && (
                    <div style={{ display: 'flex', background: 'var(--color-bg-card)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => handleViewChange('learner')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeView === 'learner' ? 'var(--color-primary)' : 'transparent',
                                color: activeView === 'learner' ? 'white' : 'var(--color-text-secondary)',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Learner
                        </button>
                        <button
                            onClick={() => handleViewChange('mentor')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: activeView === 'mentor' ? 'var(--color-primary)' : 'transparent',
                                color: activeView === 'mentor' ? 'white' : 'var(--color-text-secondary)',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Mentor
                        </button>
                    </div>
                )}
            </div>

            {activeView === 'learner' ? <LearnerDashboard /> : <MentorDashboard />}
        </div>
    );
};

export default Dashboard;
