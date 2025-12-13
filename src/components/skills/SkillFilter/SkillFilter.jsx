// src/components/skills/SkillFilter/SkillFilter.jsx
import React, { useState } from 'react';
import styles from './SkillFilter.module.css';
import Button from '../../common/Button/Button';
import { CATEGORIES } from '../../../mock/skills';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const SkillFilter = ({ filters, onFilterChange }) => {
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (catName) => {
        setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
    };

    const handleCheckboxChange = (type, value) => {
        let newValues;
        if (type === 'categories') {
            // Logic for multi-select
            const current = filters.categories || [];
            if (current.includes(value)) {
                newValues = current.filter(v => v !== value);
            } else {
                newValues = [...current, value];
            }
        } else if (type === 'priceTypes') {
            const current = filters.priceTypes || [];
            if (current.includes(value)) {
                newValues = current.filter(v => v !== value);
            } else {
                newValues = [...current, value];
            }
        }

        onFilterChange(type, newValues);
    };

    const handleRadioChange = (type, value) => {
        onFilterChange(type, value);
    };

    return (
        <aside className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => onFilterChange('reset')}>Clear</Button>
            </div>

            {/* Categories */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Categories</div>
                <div className={styles.checkboxGroup}>
                    {CATEGORIES.map(cat => (
                        <div key={cat.name}>
                            <div className={styles.accordionHeader} onClick={() => toggleCategory(cat.name)}>
                                <span>{cat.name}</span>
                                {expandedCategories[cat.name] ? <MdExpandLess /> : <MdExpandMore />}
                            </div>

                            {expandedCategories[cat.name] && (
                                <div className={styles.accordionContent}>
                                    {cat.subcategories.map(sub => (
                                        <label key={sub} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={filters.categories?.includes(sub)}
                                                onChange={() => handleCheckboxChange('categories', sub)}
                                            />
                                            {sub}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mode */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Mode</div>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="mode"
                            checked={!filters.mode || filters.mode === 'all'}
                            onChange={() => handleRadioChange('mode', 'all')}
                        />
                        All Modes
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="mode"
                            checked={filters.mode === 'online'}
                            onChange={() => handleRadioChange('mode', 'online')}
                        />
                        Online Only
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="mode"
                            checked={filters.mode === 'in-person'}
                            onChange={() => handleRadioChange('mode', 'in-person')}
                        />
                        In-Person Only
                    </label>
                </div>
            </div>

            {/* City - Only if In-Person */}
            {(filters.mode === 'in-person' || !filters.mode || filters.mode === 'all') && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>City</div>
                    <select
                        style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                        value={filters.city || ''}
                        onChange={(e) => onFilterChange('city', e.target.value)}
                    >
                        <option value="">All Cities</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>
                </div>
            )}

            {/* Price Type */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Price Type</div>
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.priceTypes?.includes('cash')}
                            onChange={() => handleCheckboxChange('priceTypes', 'cash')}
                        />
                        Cash Payments
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={filters.priceTypes?.includes('credits')}
                            onChange={() => handleCheckboxChange('priceTypes', 'credits')}
                        />
                        Time Credits
                    </label>
                </div>
            </div>

        </aside>
    );
};

export default SkillFilter;
