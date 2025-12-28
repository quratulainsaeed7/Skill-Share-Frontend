import React, { useState, useEffect } from 'react';
import styles from './BookingOversight.module.css';

const BookingOversight = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/bookings`);
            const data = await res.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDispute = async (id) => {
        const decision = prompt("Enter resolution decision (e.g. Refunded to Learner):");
        if (!decision) return;

        try {
            await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:4008'}/admin/bookings/${id}/dispute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision })
            });
            alert('Dispute resolved.');
            fetchBookings();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h2>Booking Oversight</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.booking_id}>
                                <td>{booking.booking_id.substring(0, 8)}...</td>
                                <td>
                                    <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleDispute(booking.booking_id)} className={styles.disputeBtn}>Resolve Dispute</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingOversight;
