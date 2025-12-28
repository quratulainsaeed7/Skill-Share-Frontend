import React, { useState, useEffect } from 'react';
import styles from './Meetings.module.css';
import Button from '../../components/common/Button/Button';
import UserService from '../../services/userService';
import bookingService from '../../services/bookingService';
import messageService from '../../services/messageService';

const Meetings = () => {
    const currentUser = UserService.getUser();
    const userId = currentUser?.userId;
    const userRole = currentUser?.role?.toLowerCase();

    const [activeTab, setActiveTab] = useState('meetings');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [conversations, setConversations] = useState({});
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({
        skillId: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    // Backend data states
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [pastMeetings, setPastMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageError, setMessageError] = useState(null);

    // Fetch bookings on mount
    useEffect(() => {
        const fetchBookings = async () => {
            if (!userId || !userRole) {
                setError('Please login to view your meetings');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const role = userRole === 'both' ? 'learner' : userRole;

                // Fetch upcoming and past bookings
                const [upcoming, past] = await Promise.all([
                    bookingService.getUpcomingBookings(userId, role),
                    bookingService.getPastBookings(userId, role)
                ]);

                setUpcomingMeetings(upcoming);
                setPastMeetings(past);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError(err.message || 'Failed to load your meetings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId, userRole]);

    // Load conversation when mentor is selected
    useEffect(() => {
        const loadConversation = async () => {
            if (!selectedMentor || !userId) return;

            const otherUserId = userRole === 'learner'
                ? selectedMentor.mentorId
                : selectedMentor.learnerId;

            // Check if conversation already loaded
            if (conversations[otherUserId]) return;

            try {
                const messages = await messageService.getConversation({
                    senderId: parseInt(userId),
                    receiverId: parseInt(otherUserId),
                    bookingId: selectedMentor.bookingId ? parseInt(selectedMentor.bookingId) : undefined
                });

                setConversations(prev => ({
                    ...prev,
                    [otherUserId]: messages
                }));
            } catch (err) {
                console.error('Failed to load conversation:', err);
                setConversations(prev => ({
                    ...prev,
                    [otherUserId]: []
                }));
            }
        };

        loadConversation();
    }, [selectedMentor, userId, userRole]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedMentor || !userId) return;

        const otherUserId = userRole === 'learner'
            ? selectedMentor.mentorId
            : selectedMentor.learnerId;

        setSendingMessage(true);
        setMessageError(null);

        try {
            await messageService.sendMessage({
                senderId: parseInt(userId),
                receiverId: parseInt(otherUserId),
                content: messageInput.trim(),
                bookingId: selectedMentor.bookingId ? parseInt(selectedMentor.bookingId) : undefined
            });

            // Reload conversation
            const messages = await messageService.getConversation({
                senderId: parseInt(userId),
                receiverId: parseInt(otherUserId),
                bookingId: selectedMentor.bookingId ? parseInt(selectedMentor.bookingId) : undefined
            });

            setConversations(prev => ({
                ...prev,
                [otherUserId]: messages
            }));

            setMessageInput('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessageError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleScheduleMeeting = async () => {
        // Empty function call - no backend integration yet
        console.log('Schedule meeting called with:', scheduleForm);
        // TODO: Implement API call to schedule meeting for all students enrolled in the skill
        // await bookingService.scheduleMeeting(scheduleForm);
        
        // Close modal and reset form
        setShowScheduleModal(false);
        setScheduleForm({
            skillId: '',
            date: '',
            startTime: '',
            endTime: ''
        });
    };

    const handleScheduleFormChange = (field, value) => {
        setScheduleForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (startTime, endTime) => {
        return `${startTime} - ${endTime}`;
    };

    const renderMessagesTab = () => {
        const allContacts = [...upcomingMeetings, ...pastMeetings];

        return (
            <div className={styles.messagesContainer}>
                {/* Contact List */}
                <div className={styles.mentorList}>
                    <h3 className={styles.mentorListTitle}>
                        {userRole === 'learner' ? 'Your Mentors' : 'Your Learners'}
                    </h3>
                    {loading ? (
                        <div className={styles.loadingState}>Loading contacts...</div>
                    ) : allContacts.length === 0 ? (
                        <div className={styles.emptyContacts}>
                            <p>No active bookings to chat about</p>
                        </div>
                    ) : (
                        allContacts.map((contact) => {
                            const otherUserId = userRole === 'learner' ? contact.mentorId : contact.learnerId;
                            const otherUserName = userRole === 'learner' ? contact.mentorName : contact.learnerName;
                            const otherUserAvatar = userRole === 'learner' ? contact.mentorAvatar : contact.learnerAvatar;
                            const messageCount = conversations[otherUserId]?.length || 0;

                            return (
                                <div
                                    key={contact.bookingId}
                                    className={`${styles.mentorListItem} ${selectedMentor?.bookingId === contact.bookingId ? styles.activeMentor : ''}`}
                                    onClick={() => setSelectedMentor(contact)}
                                >
                                    <img
                                        src={otherUserAvatar || 'https://i.pravatar.cc/150'}
                                        alt={otherUserName || 'User'}
                                        className={styles.mentorListAvatar}
                                    />
                                    <div className={styles.mentorListInfo}>
                                        <h4>{otherUserName || 'Unknown User'}</h4>
                                        <p className={styles.mentorSkill}>{contact.skillTitle || 'No title'}</p>
                                    </div>
                                    {messageCount > 0 && (
                                        <span className={styles.messageCount}>{messageCount}</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    {selectedMentor ? (
                        <>
                            <div className={styles.chatHeader}>
                                <img
                                    src={(userRole === 'learner' ? selectedMentor.mentorAvatar : selectedMentor.learnerAvatar) || 'https://i.pravatar.cc/150'}
                                    alt={(userRole === 'learner' ? selectedMentor.mentorName : selectedMentor.learnerName) || 'User'}
                                    className={styles.chatAvatar}
                                />
                                <div>
                                    <h3>{(userRole === 'learner' ? selectedMentor.mentorName : selectedMentor.learnerName) || 'Unknown User'}</h3>
                                    <p className={styles.chatSubtitle}>{selectedMentor.skillTitle || 'No title'}</p>
                                </div>
                            </div>

                            <div className={styles.chatMessages}>
                                {(() => {
                                    const otherUserId = userRole === 'learner' ? selectedMentor.mentorId : selectedMentor.learnerId;
                                    const msgs = conversations[otherUserId] || [];

                                    if (msgs.length === 0) {
                                        return (
                                            <div className={styles.emptyMessages}>
                                                <p>No messages yet. Start the conversation!</p>
                                            </div>
                                        );
                                    }

                                    return msgs.map((msg) => {
                                        const isSent = msg.sender?.userId === userId;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`${styles.message} ${isSent ? styles.messageSent : styles.messageReceived}`}
                                            >
                                                <div className={styles.messageBubble}>
                                                    <p>{msg.content}</p>
                                                    <span className={styles.messageTime}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>

                            {messageError && (
                                <div className={styles.messageError}>
                                    <span>⚠️ {messageError}</span>
                                </div>
                            )}

                            <div className={styles.chatInput}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                                    disabled={sendingMessage}
                                    className={styles.messageInputField}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    variant="primary"
                                    disabled={sendingMessage || !messageInput.trim()}
                                >
                                    {sendingMessage ? 'Sending...' : 'Send'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyChat}>
                            <span className={styles.emptyChatIcon}>💬</span>
                            <p>Select a contact to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Meetings</h1>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'meetings' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('meetings')}
                        >
                            Meetings
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'messages' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            Messages
                        </button>
                    </div>
                </div>
                {activeTab === 'meetings' && (userRole === 'mentor' || userRole === 'both') && (
                    <Button 
                        variant="primary" 
                        onClick={() => setShowScheduleModal(true)}
                        className={styles.scheduleButton}
                    >
                        + Schedule Meeting
                    </Button>
                )}
            </div>

            {/* Schedule Meeting Modal */}
            {showScheduleModal && (
                <div className={styles.modalOverlay} onClick={() => setShowScheduleModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Schedule New Meeting</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowScheduleModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label htmlFor="skillId">Skill ID</label>
                                <input
                                    id="skillId"
                                    type="text"
                                    placeholder="Enter skill ID"
                                    value={scheduleForm.skillId}
                                    onChange={(e) => handleScheduleFormChange('skillId', e.target.value)}
                                    className={styles.formInput}
                                />
                                <small className={styles.formHint}>All students enrolled in this skill will receive the meeting</small>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="date">Meeting Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={(e) => handleScheduleFormChange('date', e.target.value)}
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="startTime">Start Time</label>
                                    <input
                                        id="startTime"
                                        type="time"
                                        value={scheduleForm.startTime}
                                        onChange={(e) => handleScheduleFormChange('startTime', e.target.value)}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="endTime">End Time</label>
                                    <input
                                        id="endTime"
                                        type="time"
                                        value={scheduleForm.endTime}
                                        onChange={(e) => handleScheduleFormChange('endTime', e.target.value)}
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowScheduleModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleScheduleMeeting}
                            >
                                Schedule Meeting
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loader}></div>
                    <p>Loading your meetings...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className={styles.errorContainer}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Retry
                    </Button>
                </div>
            )}

            {/* Tab Content */}
            {!loading && !error && (
                <>
                    {activeTab === 'messages' ? (
                        renderMessagesTab()
                    ) : (
                        <>
                            {/* Upcoming Meetings */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <span className={styles.icon}>📅</span>
                                    Upcoming Meetings
                                </h2>
                                {upcomingMeetings.length > 0 ? (
                                    <div className={styles.meetingsGrid}>
                                        {upcomingMeetings.map((meeting) => {
                                            const otherUserName = userRole === 'learner' ? meeting.mentorName : meeting.learnerName;
                                            const otherUserAvatar = userRole === 'learner' ? meeting.mentorAvatar : meeting.learnerAvatar;

                                            return (
                                                <div key={meeting.bookingId} className={styles.meetingCard}>
                                                    <div className={styles.cardHeader}>
                                                        <div className={styles.mentorInfo}>
                                                            <img
                                                                src={otherUserAvatar || 'https://i.pravatar.cc/150'}
                                                                alt={otherUserName || 'User'}
                                                                className={styles.avatar}
                                                            />
                                                            <div>
                                                                <h3 className={styles.skillTitle}>{meeting.skillTitle || 'Untitled Session'}</h3>
                                                                <p className={styles.mentorName}>
                                                                    {userRole === 'learner' ? 'with ' : 'student: '}{otherUserName || 'Unknown User'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={styles.statusBadge}>
                                                            {meeting.status === 'pending' ? 'Pending' : 'Confirmed'}
                                                        </span>
                                                    </div>

                                                    <div className={styles.meetingDetails}>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>📆</span>
                                                            <span>{formatDate(meeting.bookingDate)}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>🕐</span>
                                                            <span>{formatTime(meeting.startTime, meeting.endTime)}</span>
                                                        </div>
                                                        {meeting.totalLessons && (
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailIcon}>📊</span>
                                                                <span>Progress: {meeting.completedLessons || 0}/{meeting.totalLessons}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {meeting.totalLessons && (
                                                        <div className={styles.progressContainer}>
                                                            <div className={styles.progressBar}>
                                                                <div 
                                                                    className={styles.progressFill}
                                                                    style={{ 
                                                                        width: `${((meeting.completedLessons || 0) / meeting.totalLessons) * 100}%` 
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className={styles.progressText}>
                                                                {Math.round(((meeting.completedLessons || 0) / meeting.totalLessons) * 100)}% Complete
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className={styles.actions}>
                                                        <Button variant="primary" onClick={() => alert('Zoom integration coming soon!')}>
                                                            Join Meeting
                                                        </Button>
                                                        {meeting.status === 'pending' && userRole === 'mentor' && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={async () => {
                                                                    try {
                                                                        await bookingService.acceptBooking(meeting.bookingId);
                                                                        window.location.reload();
                                                                    } catch (err) {
                                                                        alert(err.message);
                                                                    }
                                                                }}
                                                            >
                                                                Accept
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <span className={styles.emptyIcon}>📭</span>
                                        <p>No upcoming meetings scheduled</p>
                                    </div>
                                )}
                            </section>

                            {/* Past Meetings */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    <span className={styles.icon}>🕒</span>
                                    Past Meetings
                                </h2>
                                {pastMeetings.length > 0 ? (
                                    <div className={styles.meetingsGrid}>
                                        {pastMeetings.map((meeting) => {
                                            const otherUserName = userRole === 'learner' ? meeting.mentorName : meeting.learnerName;
                                            const otherUserAvatar = userRole === 'learner' ? meeting.mentorAvatar : meeting.learnerAvatar;

                                            return (
                                                <div key={meeting.bookingId} className={`${styles.meetingCard} ${styles.pastCard}`}>
                                                    <div className={styles.cardHeader}>
                                                        <div className={styles.mentorInfo}>
                                                            <img
                                                                src={otherUserAvatar || 'https://i.pravatar.cc/150'}
                                                                alt={otherUserName || 'User'}
                                                                className={styles.avatar}
                                                            />
                                                            <div>
                                                                <h3 className={styles.skillTitle}>{meeting.skillTitle || 'Untitled Session'}</h3>
                                                                <p className={styles.mentorName}>
                                                                    {userRole === 'learner' ? 'with ' : 'student: '}{otherUserName || 'Unknown User'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`${styles.statusBadge} ${styles.completedBadge}`}>
                                                            {meeting.status === 'completed' ? 'Completed' : meeting.status}
                                                        </span>
                                                    </div>

                                                    <div className={styles.meetingDetails}>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>📆</span>
                                                            <span>{formatDate(meeting.bookingDate)}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>🕐</span>
                                                            <span>{formatTime(meeting.startTime, meeting.endTime)}</span>
                                                        </div>
                                                        {meeting.totalLessons && (
                                                            <div className={styles.detailItem}>
                                                                <span className={styles.detailIcon}>📊</span>
                                                                <span>Progress: {meeting.completedLessons || 0}/{meeting.totalLessons}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {meeting.totalLessons && (
                                                        <div className={styles.progressContainer}>
                                                            <div className={styles.progressBar}>
                                                                <div 
                                                                    className={styles.progressFill}
                                                                    style={{ 
                                                                        width: `${((meeting.completedLessons || 0) / meeting.totalLessons) * 100}%` 
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className={styles.progressText}>
                                                                {Math.round(((meeting.completedLessons || 0) / meeting.totalLessons) * 100)}% Complete
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className={styles.actions}>
                                                        {meeting.status === 'completed' && (
                                                            <Button variant="outline" onClick={() => alert('Review feature coming soon!')}>
                                                                Leave Review
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <span className={styles.emptyIcon}>📭</span>
                                        <p>No past meetings</p>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Meetings;
