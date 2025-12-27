import React, { useState, useEffect } from 'react';
import styles from './CategoryManagement.module.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', tags: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:3004/admin/categories');
            const data = await res.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const tagsArray = newCategory.tags.split(',').map(t => t.trim());
        try {
            await fetch('http://localhost:3004/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCategory, tags: tagsArray })
            });
            setNewCategory({ name: '', description: '', tags: '' });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`http://localhost:3004/admin/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h2>Category Management</h2>

            <div className={styles.createForm}>
                <h3>Add New Category</h3>
                <form onSubmit={handleCreate}>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newCategory.description}
                        onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={newCategory.tags}
                        onChange={e => setNewCategory({ ...newCategory, tags: e.target.value })}
                    />
                    <button type="submit">Create Category</button>
                </form>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.category_id}>
                                <td>{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>{cat.tags?.join(', ')}</td>
                                <td>
                                    <button onClick={() => handleDelete(cat.category_id)} className={styles.deleteBtn}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagement;
