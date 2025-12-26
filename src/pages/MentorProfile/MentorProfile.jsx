import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import UserService from '../../services/UserService';
import SkillCard from '../../components/skills/SkillCard/SkillCard';
import styles from './MentorProfile.module.css';

const MentorProfile = () => {
    const { mentorId } = useParams();
    const [mentor, setMentor] = useState(null);
    const [mentorCourses, setMentorCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentorData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch mentor user data
                const mentorData = await UserService.getUserById(mentorId);

                // Fetch courses taught by this mentor
                const courses = await skillService.getTaughtCourses(mentorId);

                // Fetch enrolled students for this mentor
                const students = await skillService.getEnrolledStudents(mentorId);

                if (mentorData) {
                    setMentor({
                        id: mentorData.userId,
                        name: mentorData.name,
                        avatar: mentorData.avatar,
                        bio: mentorData.bio || 'Expert Mentor',
                        email: mentorData.email,
                        phone: mentorData.phone,
                        city: mentorData.city,
                        role: 'Mentor',
                        totalStudents: students?.length || 0,
                        reviews: courses.reduce((acc, curr) => acc + (curr.reviewsCount || 0), 0),
                        rating: courses.length > 0
                            ? (courses.reduce((acc, curr) => acc + (curr.rating || 0), 0) / courses.length).toFixed(1)
                            : '0.0'
                    });
                    setMentorCourses(courses);
                }
            } catch (err) {
                console.error('Failed to fetch mentor data:', err);
                setError(err.message || 'Failed to load mentor profile');
            } finally {
                setLoading(false);
            }
        };

        fetchMentorData();
    }, [mentorId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!mentor) return <div>Mentor not found</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.profileHeader}>
                {mentor.avatar && <img src={mentor.avatar} alt={mentor.name} className={styles.avatar} />}
                <div className={styles.info}>
                    <h1 className={styles.name}>{mentor.name}</h1>
                    <div className={styles.role}>{mentor.role}</div>
                    <p className={styles.bio}>{mentor.bio}</p>

                    {(mentor.email || mentor.phone || mentor.city) && (
                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            {mentor.email && <div style={{ marginBottom: '0.5rem' }}>📧 {mentor.email}</div>}
                            {mentor.phone && <div style={{ marginBottom: '0.5rem' }}>📱 {mentor.phone}</div>}
                            {mentor.city && <div>📍 {mentor.city}</div>}
                        </div>
                    )}

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{mentor.rating}</span>
                            <span className={styles.statLabel}>Rating</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{mentor.reviews}</span>
                            <span className={styles.statLabel}>Reviews</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{mentor.totalStudents}</span>
                            <span className={styles.statLabel}>Students</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{mentorCourses.length}</span>
                            <span className={styles.statLabel}>Courses</span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Courses by {mentor.name}</h2>
            <div className={styles.coursesGrid}>
                {mentorCourses.map(course => (
                    <SkillCard key={course.skillId} skill={course} />
                ))}
            </div>
        </div>
    );
};

export default MentorProfile;
