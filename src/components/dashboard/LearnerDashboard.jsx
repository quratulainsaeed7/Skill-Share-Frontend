import React, { useState, useEffect } from 'react';
import SkillCard from '../skills/SkillCard/SkillCard';
import { skillService } from '../../services/skillService';
import UserService from '../../services/UserService';
import Button from '../common/Button/Button';

const LearnerDashboard = () => {
    const [activeCourses, setActiveCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = UserService.getUser();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (user?.userId) {
                    const enrolled = await skillService.getEnrolledCourses(user.userId);
                    // Split courses by progress (completed = 100%)
                    const active = enrolled.filter(c => (c.progress || 0) < 100);
                    const completed = enrolled.filter(c => (c.progress || 0) >= 100);
                    setActiveCourses(active);
                    setCompletedCourses(completed);
                }
            } catch (error) {
                console.error('Failed to fetch enrolled courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user?.userId]);

    if (loading) {
        return <div>Loading your courses...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Active Courses</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {activeCourses.map(course => (
                        <div key={course.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <SkillCard skill={course} />
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderTop: 'none',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                                marginTop: '-12px', // Pull up to connect with card
                                paddingTop: '20px',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>60% Complete</span>
                                    <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>Continue Learning →</span>
                                </div>
                                <div style={{ background: 'var(--color-divider)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '60%', height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Completed Courses</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {completedCourses.map(course => (
                        <div key={course.id} style={{ opacity: 0.8 }}>
                            <SkillCard skill={course} />
                            <Button variant="outline" size="sm" fullWidth style={{ marginTop: '1rem' }}>Download Certificate</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearnerDashboard;
