// src/pages/Skills/Skills.jsx
import React, { useState, useEffect } from 'react';
import SkillFilter from '../../components/skills/SkillFilter/SkillFilter';
import SkillList from '../../components/skills/SkillList/SkillList';
import Input from '../../components/common/Input/Input';
import { skillService } from '../../services/skillService';
import styles from './Skills.module.css';
import { MdGridView, MdViewList } from 'react-icons/md';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        search: '',
        categories: [],
        mode: 'all',
        city: '',
        priceTypes: [],
        priceRange: [0, 10000],
        minRating: 0,
        sortBy: 'relevance'
    });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.search]);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const data = await skillService.getSkills({ ...filters, search: debouncedSearch });
            setSkills(data);
        } catch (error) {
            console.error("Failed to fetch skills", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, [debouncedSearch, filters.categories, filters.mode, filters.city, filters.priceTypes, filters.minRating, filters.sortBy]);


    const handleFilterChange = (key, value) => {
        if (key === 'reset') {
            setFilters({
                search: '',
                categories: [],
                mode: 'all',
                city: '',
                priceTypes: [],
                priceRange: [0, 10000],
                minRating: 0,
                sortBy: 'relevance'
            });
        } else {
            setFilters(prev => ({ ...prev, [key]: value }));
        }
    };

    return (
        <div className={styles.container}>
            <SkillFilter filters={filters} onFilterChange={handleFilterChange} />

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <Input
                            placeholder="Search skills, mentors, or categories..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.controls}>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', marginRight: '1rem' }}
                        >
                            <option value="relevance">Relevance</option>
                            <option value="highest_rated">Highest Rated</option>
                            <option value="lowest_price">Lowest Price</option>
                            <option value="highest_price">Highest Price</option>
                        </select>

                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <MdGridView />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <MdViewList />
                            </button>
                        </div>
                    </div>
                </div>

                <SkillList
                    skills={skills}
                    viewMode={viewMode}
                    loading={loading}
                    onClearFilters={() => handleFilterChange('reset')}
                />
            </div>
        </div>
    );
};

export default Skills;
