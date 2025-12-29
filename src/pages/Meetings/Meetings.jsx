import React, { useState, useEffect } from 'react';
import styles from './Meetings.module.css';
import Button from '../../components/common/Button/Button';
import UserService from '../../services/UserService';
import bookingService from '../../services/bookingService';
import messageService from '../../services/messageService';
import lessonService from '../../services/lessonService';

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
        lessonId: '',
        date: '',
        startTime: '',
        endTime: ''
    });
    const [schedulingMeeting, setSchedulingMeeting] = useState(false);
    const [scheduleError, setScheduleError] = useState(null);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [loadingLessons, setLoadingLessons] = useState(false);

    // Backend data states
    const [upcomingMeetings, setUpcomingMeetings] = useState([]);
    const [pastMeetings, setPastMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageError, setMessageError] = useState(null);

    // Messaging contacts state
    const [contacts, setContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [contactsError, setContactsError] = useState(null);

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

                // Determine role for fetching bookings
                const role = (userRole === 'both' || userRole === 'mentor') ? 'mentor' : 'learner';
                
                console.log('Fetching bookings for userId:', userId, 'role:', role);

                // Fetch upcoming and past bookings
                const [upcoming, past] = await Promise.all([
                    bookingService.getUpcomingBookings(userId, role),
                    bookingService.getPastBookings(userId, role)
                ]);

                console.log('Upcoming bookings:', upcoming);
                console.log('Past bookings:', past);

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

    // Fetch contacts for messaging based on role
    useEffect(() => {
        const fetchContacts = async () => {
            if (!userId || !userRole) return;

            try {
                setLoadingContacts(true);
                setContactsError(null);

                let contactList = [];

                if (userRole === 'mentor' || userRole === 'both') {
                    // Mentor: Get all enrolled students
                    const { skillService } = await import('../../services/skillService');
                    const UserApi = (await import('../../api/UserApi')).default;

                    const enrollments = await skillService.getEnrolledStudents(userId);

                    // Get unique student IDs
                    const studentIds = [...new Set(enrollments.map(e => e.userId))];

                    // Fetch student details
                    const studentsData = await Promise.all(
                        studentIds.map(async (studentId) => {
                            try {
                                const student = await UserApi.getUserById(studentId);
                                const enrollment = enrollments.find(e => e.userId === studentId);
                                return {
                                    userId: studentId,
                                    name: student.name,
                                    email: student.email,
                                    avatar: student.avatar,
                                    skillId: enrollment?.skillId,
                                    enrolledAt: enrollment?.enrolledAt
                                };
                            } catch (err) {
                                console.error(`Failed to fetch student ${studentId}:`, err);
                                return null;
                            }
                        })
                    );

                    contactList = studentsData.filter(s => s !== null);
                } else {
                    // Learner: Get all mentors from enrolled courses
                    const { skillService } = await import('../../services/skillService');
                    const UserApi = (await import('../../api/UserApi')).default;

                    const enrolledCourses = await skillService.getEnrolledCourses(userId);

                    // Get unique mentor IDs
                    const mentorIds = [...new Set(enrolledCourses.map(course => course.mentorId))];

                    // Fetch mentor details
                    const mentorsData = await Promise.all(
                        mentorIds.map(async (mentorId) => {
                            try {
                                const mentor = await UserApi.getUserById(mentorId);
                                const courses = enrolledCourses.filter(c => c.mentorId === mentorId);
                                return {
                                    userId: mentorId,
                                    name: mentor.name,
                                    email: mentor.email,
                                    avatar: mentor.avatar,
                                    skills: courses.map(c => ({ id: c.skillId, name: c.name }))
                                };
                            } catch (err) {
                                console.error(`Failed to fetch mentor ${mentorId}:`, err);
                                return null;
                            }
                        })
                    );

                    contactList = mentorsData.filter(m => m !== null);
                }

                setContacts(contactList);
            } catch (err) {
                console.error('Failed to fetch contacts:', err);
                setContactsError(err.message || 'Failed to load contacts');
            } finally {
                setLoadingContacts(false);
            }
        };

        fetchContacts();
    }, [userId, userRole]);

    // Fetch lessons when schedule modal opens
    useEffect(() => {
        const fetchLessons = async () => {
            if (!showScheduleModal || !userId) return;

            try {
                setLoadingLessons(true);
                const { skillService } = await import('../../services/skillService');
                
                // Get skills taught by this mentor
                const skills = await skillService.getTaughtCourses(userId);
                console.log('Mentor skills:', skills);
                
                // Fetch lessons for all skills
                const allLessons = [];
                for (const skill of skills) {
                    const lessons = await lessonService.getLessonsBySkill(skill.skillId);
                    console.log(`Lessons for skill ${skill.name}:`, lessons);
                    allLessons.push(...lessons.map(lesson => ({
                        ...lesson,
                        skillName: skill.name
                    })));
                }
                
                console.log('All available lessons:', allLessons);
                setAvailableLessons(allLessons);
            } catch (err) {
                console.error('Failed to fetch lessons:', err);
                setAvailableLessons([]);
            } finally {
                setLoadingLessons(false);
            }
        };

        fetchLessons();
    }, [showScheduleModal, userId]);

    // Load conversation when contact is selected
    useEffect(() => {
        const loadConversation = async () => {
            if (!selectedMentor || !userId) return;

            const otherUserId = selectedMentor.userId;

            // Check if conversation already loaded
            if (conversations[otherUserId]) return;

            try {
                const messages = await messageService.getConversation({
                    senderId: userId,
                    receiverId: otherUserId
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
    }, [selectedMentor, userId]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedMentor || !userId) return;

        const otherUserId = selectedMentor.userId;

        setSendingMessage(true);
        setMessageError(null);

        try {
            await messageService.sendMessage({
                senderId: userId,
                receiverId: otherUserId,
                content: messageInput.trim()
            });

            // Reload conversation
            const messages = await messageService.getConversation({
                senderId: userId,
                receiverId: otherUserId
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
        if (!scheduleForm.lessonId || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime) {
            setScheduleError('Please fill in all fields');
            return;
        }

        setSchedulingMeeting(true);
        setScheduleError(null);

        try {
            // Schedule bulk meeting for all enrolled students
            const createdBookings = await bookingService.scheduleBulkMeeting({
                mentorId: userId,
                lessonId: scheduleForm.lessonId,
                bookingDate: scheduleForm.date,
                startTime: scheduleForm.startTime,
                endTime: scheduleForm.endTime
            });

            console.log(`Successfully scheduled meeting for ${createdBookings.length} students`);

            // Close modal and reset form
            setShowScheduleModal(false);
            setScheduleForm({
                lessonId: '',
                date: '',
                startTime: '',
                endTime: ''
            });
            setScheduleError(null);

            // Refresh bookings
            const role = (userRole === 'both' || userRole === 'mentor') ? 'mentor' : 'learner';
            const [upcoming, past] = await Promise.all([
                bookingService.getUpcomingBookings(userId, role),
                bookingService.getPastBookings(userId, role)
            ]);
            setUpcomingMeetings(upcoming);
            setPastMeetings(past);
        } catch (err) {
            console.error('Failed to schedule meeting:', err);
            setScheduleError(err.message || 'Failed to schedule meeting. Please try again.');
        } finally {
            setSchedulingMeeting(false);
        }
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

    const getStatusDisplay = (status) => {
        const statusMap = {
            'PENDING': 'Pending',
            'ACCEPTED': 'Confirmed',
            'REJECTED': 'Rejected',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'PENDING': styles.pendingBadge,
            'ACCEPTED': styles.acceptedBadge,
            'REJECTED': styles.rejectedBadge,
            'CANCELLED': styles.cancelledBadge,
            'COMPLETED': styles.completedBadge
        };
        return classMap[status] || '';
    };

    const renderMessagesTab = () => {
        return (
            <div className={styles.messagesContainer}>
                {/* Contact List */}
                <div className={styles.mentorList}>
                    <h3 className={styles.mentorListTitle}>
                        {userRole === 'learner' ? 'Your Mentors' : 'Your Students'}
                    </h3>
                    {loadingContacts ? (
                        <div className={styles.loadingState}>Loading contacts...</div>
                    ) : contactsError ? (
                        <div className={styles.emptyContacts}>
                            <p>{contactsError}</p>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className={styles.emptyContacts}>
                            <p>{userRole === 'learner' ? 'Enroll in courses to chat with mentors' : 'No students enrolled in your courses yet'}</p>
                        </div>
                    ) : (
                        contacts.map((contact) => {
                            const messageCount = conversations[contact.userId]?.length || 0;

                            return (
                                <div
                                    key={contact.userId}
                                    className={`${styles.mentorListItem} ${selectedMentor?.userId === contact.userId ? styles.activeMentor : ''}`}
                                    onClick={() => setSelectedMentor(contact)}
                                >
                                    <img
                                        src={contact.avatar || 'https://i.pravatar.cc/150'}
                                        alt={contact.name || 'User'}
                                        className={styles.mentorListAvatar}
                                    />
                                    <div className={styles.mentorListInfo}>
                                        <h4>{contact.name || 'Unknown User'}</h4>
                                        <p className={styles.mentorSkill}>
                                            {userRole === 'learner'
                                                ? (contact.skills?.[0]?.name || 'Course')
                                                : (contact.email || 'Student')}
                                        </p>
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
                                    src={selectedMentor.avatar || 'https://i.pravatar.cc/150'}
                                    alt={selectedMentor.name || 'User'}
                                    className={styles.chatAvatar}
                                />
                                <div>
                                    <h3>{selectedMentor.name || 'Unknown User'}</h3>
                                    <p className={styles.chatSubtitle}>
                                        {userRole === 'learner'
                                            ? (selectedMentor.skills?.[0]?.name || 'Mentor')
                                            : (selectedMentor.email || 'Student')}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.chatMessages}>
                                {(() => {
                                    const msgs = conversations[selectedMentor.userId] || [];

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
                                                key={msg.messageId || msg.id}
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
                            {scheduleError && (
                                <div className={styles.modalError}>
                                    <span>⚠️ {scheduleError}</span>
                                </div>
                            )}
                            <div className={styles.formGroup}>
                                <label htmlFor="lessonId">Lesson Description</label>
                                <select
                                    id="lessonId"
                                    value={scheduleForm.lessonId}
                                    onChange={(e) => handleScheduleFormChange('lessonId', e.target.value)}
                                    className={styles.formInput}
                                    disabled={schedulingMeeting || loadingLessons || availableLessons.length === 0}
                                >
                                    <option value="">
                                        {loadingLessons 
                                            ? 'Loading lessons...' 
                                            : availableLessons.length === 0 
                                            ? 'No lessons available - Create lessons first'
                                            : 'Select a lesson'}
                                    </option>
                                    {availableLessons.map((lesson) => (
                                        <option key={lesson.lessonId} value={lesson.lessonId}>
                                            {lesson.description} ({lesson.duration} min)
                                        </option>
                                    ))}
                                </select>
                                <small className={styles.formHint}>
                                    {availableLessons.length === 0 
                                        ? 'Please create lessons for your skills before scheduling meetings'
                                        : 'Schedule a session for this specific lesson'}
                                </small>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="date">Meeting Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={(e) => handleScheduleFormChange('date', e.target.value)}
                                    className={styles.formInput}
                                    disabled={schedulingMeeting}
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
                                        disabled={schedulingMeeting}
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
                                        disabled={schedulingMeeting}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowScheduleModal(false);
                                    setScheduleError(null);
                                }}
                                disabled={schedulingMeeting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleScheduleMeeting}
                                disabled={schedulingMeeting}
                            >
                                {schedulingMeeting ? 'Scheduling...' : 'Schedule Meeting'}
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
                                                        <span className={`${styles.statusBadge} ${getStatusClass(meeting.status)}`}>
                                                            {getStatusDisplay(meeting.status)}
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

                                                    {meeting.meetingLink && (
                                                        <div className={styles.meetingLinkContainer}>
                                                            <span className={styles.detailIcon}>🔗</span>
                                                            <a
                                                                href={meeting.meetingLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.meetingLink}
                                                            >
                                                                {meeting.meetingLink}
                                                            </a>
                                                        </div>
                                                    )}

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
                                                        {meeting.meetingLink ? (
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => window.open(meeting.meetingLink, '_blank')}
                                                            >
                                                                Join Meeting
                                                            </Button>
                                                        ) : (
                                                            <Button variant="primary" disabled>
                                                                No Meeting Link
                                                            </Button>
                                                        )}
                                                        {meeting.status === 'PENDING' && userRole === 'mentor' && (
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
                                                        {meeting.status === 'ACCEPTED' && userRole === 'mentor' && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={async () => {
                                                                    if (window.confirm('Mark this booking as completed?')) {
                                                                        try {
                                                                            await bookingService.completeBooking(meeting.bookingId);
                                                                            window.location.reload();
                                                                        } catch (err) {
                                                                            alert(err.message);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                Mark Complete
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
                                                        <span className={`${styles.statusBadge} ${getStatusClass(meeting.status)}`}>
                                                            {getStatusDisplay(meeting.status)}
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
                                                        {meeting.status === 'COMPLETED' && (
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
