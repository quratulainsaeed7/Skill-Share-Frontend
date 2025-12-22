// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { skillService } from '../../services/skillService';
import { MdEmail, MdPhone, MdLocationOn, MdSchool, MdWork, MdEdit, MdStar } from 'react-icons/md';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import SkillCard from '../../components/skills/SkillCard/SkillCard';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [taughtCourses, setTaughtCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const isLearner = user?.role === 'learner' || user?.role === 'both';
    const isMentor = user?.role === 'mentor' || user?.role === 'both';

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                if (isLearner) {
                    // Fetch enrolled courses for learners
                    const mockEnrolledCourses = await skillService.getEnrolledCourses(user?.id);
                    setEnrolledCourses(mockEnrolledCourses);

                    // Fetch mentors for enrolled courses
                    const uniqueMentorIds = [...new Set(mockEnrolledCourses.map(course => course.mentorId))];
                    const mentorData = uniqueMentorIds.map(id => ({
                        id,
                        name: mockEnrolledCourses.find(c => c.mentorId === id)?.mentorName,
                        avatar: mockEnrolledCourses.find(c => c.mentorId === id)?.mentorAvatar,
                        specialization: mockEnrolledCourses.find(c => c.mentorId === id)?.category
                    }));
                    setMentors(mentorData);
                }

                if (isMentor) {
                    // Fetch courses taught by mentor
                    const mockTaughtCourses = await skillService.getTaughtCourses(user?.id);
                    setTaughtCourses(mockTaughtCourses);

                    // Fetch students enrolled in mentor's courses
                    const mockStudents = await skillService.getEnrolledStudents(user?.id);
                    setStudents(mockStudents);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user, isLearner, isMentor]);

    if (!user) {
        return (
            <div className={styles.container}>
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.container}>
            {/* User Info Section */}
            <Card className={styles.userInfoCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.userName}>{user.name}</h1>
                        <p className={styles.userRole}>{user.role === 'both' ? 'Learner & Mentor' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                        <Link to="/settings">
                            <Button variant="secondary" size="sm" icon={<MdEdit />}>
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.contactInfo}>
                    <div className={styles.infoItem}>
                        <MdEmail className={styles.icon} />
                        <span>{user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <MdPhone className={styles.icon} />
                        <span>{user.phone}</span>
                    </div>
                    {user.city && (
                        <div className={styles.infoItem}>
                            <MdLocationOn className={styles.icon} />
                            <span>{user.city}</span>
                        </div>
                    )}
                </div>

                {/* Learner Specific Info */}
                {(user.role === 'learner' || user.role === 'both') && user.learnerProfile && (
                    <div className={styles.learnerSection}>
                        {(user.degree || user.institution) && (
                            <div className={styles.academicInfo}>
                                <h3 className={styles.sectionTitle}>Academic Information</h3>
                                <div className={styles.academicGrid}>
                                    {user.degree && (
                                        <div className={styles.infoItem}>
                                            <MdSchool className={styles.icon} />
                                            <span>{user.degree}</span>
                                        </div>
                                    )}
                                    {user.institution && (
                                        <div className={styles.infoItem}>
                                            <MdWork className={styles.icon} />
                                            <span>{user.institution}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {user.learnerProfile.bio && (
                            <div className={styles.bioSection}>
                                <h4>About Me</h4>
                                <p>{user.learnerProfile.bio}</p>
                            </div>
                        )}

                        {user.learnerProfile.goals && (
                            <div className={styles.bioSection}>
                                <h4>Learning Goals</h4>
                                <p>{user.learnerProfile.goals}</p>
                            </div>
                        )}

                        {user.learnerProfile.interests && user.learnerProfile.interests.length > 0 && (
                            <div className={styles.interestsSection}>
                                <h4>Interests</h4>
                                <div className={styles.tags}>
                                    {user.learnerProfile.interests.map((interest, idx) => (
                                        <span key={idx} className={styles.tag}>{interest}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Stats Section */}
            <div className={styles.statsGrid}>
                {isLearner && (
                    <>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{enrolledCourses.length}</div>
                            <div className={styles.statLabel}>Enrolled Courses</div>
                        </Card>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{mentors.length}</div>
                            <div className={styles.statLabel}>Active Mentors</div>
                        </Card>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>
                                {user.learnerProfile?.interests?.length || 0}
                            </div>
                            <div className={styles.statLabel}>Interests</div>
                        </Card>
                    </>
                )}
                {isMentor && (
                    <>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{taughtCourses.length}</div>
                            <div className={styles.statLabel}>Courses Teaching</div>
                        </Card>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{students.length}</div>
                            <div className={styles.statLabel}>Total Students</div>
                        </Card>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>
                                {user.mentorProfile?.skills?.length || 0}
                            </div>
                            <div className={styles.statLabel}>Skills Offered</div>
                        </Card>
                    </>
                )}
                <Card className={styles.statCard}>
                    <div className={styles.statValue}>24</div>
                    <div className={styles.statLabel}>Hours Spent</div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statValue}>12</div>
                    <div className={styles.statLabel}>Completed Sessions</div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statValue}>8</div>
                    <div className={styles.statLabel}>Certificates</div>
                </Card>
            </div>

            {/* Learner: Enrolled Courses Section */}
            {isLearner && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>My Enrolled Courses</h2>
                        <Link to="/skills">
                            <Button variant="secondary" size="sm">Browse More</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading courses...</div>
                    ) : enrolledCourses.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>You haven't enrolled in any courses yet.</p>
                            <Link to="/skills">
                                <Button variant="primary">Explore Skills</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className={styles.coursesGrid}>
                            {enrolledCourses.map(course => (
                                <SkillCard key={course.id} skill={course} viewMode="grid" />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Mentor: Teaching Courses Section */}
            {isMentor && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>My Courses</h2>
                        <Link to="/skills">
                            <Button variant="secondary" size="sm">Create Course</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading courses...</div>
                    ) : taughtCourses.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>You haven't created any courses yet.</p>
                            <Button variant="primary">Create Your First Course</Button>
                        </Card>
                    ) : (
                        <div className={styles.coursesGrid}>
                            {taughtCourses.map(course => (
                                <SkillCard key={course.id} skill={course} viewMode="grid" />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Learner: My Mentors Section */}
            {isLearner && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>My Mentors</h2>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading mentors...</div>
                    ) : mentors.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>You don't have any active mentors yet.</p>
                        </Card>
                    ) : (
                        <div className={styles.mentorsGrid}>
                            {mentors.map(mentor => (
                                <Card key={mentor.id} className={styles.mentorCard}>
                                    <Link to={`/mentors/${mentor.id}`} className={styles.mentorLink}>
                                        <div className={styles.mentorAvatar}>
                                            {mentor.avatar ? (
                                                <img src={mentor.avatar} alt={mentor.name} />
                                            ) : (
                                                <div className={styles.mentorPlaceholder}>
                                                    {getInitials(mentor.name)}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.mentorInfo}>
                                            <h4>{mentor.name}</h4>
                                            <p>{mentor.specialization}</p>
                                            <div className={styles.mentorRating}>
                                                <MdStar className={styles.star} />
                                                <span>4.8</span>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Mentor: My Students Section */}
            {isMentor && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>My Students</h2>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading students...</div>
                    ) : students.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>You don't have any enrolled students yet.</p>
                        </Card>
                    ) : (
                        <div className={styles.mentorsGrid}>
                            {students.map(student => (
                                <Card key={student.id} className={styles.mentorCard}>
                                    <div className={styles.mentorLink}>
                                        <div className={styles.mentorAvatar}>
                                            {student.avatar ? (
                                                <img src={student.avatar} alt={student.name} />
                                            ) : (
                                                <div className={styles.mentorPlaceholder}>
                                                    {getInitials(student.name)}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.mentorInfo}>
                                            <h4>{student.name}</h4>
                                            <p>{student.course}</p>
                                            <div className={styles.studentProgress}>
                                                <span>{student.progress}% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Profile;
