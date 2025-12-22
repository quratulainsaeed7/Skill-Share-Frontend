import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SKILLS } from '../../mock/skills';
import Button from '../../components/common/Button/Button';
import EnrollmentModal from '../../components/booking/EnrollmentModal/EnrollmentModal';
import styles from './SkillDetails.module.css';

const SkillDetails = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const foundSkill = MOCK_SKILLS.find(s => s.id === skillId);
            setSkill(foundSkill);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [skillId]);

    const handleEnrollClick = () => {
        setShowEnrollmentModal(true);
    };

    const handleEnrollConfirm = (selectedPlan) => {
        // Close the modal
        setShowEnrollmentModal(false);
        
        // Navigate to meetings page after successful enrollment
        setTimeout(() => {
            navigate('/meetings');
        }, 500);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!skill) return <div className="error">Skill not found</div>;

    return (
        <div className={styles.pageContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Hero Section */}
                <div className={styles.hero}>
                    <div className={styles.breadcrumbs}>
                        {skill.category} &gt; {skill.subcategory}
                    </div>
                    <h1 className={styles.title}>{skill.title}</h1>
                    <p className={styles.subtitle}>{skill.description}</p>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span>⭐</span> {skill.rating} ({skill.reviewsCount} ratings)
                        </div>
                        <div className={styles.metaItem}>
                            <span>👨‍🎓</span> {skill.lectures || 20} students
                        </div>
                        <div className={styles.metaItem}>
                            <span>🕒</span> {skill.duration}
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        Created by <strong>{skill.mentorName}</strong>
                    </div>
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
                    <img src={skill.image} alt={skill.title} className={styles.previewImage} />
                    <div className={styles.prceBlock}>
                        <div className={styles.priceLarge}>Rs. {skill.priceCash}</div>
                        {skill.priceType === 'both' && (
                            <div className={styles.credits}>or {skill.priceCredits} Credits</div>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className={styles.enrollButton}
                        onClick={handleEnrollClick}
                    >
                        Enroll Now
                    </Button>

                    <p className={styles.guarantee}>30-Day Money-Back Guarantee</p>
                </div>

                {/* Mentor Card */}
                <div className={styles.mentorCard}>
                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem' }}>About the Mentor</h3>
                    <div className={styles.mentorHeader} onClick={() => navigate(`/mentors/${skill.mentorId || '1'}`)}>
                        <img src={skill.mentorAvatar} alt={skill.mentorName} className={styles.mentorAvatar} />
                        <div className={styles.mentorInfo}>
                            <h3>{skill.mentorName}</h3>
                            <span className={styles.mentorRole}>Mentor</span>
                        </div>
                    </div>
                    <p className={styles.mentorBio}>{skill.mentorBio || 'Passionate educator and industry expert.'}</p>
                    <Button
                        variant="outline"
                        className={styles.viewProfileBtn}
                        onClick={() => navigate(`/mentors/${skill.mentorId || '1'}`)}
                    >
                        View Profile
                    </Button>
                </div>
            </div>

            {/* Enrollment Modal */}
            {showEnrollmentModal && (
                <EnrollmentModal 
                    skill={skill}
                    onClose={() => setShowEnrollmentModal(false)}
                    onEnroll={handleEnrollConfirm}
                />
            )}
        </div>
    );
};

export default SkillDetails;
