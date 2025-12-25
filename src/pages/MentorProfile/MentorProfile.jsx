import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { skillService } from '../../services/skillService';
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

                // Fetch courses taught by this mentor
                const courses = await skillService.getTaughtCourses(mentorId);

                if (courses && courses.length > 0) {
                    const firstCourse = courses[0];
                    setMentor({
                        id: firstCourse.mentorId,
                        name: firstCourse.mentorName,
                        avatar: firstCourse.mentorAvatar,
                        bio: firstCourse.mentorBio || 'Expert Mentor',
                        role: 'Senior Instructor',
                        totalStudents: courses.reduce((acc, curr) => acc + (curr.studentsCount || curr.lectures || 0), 0),
                        reviews: courses.reduce((acc, curr) => acc + (curr.reviewsCount || 0), 0),
                        rating: (courses.reduce((acc, curr) => acc + (curr.rating || 0), 0) / courses.length).toFixed(1)
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
                <img src={mentor.avatar} alt={mentor.name} className={styles.avatar} />
                <div className={styles.info}>
                    <h1 className={styles.name}>{mentor.name}</h1>
                    <div className={styles.role}>{mentor.role}</div>
                    <p className={styles.bio}>{mentor.bio}</p>

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
                    <SkillCard key={course.id} skill={course} />
                ))}
            </div>
        </div>
    );
};

export default MentorProfile;
