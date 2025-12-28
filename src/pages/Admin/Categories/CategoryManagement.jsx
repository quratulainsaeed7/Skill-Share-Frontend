import React, { useState, useEffect } from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import styles from './CategoryManagement.module.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', tags: '' });
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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

    const handleSave = async (e) => {
        e.preventDefault();
        const tagsArray = newCategory.tags.split(',').map(t => t.trim());
        try {
            const url = editingCategoryId
                ? `http://localhost:3004/admin/categories/${editingCategoryId}`
                : 'http://localhost:3004/admin/categories';
            const method = editingCategoryId ? 'PATCH' : 'POST';

            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCategory, tags: tagsArray })
            });
            setNewCategory({ name: '', description: '', tags: '' });
            setEditingCategoryId(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (category) => {
        setNewCategory({
            name: category.name,
            description: category.description,
            tags: category.tags ? category.tags.join(', ') : ''
        });
        setEditingCategoryId(category.category_id);
    };

    const handleCancelEdit = () => {
        setNewCategory({ name: '', description: '', tags: '' });
        setEditingCategoryId(null);
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

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <MdArrowDropDown style={{ opacity: 0.3 }} />;
        return sortConfig.direction === 'asc' ? <MdArrowDropUp /> : <MdArrowDropDown />;
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h2>Category Management</h2>

            <div className={styles.createForm}>
                <h3>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSave}>
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
                    <button type="submit">{editingCategoryId ? 'Update Category' : 'Create Category'}</button>
                    {editingCategoryId && (
                        <button type="button" onClick={handleCancelEdit} style={{ background: '#666', marginLeft: '10px' }}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Name {getSortIcon('name')}</div>
                            </th>
                            <th>Description</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCategories.map(cat => (
                            <tr key={cat.category_id}>
                                <td>{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>{cat.tags?.join(', ')}</td>
                                <td>
                                    <button onClick={() => handleEdit(cat)} className={styles.editBtn}>Edit</button>
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
