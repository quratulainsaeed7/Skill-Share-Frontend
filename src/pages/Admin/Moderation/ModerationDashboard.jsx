import React, { useState, useEffect } from 'react';
import styles from './ModerationDashboard.module.css';

const ModerationDashboard = () => {
    const [stats, setStats] = useState({ skills: [], reviews: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/moderation`);
            const data = await res.json();
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = async (type, id, action) => {
        try {
            await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/moderation/${id}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: type === 'skill' ? 'SKILL' : 'REVIEW', action })
            });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h2>Content Moderation</h2>

            <div className={styles.section}>
                <h3>Flagged Skills</h3>
                {stats.skills.length === 0 ? <p>No flagged skills.</p> : (
                    <div className={styles.list}>
                        {stats.skills.map(item => (
                            <div key={item.skill_id} className={styles.card}>
                                <h4>{item.name}</h4>
                                <div className={styles.actions}>
                                    <button onClick={() => handleAction('skill', item.skill_id, 'APPROVE')} className={styles.approveBtn}>Safe</button>
                                    <button onClick={() => handleAction('skill', item.skill_id, 'REJECT')} className={styles.rejectBtn}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h3>Flagged Reviews</h3>
                {stats.reviews.length === 0 ? <p>No flagged reviews.</p> : (
                    <div className={styles.list}>
                        {stats.reviews.map(item => (
                            <div key={item.review_id} className={styles.card}>
                                <p>"{item.comment}" - Rating: {item.rating}</p>
                                <div className={styles.actions}>
                                    <button onClick={() => handleAction('review', item.review_id, 'APPROVE')} className={styles.approveBtn}>Safe</button>
                                    <button onClick={() => handleAction('review', item.review_id, 'REJECT')} className={styles.rejectBtn}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModerationDashboard;
