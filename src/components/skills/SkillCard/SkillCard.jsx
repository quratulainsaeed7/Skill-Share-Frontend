// src/components/skills/SkillCard/SkillCard.jsx
import React from 'react';
import { MdStar, MdLocationOn, MdVideocam } from 'react-icons/md';
import styles from './SkillCard.module.css';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill }) => {
    const {
        skillId,
        name,
        mentorName,
        mentorAvatar,
        category,
        rating,
        reviewsCount,
        location,
        mode,
        price,
        imageUrl,
        description
    } = skill;

    return (
        <Link to={`/skills/${skillId}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={imageUrl} alt={name} className={styles.image} />
                <div className={styles.categoryTag}>{category?.name || 'Uncategorized'}</div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>{name}</h3>
                
                <div className={styles.mentor}>
                    {mentorAvatar && (
                        <img src={mentorAvatar} alt={mentorName} className={styles.mentorAvatar} />
                    )}
                    <span className={styles.mentorName}>{mentorName}</span>
                </div>

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
