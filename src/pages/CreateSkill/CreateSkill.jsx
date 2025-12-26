// src/pages/CreateSkill/CreateSkill.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { SkillApi } from '../../api/SkillApi';
import UserService from '../../services/UserService';
import styles from './CreateSkill.module.css';

const CreateSkill = () => {
    const navigate = useNavigate();
    const user = UserService.getUser();
    const mentorId = user?.userId;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        mode: 'ONLINE',
        location: '',
        price: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await SkillApi.getCategories();
                setCategories(data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.name || !formData.description || !formData.categoryId || !formData.price) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Prepare data for API
            const skillData = {
                mentorId: mentorId,
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                mode: formData.mode,
                location: formData.mode !== 'ONLINE' ? formData.location : null,
                price: parseFloat(formData.price),
                imageUrl: formData.imageUrl || null,
                isActive: true,
            };

            // Call API to create skill
            const result = await SkillApi.createSkill(skillData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (err) {
            console.error('Failed to create skill:', err);
            setError(err.message || 'Failed to create skill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className={styles.createSkillContainer}>
            <div className={styles.content}>
                <h1 className={styles.title}>Create a New Skill</h1>
                <p className={styles.subtitle}>Share your knowledge and expertise with learners</p>

                <Card className={styles.formCard}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.successMessage}>
                            Skill created successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Skill Name <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="e.g., Advanced React Development"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>
                                Description <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="Describe what learners will gain from this skill..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="categoryId" className={styles.label}>
                                    Category <span className={styles.required}>*</span>
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className={styles.select}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="mode" className={styles.label}>
                                    Mode <span className={styles.required}>*</span>
                                </label>
                                <select
                                    id="mode"
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className={styles.select}
                                    required
                                >
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {formData.mode !== 'ONLINE' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="location" className={styles.label}>
                                    Location {formData.mode === 'OFFLINE' && <span className={styles.required}>*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="e.g., New York, NY"
                                    required={formData.mode === 'OFFLINE'}
                                />
                            </div>
                        )}

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="price" className={styles.label}>
                                    Price ($) <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="imageUrl" className={styles.label}>
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Skill'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateSkill;
