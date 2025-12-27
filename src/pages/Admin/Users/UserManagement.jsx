import React, { useEffect, useState } from 'react';
import { MdDelete, MdCheckCircle, MdCancel, MdEditSquare, MdAttachMoney, MdGavel } from 'react-icons/md';
import styles from './UserManagement.module.css';
import AdminApi from '../../../api/AdminApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState(''); // 'ROLE', 'WALLET', 'SANCTION'

    // Form States
    const [newRole, setNewRole] = useState('LEARNER');
    const [walletAmount, setWalletAmount] = useState(0);
    const [walletType, setWalletType] = useState('CREDIT');
    const [walletReason, setWalletReason] = useState('');
    const [sanctionAction, setSanctionAction] = useState('WARNING');

    const fetchUsers = async () => {
        try {
            const data = await AdminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleVerify = async (id, currentStatus) => {
        try {
            await AdminApi.verifyUser(id, !currentStatus);
            fetchUsers();
        } catch (error) { console.error("Error updating user", error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await AdminApi.deleteUser(id);
            alert("User deleted successfully.");
            fetchUsers();
        } catch (error) {
            console.error(error);
            if (error.response && error.status === 409) {
                // Axios might put status on error object or response object depending on version/config
                // My AdminApi throws request error.
                // Re-checking AdminApi logic: throws error.
                const message = error.response?.data?.message || "User has linked data.";
                if (window.confirm(`${message}\nDo you want to delete relevant bookings reviews and everything else linked with that user?`)) {
                    try {
                        await AdminApi.deleteUser(id, true);
                        alert("User and all linked data deleted.");
                        fetchUsers();
                    } catch (e) {
                        console.error("Force delete failed", e);
                        alert("Failed to delete even with force option.");
                    }
                }
            } else if (error.status === 409) { // Axios sometimes puts status on error root
                const message = error.response?.data?.message || "User has linked data.";
                if (window.confirm(`${message}\nDo you want to delete relevant bookings reviews and everything else linked with that user?`)) {
                    await AdminApi.deleteUser(id, true);
                    alert("User and all linked data deleted.");
                    fetchUsers();
                }
            }
            else {
                alert("Error deleting user: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const openModal = (user, mode) => {
        setSelectedUser(user);
        setModalMode(mode);
        // Reset form defaults
        setNewRole(user.role);
        setWalletAmount(0);
        setSanctionAction('WARNING');
    };

    const submitAction = async () => {
        if (!selectedUser) return;
        try {
            if (modalMode === 'ROLE') {
                await AdminApi.changeRole(selectedUser.userId, newRole);
            } else if (modalMode === 'WALLET') {
                await AdminApi.adjustWallet(selectedUser.userId, parseInt(walletAmount), walletType, walletReason);
            } else if (modalMode === 'SANCTION') {
                await AdminApi.sanctionUser(selectedUser.userId, sanctionAction);
            }

            alert('Action Successful');
            setModalMode('');
            fetchUsers();
        } catch (e) {
            console.error(e);
            alert('Error performing action: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}><h1>User Management</h1></div>
            <div className={styles.tableCard}>
                {loading ? <p>Loading...</p> : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>{user.role}</span></td>
                                    <td>{user.isVerified ? 'Verified' : 'Unverified'} {user.isVerified ? '' : ''}</td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleVerify(user.userId, user.isVerified)} className={styles.iconBtn} title={user.isVerified ? "Unverify" : "Verify"}>
                                            {user.isVerified ? <MdCancel color="orange" /> : <MdCheckCircle color="green" />}
                                        </button>
                                        <button onClick={() => openModal(user, 'ROLE')} className={styles.iconBtn} title="Change Role"><MdEditSquare color="#33b5e5" /></button>
                                        <button onClick={() => openModal(user, 'WALLET')} className={styles.iconBtn} title="Wallet"><MdAttachMoney color="#ffbb33" /></button>
                                        <button onClick={() => openModal(user, 'SANCTION')} className={styles.iconBtn} title="Sanction"><MdGavel color="#cc0000" /></button>
                                        <button onClick={() => handleDelete(user.userId)} className={styles.iconBtn} title="Delete"><MdDelete color="red" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Overlay */}
            {modalMode && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Manage User: {selectedUser?.name}</h3>

                        {modalMode === 'ROLE' && (
                            <div>
                                <label>Select New Role:</label>
                                <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                    <option value="LEARNER">Learner</option>
                                    <option value="MENTOR">Mentor</option>
                                    <option value="BOTH">Both (Mentor & Learner)</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        )}

                        {modalMode === 'WALLET' && (
                            <div className={styles.formGroup}>
                                <select value={walletType} onChange={e => setWalletType(e.target.value)}>
                                    <option value="CREDIT">Credit (Add)</option>
                                    <option value="DEBIT">Debit (Subtract)</option>
                                </select>
                                <input type="number" placeholder="Amount" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} />
                                <input type="text" placeholder="Reason" value={walletReason} onChange={e => setWalletReason(e.target.value)} />
                            </div>
                        )}

                        {modalMode === 'SANCTION' && (
                            <div>
                                <label>Action:</label>
                                <select value={sanctionAction} onChange={e => setSanctionAction(e.target.value)}>
                                    <option value="WARNING">Send Warning</option>
                                    <option value="BAN">Ban / Suspend</option>
                                </select>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button onClick={submitAction} className={styles.saveBtn}>Confirm</button>
                            <button onClick={() => setModalMode('')} className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
