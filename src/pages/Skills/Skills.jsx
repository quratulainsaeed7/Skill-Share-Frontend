// src/pages/Skills/Skills.jsx
import React, { useState, useEffect } from 'react';
import SkillFilter from '../../components/skills/SkillFilter/SkillFilter';
import SkillList from '../../components/skills/SkillList/SkillList';
import { skillService } from '../../services/skillService';
import styles from './Skills.module.css';
import { MdSearch, MdTune, MdClose } from 'react-icons/md';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
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
            {/* Compact Search Header */}
            <div className={styles.searchHeader}>
                <div className={styles.searchWrapper}>
                    <MdSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search skills, mentors, categories..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className={styles.searchInput}
                    />
                    <button 
                        className={styles.filterBtn}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <MdTune />
                        <span>Filters</span>
                    </button>
                </div>
                
                <div className={styles.searchMeta}>
                    <span className={styles.resultsText}>
                        {loading ? 'Searching...' : `${skills.length} results`}
                    </span>
                    <div className={styles.sortOptions}>
                        <button
                            className={`${styles.sortOption} ${filters.sortBy === 'relevance' ? styles.active : ''}`}
                            onClick={() => handleFilterChange('sortBy', 'relevance')}
                        >
                            Most Relevant
                        </button>
                        <button
                            className={`${styles.sortOption} ${filters.sortBy === 'highest_rated' ? styles.active : ''}`}
                            onClick={() => handleFilterChange('sortBy', 'highest_rated')}
                        >
                            Top Rated
                        </button>
                        <button
                            className={`${styles.sortOption} ${filters.sortBy === 'lowest_price' ? styles.active : ''}`}
                            onClick={() => handleFilterChange('sortBy', 'lowest_price')}
                        >
                            Lowest Price
                        </button>
                        <button
                            className={`${styles.sortOption} ${filters.sortBy === 'highest_price' ? styles.active : ''}`}
                            onClick={() => handleFilterChange('sortBy', 'highest_price')}
                        >
                            Highest Price
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className={styles.mainLayout}>
                {/* Filter Sidebar */}
                <aside className={`${styles.filterSidebar} ${showFilters ? styles.open : ''}`}>
                    <div className={styles.filterHeader}>
                        <h2>Filters</h2>
                        <button onClick={() => setShowFilters(false)} className={styles.closeBtn}>
                            <MdClose />
                        </button>
                    </div>
                    <SkillFilter filters={filters} onFilterChange={handleFilterChange} />
                </aside>

                {/* Skills Grid */}
                <main className={styles.skillsMain}>
                    <SkillList
                        skills={skills}
                        loading={loading}
                        onClearFilters={() => handleFilterChange('reset')}
                    />
                </main>
            </div>

            {/* Mobile Overlay */}
            {showFilters && <div className={styles.backdrop} onClick={() => setShowFilters(false)} />}
        </div>
    );
};

export default Skills;
