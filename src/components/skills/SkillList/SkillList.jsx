// src/components/skills/SkillList/SkillList.jsx
import React from 'react';
import SkillCard from '../SkillCard/SkillCard';
import styles from './SkillList.module.css';
import { MdSearchOff } from 'react-icons/md';
import Button from '../../common/Button/Button';

const SkillList = ({ skills, viewMode, loading, onClearFilters }) => {
    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading skills...</div>;
    }

    if (skills.length === 0) {
        return (
            <div className={styles.noResults}>
                <MdSearchOff className={styles.icon} />
                <h2>No skills found</h2>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={onClearFilters}>Clear Filters</Button>
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? styles.grid : styles.list}>
            {skills.map(skill => (
                <SkillCard key={skill.id} skill={skill} viewMode={viewMode} />
            ))}
        </div>
    );
};

export default SkillList;
