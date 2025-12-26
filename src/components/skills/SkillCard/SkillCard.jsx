// src/components/skills/SkillCard/SkillCard.jsx
import React from 'react';
import { MdStar, MdLocationOn, MdComputer } from 'react-icons/md';
import Button from '../../common/Button/Button';
import styles from './SkillCard.module.css';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill, viewMode = 'grid' }) => {
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
        <div className={clsx(styles.card, { [styles.listView]: viewMode === 'list' })}>
            <div className={styles.imageContainer}>
                <span className={styles.categoryBadge}>{category?.name || 'Uncategorized'}</span>
                <img src={imageUrl} alt={name} className={styles.image} />
                <Link to={`/skills/${skillId}`} className={styles.overlay}>
                    View Details
                </Link>
            </div>

            <div className={styles.content}>
                <div>
                    <Link to={`/skills/${skillId}`}>
                        <h3 className={styles.title}>{name}</h3>
                    </Link>
                    {rating && (
                        <div className={styles.rating}>
                            <MdStar className={styles.star} />
                            <span>{rating}</span>
                            <span>({reviewsCount || 0})</span>
                        </div>
                    )}
                </div>

                {viewMode === 'list' && <p className={styles.description}>{description}</p>}

                {mentorName && (
                    <div className={styles.mentorInfo}>
                        {mentorAvatar && <img src={mentorAvatar} alt={mentorName} className={styles.avatar} />}
                        <span>{mentorName}</span>
                    </div>
                )}

                <div className={styles.meta}>
                    {location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MdLocationOn /> {location}
                        </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdComputer /> {mode}
                    </span>
                </div>

                <div className={styles.priceContainer}>
                    {price && (
                        <div className={styles.price}>
                            ${parseFloat(price).toLocaleString()} <span className={styles.priceText}>/hr</span>
                        </div>
                    )}
                </div>

                <div className={styles.viewButton}>
                    <Link to={`/skills/${skillId}`}>
                        <Button variant="outline" fullWidth size="sm">View Details</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
