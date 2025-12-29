import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import lessonService from '../../services/lessonService';
import UserService from '../../services/UserService';
import Button from '../../components/common/Button/Button';
import EnrollmentModal from '../../components/booking/EnrollmentModal/EnrollmentModal';
import ReviewSection from '../../components/reviews/ReviewSection/ReviewSection';
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
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [isMentor, setIsMentor] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        description: '',
        duration: '',
        meetingLink: ''
    });
    const [creatingLesson, setCreatingLesson] = useState(false);
    const [lessonError, setLessonError] = useState(null);

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
                    // Check if current user is the mentor
                    setIsMentor(foundSkill.mentorId === user.userId);

                    // If mentor, fetch lessons
                    if (foundSkill.mentorId === user.userId) {
                        setLoadingLessons(true);
                        try {
                            const skillLessons = await lessonService.getLessonsBySkill(skillId);
                            setLessons(skillLessons);
                        } catch (err) {
                            console.warn('Could not fetch lessons:', err);
                        } finally {
                            setLoadingLessons(false);
                        }
                    } else {
                        // If not mentor, check enrollment
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

        // Open the enrollment modal instead of direct enrollment
        setShowEnrollmentModal(true);
    };

    const handleEnrollmentConfirm = (selectedPlan) => {
        // Enrollment successful callback from modal
        setShowEnrollmentModal(false);
        setEnrollmentSuccess(true);
        setIsEnrolled(true);
        setTimeout(() => {
            navigate('/profile');
        }, 1500);
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

    const handleCreateLesson = async () => {
        if (!lessonForm.description || !lessonForm.duration) {
            setLessonError('Please fill in description and duration');
            return;
        }

        setCreatingLesson(true);
        setLessonError(null);

        try {
            const newLesson = await lessonService.createLesson({
                skillId,
                description: lessonForm.description,
                duration: parseInt(lessonForm.duration),
                meetingLink: lessonForm.meetingLink || undefined
            });

            // Add to lessons list
            setLessons([...lessons, newLesson]);

            // Close modal and reset
            setShowCreateLessonModal(false);
            setLessonForm({ description: '', duration: '', meetingLink: '' });
        } catch (err) {
            console.error('Failed to create lesson:', err);
            setLessonError(err.message || 'Failed to create lesson');
        } finally {
            setCreatingLesson(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) {
            return;
        }

        try {
            await lessonService.deleteLesson(lessonId);
            setLessons(lessons.filter(l => l.lessonId !== lessonId));
        } catch (err) {
            alert(err.message || 'Failed to delete lesson');
        }
    };

    const handleUpdateLessonStatus = async (lessonId, newStatus) => {
        // Prevent changing status if already completed
        const lesson = lessons.find(l => l.lessonId === lessonId);
        if (lesson?.status === 'COMPLETED') {
            alert('Cannot change status of a completed lesson');
            return;
        }

        try {
            const updatedLesson = await lessonService.updateLessonStatus(lessonId, newStatus);
            setLessons(lessons.map(l => l.lessonId === lessonId ? updatedLesson : l));

            // If marking as completed, show confirmation
            if (newStatus === 'COMPLETED') {
                alert('Lesson marked as completed! All associated bookings have been updated.');
            }
        } catch (err) {
            alert(err.message || 'Failed to update lesson status');
        }
    };

    const handleGenerateLink = () => {
        const generatedLink = lessonService.generateMeetingLink(skillId);
        setLessonForm({ ...lessonForm, meetingLink: generatedLink });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!skill) return <div className="error">Skill not found</div>;

    return (
        <div className={styles.pageContainer}>
            {/* Create Lesson Modal */}
            {showCreateLessonModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateLessonModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Create New Lesson</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowCreateLessonModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {lessonError && (
                                <div className={styles.modalError}>
                                    <span>⚠️ {lessonError}</span>
                                </div>
                            )}
                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    placeholder="Enter lesson description"
                                    value={lessonForm.description}
                                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                    className={styles.formTextarea}
                                    rows="4"
                                    disabled={creatingLesson}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="duration">Duration (minutes)</label>
                                <input
                                    id="duration"
                                    type="number"
                                    placeholder="e.g., 60"
                                    value={lessonForm.duration}
                                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                    className={styles.formInput}
                                    disabled={creatingLesson}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="meetingLink">Meeting Link</label>
                                <div className={styles.formRow}>
                                    <input
                                        id="meetingLink"
                                        type="text"
                                        placeholder="Enter meeting link"
                                        value={lessonForm.meetingLink}
                                        onChange={(e) => setLessonForm({ ...lessonForm, meetingLink: e.target.value })}
                                        className={styles.formInput}
                                        disabled={creatingLesson}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleGenerateLink}
                                        disabled={creatingLesson}
                                        style={{ marginLeft: '0.5rem' }}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCreateLessonModal(false);
                                    setLessonError(null);
                                }}
                                disabled={creatingLesson}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateLesson}
                                disabled={creatingLesson}
                            >
                                {creatingLesson ? 'Creating...' : 'Create Lesson'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Modal */}
            {showEnrollmentModal && skill && (
                <EnrollmentModal
                    skill={{
                        ...skill,
                        title: skill.name,
                        image: skill.imageUrl,
                        mentorName: mentor?.name || 'Mentor',
                        priceCash: parseFloat(skill.price),
                        priceCredits: Math.round(parseFloat(skill.price) * 10), // Example: 10 credits per dollar
                        priceType: 'both' // Assume both payment options available
                    }}
                    skillId={skillId}
                    userId={UserService.getUser()?.userId}
                    onClose={() => setShowEnrollmentModal(false)}
                    onEnroll={handleEnrollmentConfirm}
                />
            )}

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

                {/* Lessons List (Mentor Only) */}
                {isMentor && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Manage Lessons</h2>
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateLessonModal(true)}
                            >
                                + Create New Lesson
                            </Button>
                        </div>
                        {loadingLessons ? (
                            <div className={styles.loadingState}>Loading lessons...</div>
                        ) : lessons.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No lessons created yet. Create your first lesson to get started!</p>
                            </div>
                        ) : (
                            <div className={styles.lessonsList}>
                                {lessons.map((lesson) => (
                                    <div key={lesson.lessonId} className={styles.lessonCard}>
                                        <div className={styles.lessonHeader}>
                                            <div className={styles.lessonInfo}>
                                                <h3 className={styles.lessonDescription}>{lesson.description}</h3>
                                                <div className={styles.lessonMeta}>
                                                    <span>⏱️ {lesson.duration} minutes</span>
                                                    <span className={`${styles.statusBadge} ${styles[lesson.status.toLowerCase()]}`}>
                                                        {lesson.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {lesson.meetingLink && (
                                            <div className={styles.lessonLink}>
                                                <strong>Meeting Link:</strong>
                                                <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer">
                                                    {lesson.meetingLink}
                                                </a>
                                            </div>
                                        )}
                                        <div className={styles.lessonActions}>
                                            <select
                                                value={lesson.status}
                                                onChange={(e) => handleUpdateLessonStatus(lesson.lessonId, e.target.value)}
                                                className={styles.statusSelect}
                                                disabled={lesson.status === 'COMPLETED'}
                                                title={lesson.status === 'COMPLETED' ? 'Completed lessons cannot be changed' : ''}
                                            >
                                                <option value="UPCOMING">Upcoming</option>
                                                <option value="ONGOING">Ongoing</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteLesson(lesson.lessonId)}
                                                className={styles.deleteButton}
                                                disabled={lesson.status === 'COMPLETED'}
                                                title={lesson.status === 'COMPLETED' ? 'Completed lessons cannot be deleted' : ''}
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Requirements/Description body if any extra */}
                {/* Reviews */}
                <ReviewSection
                    skillId={skillId}
                    mentorId={skill.mentorId}
                    isEnrolled={isEnrolled}
                />
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

                    {!isMentor && (
                        <>
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
                        </>
                    )}

                    {isMentor && (
                        <div className={styles.mentorBadge}>
                            <p style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                                👨‍🏫 You are the mentor of this skill
                            </p>
                        </div>
                    )}
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
