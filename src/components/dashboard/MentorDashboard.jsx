import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/skillService';
import UserService from '../../services/UserService';

const MentorDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = UserService.getUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.userId) {
                    const students = await skillService.getEnrolledStudents(user.userId);
                    // Map students to booking format
                    setBookings(students.map((student, index) => ({
                        id: student.id || index,
                        student: student.name,
                        course: student.enrolledCourse,
                        date: student.enrolledAt || new Date().toISOString().split('T')[0],
                        status: student.status || 'Confirmed',
                        avatar: student.avatar || `https://i.pravatar.cc/150?u=${student.id}`
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.userId]);

    // Analytics data (would come from a dedicated analytics API in production)
    const analytics = [
        { label: 'Total Students', value: bookings.length, change: '+12%' },
        { label: 'Total Earnings', value: 'PKR 150k', change: '+8%' },
        { label: 'Course Rating', value: '4.8', change: '+0.2' },
        { label: 'Pending Bookings', value: '5', change: '-2' },
    ];

    return (
        <div>
            {/* Analytics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {analytics.map((stat, index) => (
                    <div key={index} style={{
                        padding: '1.5rem',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px'
                    }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: stat.change.startsWith('+') ? 'var(--color-success, #10b981)' : 'var(--color-error)'
                        }}>
                            {stat.change} last month
                        </div>
                    </div>
                ))}
            </div>

            {/* My Bookings / Students */}
            <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>My Bookings</h2>
                <div style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Student</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Course</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '600' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <img src={booking.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                        {booking.student}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{booking.course}</td>
                                    <td style={{ padding: '1rem' }}>{booking.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            backgroundColor: booking.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: booking.status === 'Confirmed' ? '#10b981' : '#f59e0b'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{
                                            padding: '4px 8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'transparent',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: 'var(--text-primary)'
                                        }}>
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
