import React, { useState } from 'react';
import styles from './Meetings.module.css';
import Button from '../../components/common/Button/Button';

const Meetings = () => {
    const [activeTab, setActiveTab] = useState('meetings');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState({
        1: [
            { id: 1, sender: 'mentor', text: 'Hi! Looking forward to our session tomorrow.', time: '10:30 AM' },
            { id: 2, sender: 'learner', text: 'Me too! I have some questions prepared.', time: '10:45 AM' },
            { id: 3, sender: 'mentor', text: 'Great! Feel free to share them beforehand if you\'d like.', time: '11:00 AM' }
        ],
        2: [
            { id: 1, sender: 'mentor', text: 'Hello! Ready for our advanced React session?', time: 'Yesterday' }
        ]
    });
    // Mock meetings data
    const upcomingMeetings = [
        {
            id: 1,
            skillTitle: 'Web Development Bootcamp',
            mentorName: 'John Smith',
            mentorAvatar: 'https://i.pravatar.cc/150?img=12',
            date: 'December 10, 2025',
            time: '2:00 PM - 3:00 PM',
            zoomLink: 'https://zoom.us/j/123456789',
            status: 'upcoming'
        },
        {
            id: 2,
            skillTitle: 'Advanced React Patterns',
            mentorName: 'Sarah Johnson',
            mentorAvatar: 'https://i.pravatar.cc/150?img=45',
            date: 'December 12, 2025',
            time: '4:00 PM - 5:30 PM',
            zoomLink: 'https://zoom.us/j/987654321',
            status: 'upcoming'
        }
    ];

    const pastMeetings = [
        {
            id: 3,
            skillTitle: 'Introduction to Python',
            mentorName: 'Ahmed Khan',
            mentorAvatar: 'https://i.pravatar.cc/150?img=33',
            date: 'December 3, 2025',
            time: '10:00 AM - 11:00 AM',
            status: 'completed',
            recordingLink: 'https://zoom.us/rec/123'
        }
    ];

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedMentor) return;
        
        const newMessage = {
            id: Date.now(),
            sender: 'learner',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
            ...prev,
            [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMessage]
        }));
        setMessageInput('');
    };

    const renderMessagesTab = () => {
        const allMentors = [...upcomingMeetings, ...pastMeetings];
        
        return (
            <div className={styles.messagesContainer}>
                {/* Mentor List */}
                <div className={styles.mentorList}>
                    <h3 className={styles.mentorListTitle}>Your Mentors</h3>
                    {allMentors.map((meeting) => (
                        <div
                            key={meeting.id}
                            className={`${styles.mentorListItem} ${selectedMentor?.id === meeting.id ? styles.activeMentor : ''}`}
                            onClick={() => setSelectedMentor(meeting)}
                        >
                            <img src={meeting.mentorAvatar} alt={meeting.mentorName} className={styles.mentorListAvatar} />
                            <div className={styles.mentorListInfo}>
                                <h4>{meeting.mentorName}</h4>
                                <p className={styles.mentorSkill}>{meeting.skillTitle}</p>
                            </div>
                            {messages[meeting.id]?.length > 0 && (
                                <span className={styles.messageCount}>{messages[meeting.id].length}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    {selectedMentor ? (
                        <>
                            <div className={styles.chatHeader}>
                                <img src={selectedMentor.mentorAvatar} alt={selectedMentor.mentorName} className={styles.chatAvatar} />
                                <div>
                                    <h3>{selectedMentor.mentorName}</h3>
                                    <p className={styles.chatSubtitle}>{selectedMentor.skillTitle}</p>
                                </div>
                            </div>

                            <div className={styles.chatMessages}>
                                {messages[selectedMentor.id]?.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.message} ${msg.sender === 'learner' ? styles.messageSent : styles.messageReceived}`}
                                    >
                                        <div className={styles.messageBubble}>
                                            <p>{msg.text}</p>
                                            <span className={styles.messageTime}>{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.chatInput}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className={styles.messageInputField}
                                />
                                <Button onClick={handleSendMessage} variant="primary">
                                    Send
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyChat}>
                            <span className={styles.emptyChatIcon}>💬</span>
                            <p>Select a mentor to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>My Meetings</h1>
                <p className={styles.subtitle}>Manage your Zoom sessions and chat with mentors</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'meetings' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('meetings')}
                >
                    📅 Meetings
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'messages' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    💬 Messages
                </button>
            </div>

            {/* Tab Content */}
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
                        {upcomingMeetings.map((meeting) => (
                            <div key={meeting.id} className={styles.meetingCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.mentorInfo}>
                                        <img 
                                            src={meeting.mentorAvatar} 
                                            alt={meeting.mentorName} 
                                            className={styles.avatar}
                                        />
                                        <div>
                                            <h3 className={styles.skillTitle}>{meeting.skillTitle}</h3>
                                            <p className={styles.mentorName}>with {meeting.mentorName}</p>
                                        </div>
                                    </div>
                                    <span className={styles.statusBadge}>Upcoming</span>
                                </div>

                                <div className={styles.meetingDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>📆</span>
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>🕐</span>
                                        <span>{meeting.time}</span>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => window.open(meeting.zoomLink, '_blank')}
                                    >
                                        Join Zoom Meeting
                                    </Button>
                                    <Button variant="outline">Add to Calendar</Button>
                                </div>
                            </div>
                        ))}
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
                        {pastMeetings.map((meeting) => (
                            <div key={meeting.id} className={`${styles.meetingCard} ${styles.pastCard}`}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.mentorInfo}>
                                        <img 
                                            src={meeting.mentorAvatar} 
                                            alt={meeting.mentorName} 
                                            className={styles.avatar}
                                        />
                                        <div>
                                            <h3 className={styles.skillTitle}>{meeting.skillTitle}</h3>
                                            <p className={styles.mentorName}>with {meeting.mentorName}</p>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles.completedBadge}`}>Completed</span>
                                </div>

                                <div className={styles.meetingDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>📆</span>
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>🕐</span>
                                        <span>{meeting.time}</span>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    {meeting.recordingLink && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => window.open(meeting.recordingLink, '_blank')}
                                        >
                                            View Recording
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
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
        </div>
    );
};

export default Meetings;
