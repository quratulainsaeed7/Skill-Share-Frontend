import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import UserService from '../../services/UserService';
import Button from '../../components/common/Button/Button';
import styles from './SkillDetails.module.css';

const SkillDetails = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(false);

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                setLoading(true);
                setError(null);
                const foundSkill = await skillService.getSkillById(skillId);
                setSkill(foundSkill);

                // Fetch mentor details if mentorId exists
                if (foundSkill?.mentorId) {
                    try {
                        const mentorData = await UserService.getUserById(foundSkill.mentorId);
                        setMentor(mentorData);
                    } catch (mentorErr) {
                        console.warn('Could not fetch mentor details:', mentorErr);
                    }
                }

                // Check enrollment status
                const user = UserService.getUser();
                if (user?.userId) {
                    setCheckingEnrollment(true);
                    try {
                        const enrolledCourses = await skillService.getEnrolledCourses(user.userId);
                        const enrolled = enrolledCourses.some(course => course.skillId === skillId);
                        setIsEnrolled(enrolled);
                    } catch (err) {
                        console.warn('Could not check enrollment status:', err);
                    } finally {
                        setCheckingEnrollment(false);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch skill:', err);
                setError(err.message || 'Failed to load skill details');
            } finally {
                setLoading(false);
            }
        };

        fetchSkill();
    }, [skillId]);

    const handleEnroll = async () => {
        const user = UserService.getUser();
        if (!user || !user.userId) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        setEnrollmentError(null);

        try {
            await skillService.enrollInSkill(skillId, user.userId);
            setEnrollmentSuccess(true);
            setIsEnrolled(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            console.error('Enrollment failed:', err);
            setEnrollmentError(err.message || 'Failed to enroll in the skill');
        } finally {
            setEnrolling(false);
        }
    };

    const handleUnenroll = async () => {
        const user = UserService.getUser();
        if (!user || !user.userId) {
            navigate('/login');
            return;
        }

        if (!window.confirm('Are you sure you want to unenroll? You may be eligible for a refund if within 30 days.')) {
            return;
        }

        setEnrolling(true);
        setEnrollmentError(null);

        try {
            const result = await skillService.unenrollFromSkill(skillId, user.userId);
            setIsEnrolled(false);
            const message = result.refunded
                ? `Successfully unenrolled! You've been refunded ${result.refundAmount} credits.`
                : 'Successfully unenrolled. No refund available (enrolled more than 30 days ago).';
            alert(message);
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err) {
            console.error('Unenrollment failed:', err);
            setEnrollmentError(err.message || 'Failed to unenroll from the skill');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!skill) return <div className="error">Skill not found</div>;

    return (
        <div className={styles.pageContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Hero Section */}
                <div className={styles.hero}>
                    <div className={styles.breadcrumbs}>
                        {skill.category?.name} &gt;
                    </div>
                    <h1 className={styles.title}>{skill.name}</h1>
                    <p className={styles.subtitle}>{skill.description}</p>

                    <div className={styles.meta}>
                        {skill.rating && (
                            <div className={styles.metaItem}>
                                <span>⭐</span> {skill.rating} ({skill.reviewsCount || 0} ratings)
                            </div>
                        )}
                        <div className={styles.metaItem}>
                            <span>👨‍🎓</span> {skill.lectures || 0} students
                        </div>
                        {skill.duration && (
                            <div className={styles.metaItem}>
                                <span>🕒</span> {skill.duration}
                            </div>
                        )}
                    </div>

                    {mentor && (
                        <div className={styles.metaItem}>
                            Created by <strong>{mentor.name || 'Mentor'}</strong>
                        </div>
                    )}
                </div>

                {/* What you'll learn */}
                {skill.learnings && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>What you'll learn</h2>
                        <div className={styles.learningsGrid}>
                            {skill.learnings.map((item, index) => (
                                <div key={index} className={styles.learningItem}>
                                    <span className={styles.checkIcon}>✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                {skill.content && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Course Content</h2>
                        <div className={styles.contentList}>
                            {skill.content.map((module, index) => (
                                <div key={index} className={styles.moduleItem}>
                                    <div className={styles.moduleHeader}>
                                        <span className={styles.moduleTitle}>{module.title}</span>
                                        <span className={styles.moduleMeta}>{module.lessons.length} lessons • {module.duration}</span>
                                    </div>
                                    {/* Could be expandable, simple list for now */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requirements/Description body if any extra */}
                {/* Reviews */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Reviews</h2>
                    <div className={styles.reviewsList}>
                        {/* Mock Reviews Data - ideally passed or fetched */}
                        {[
                            { id: 1, user: 'Ahmed K.', rating: 5, date: '2 days ago', text: 'This course was absolutely amazing! The instructor explains everything so clearly.' },
                            { id: 2, user: 'Sarah L.', rating: 4, date: '1 week ago', text: 'Great content, but I wish there were more practice exercises.' },
                            { id: 3, user: 'Bilal M.', rating: 5, date: '2 weeks ago', text: 'Best investment for my career. Highly recommended!' }
                        ].map(review => (
                            <div key={review.id} className={styles.reviewItem}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.reviewUser}>
                                        <div className={styles.reviewAvatar}>{review.user[0]}</div>
                                        <div>
                                            <span className={styles.reviewName}>{review.user}</span>
                                            <div className={styles.reviewMeta}>
                                                <span className={styles.reviewStars}>{'⭐'.repeat(review.rating)}</span>
                                                <span className={styles.reviewDate}>{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.reviewText}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
                {/* Price Card */}
                <div className={styles.priceCard}>
                    <img src={skill.imageUrl} alt={skill.name} className={styles.previewImage} />
                    <div className={styles.priceBlock}>
                        <div className={styles.priceLarge}>${parseFloat(skill.price).toLocaleString()}</div>
                    </div>

                    {enrollmentSuccess && (
                        <div style={{ padding: '0.75rem', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                            Enrolled successfully! Redirecting...
                        </div>
                    )}

                    {enrollmentError && (
                        <div style={{ padding: '0.75rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                            {enrollmentError}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        size="lg"
                        className={styles.enrollButton}
                        onClick={isEnrolled ? handleUnenroll : handleEnroll}
                        disabled={enrolling || enrollmentSuccess || checkingEnrollment}
                    >
                        {checkingEnrollment ? 'Checking...' :
                            enrolling ? (isEnrolled ? 'Unenrolling...' : 'Enrolling...') :
                                enrollmentSuccess ? 'Enrolled!' :
                                    isEnrolled ? 'Unenroll' : 'Enroll Now'}
                    </Button>

                    <p className={styles.guarantee}>30-Day Money-Back Guarantee</p>
                </div>

                {/* Mentor Card */}
                <div className={styles.mentorCard}>
                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem' }}>About the Mentor</h3>
                    {mentor ? (
                        <>
                            <div className={styles.mentorHeader} onClick={() => navigate(`/mentors/${skill.mentorId}`)}>
                                {mentor.avatar && <img src={mentor.avatar} alt={mentor.name} className={styles.mentorAvatar} />}
                                <div className={styles.mentorInfo}>
                                    <h3>{mentor.name}</h3>
                                    <span className={styles.mentorRole}>Mentor</span>
                                </div>
                            </div>
                            <div className={styles.mentorBio}>
                                {mentor.email && <div style={{ marginBottom: '0.5rem' }}>📧 {mentor.email}</div>}
                                {mentor.phone && <div style={{ marginBottom: '0.5rem' }}>📱 {mentor.phone}</div>}
                                {mentor.city && <div>📍 {mentor.city}</div>}
                            </div>
                            <Button
                                variant="outline"
                                className={styles.viewProfileBtn}
                                onClick={() => navigate(`/mentors/${skill.mentorId}`)}
                            >
                                View Profile
                            </Button>
                        </>
                    ) : (
                        <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading mentor details...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillDetails;
