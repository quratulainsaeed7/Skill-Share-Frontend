// src/components/skills/SkillCard/SkillCard.jsx
import React from 'react';
import { MdStar, MdLocationOn, MdVideocam } from 'react-icons/md';
import styles from './SkillCard.module.css';
import { Link } from 'react-router-dom';
import UserService from '../../../services/UserService';

const SkillCard = ({ skill }) => {
    const {
        skillId,
        name,
        mentorName,
        mentorAvatar,
        mentorId,
        category,
        rating,
        reviewsCount,
        location,
        mode,
        price,
        imageUrl,
        description,
        progress,
        completedLessons,
        totalLessons,
        isEnrolled
    } = skill;
    
    // Get current user
    const currentUser = UserService.getUser();
    const isCurrentUserMentor = currentUser?.userId === mentorId;
    
    // Only show progress for enrolled learners, not for mentors or non-enrolled users
    const showProgress = isEnrolled && totalLessons > 0 && !isCurrentUserMentor;

    return (
        <Link to={`/skills/${skillId}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={imageUrl} alt={name} className={styles.image} />
                <div className={styles.categoryTag}>{category?.name || 'Uncategorized'}</div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>{name}</h3>
                {showProgress && (
                    <div className={styles.progressSection}>
                        <span className={styles.progressText}>
                            {completedLessons}/{totalLessons} lessons
                        </span>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${progress}%` }}
                            ></div>
                            {/* Lesson segment dividers */}
                            {totalLessons > 1 && Array.from({ length: totalLessons - 1 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={styles.progressDivider}
                                    style={{ left: `${((index + 1) / totalLessons) * 100}%` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.cardFooter}>
                    <div className={styles.meta}>
                        {rating && (
                            <div className={styles.rating}>
                                <MdStar />
                                <span>{rating}</span>
                            </div>
                        )}
                        {mode && (
                            <div className={styles.mode}>
                                <MdVideocam />
                                <span>{mode}</span>
                            </div>
                        )}
                    </div>
                    
                    {price && (
                        <div className={styles.price}>
                            ${parseFloat(price).toFixed(0)}
                            <span>/hr</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default SkillCard;
