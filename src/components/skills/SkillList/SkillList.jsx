// src/components/skills/SkillList/SkillList.jsx
import React from 'react';
import SkillCard from '../SkillCard/SkillCard';
import styles from './SkillList.module.css';
import { MdSearchOff } from 'react-icons/md';

const SkillList = ({ skills, loading, onClearFilters }) => {
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Finding the best skills for you...</p>
            </div>
        );
    }

    if (skills.length === 0) {
        return (
            <div className={styles.empty}>
                <MdSearchOff />
                <h3>No skills found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={onClearFilters} className={styles.clearBtn}>
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {skills.map(skill => (
                <SkillCard key={skill.skillId} skill={skill} />
            ))}
        </div>
    );
};

export default SkillList;
