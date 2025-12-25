// src/components/skills/SkillCard/SkillCard.jsx
import React from 'react';
import { MdStar, MdLocationOn, MdComputer } from 'react-icons/md';
import Button from '../../common/Button/Button';
import styles from './SkillCard.module.css';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill, viewMode = 'grid' }) => {
    const {
        id,
        title,
        mentorName,
        mentorAvatar,
        category,
        rating,
        reviewsCount,
        city,
        mode,
        priceCash,
        priceCredits,
        image,
        description
    } = skill;

    return (
        <div className={clsx(styles.card, { [styles.listView]: viewMode === 'list' })}>
            <div className={styles.imageContainer}>
                <span className={styles.categoryBadge}>{category}</span>
                <img src={image} alt={title} className={styles.image} />
                <Link to={`/skills/${id}`} className={styles.overlay}>
                    View Details
                </Link>
            </div>

            <div className={styles.content}>
                <div>
                    <Link to={`/skills/${id}`}>
                        <h3 className={styles.title}>{title}</h3>
                    </Link>
                    <div className={styles.rating}>
                        <MdStar className={styles.star} />
                        <span>{rating}</span>
                        <span>({reviewsCount})</span>
                    </div>
                </div>

                {viewMode === 'list' && <p className={styles.description}>{description}</p>}

                <div className={styles.mentorInfo}>
                    <img src={mentorAvatar} alt={mentorName} className={styles.avatar} />
                    <span>{mentorName}</span>
                </div>

                <div className={styles.meta}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdLocationOn /> {city}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MdComputer /> {mode}
                    </span>
                </div>

                <div className={styles.priceContainer}>
                    {priceCash && (
                        <div className={styles.price}>
                            PKR {priceCash.toLocaleString()} <span className={styles.priceText}>/hr</span>
                        </div>
                    )}
                    {priceCredits && (
                        <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                            {priceCredits} Credits <span className={styles.priceText}>/hr</span>
                        </div>
                    )}
                </div>

                <div className={styles.viewButton}>
                    <Link to={`/skills/${id}`}>
                        <Button variant="outline" fullWidth size="sm">View Details</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
