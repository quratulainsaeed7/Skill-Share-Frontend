// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';

import { SkillApi } from '../../api/SkillApi';
import ProfileService from '../../services/profileService';
import { MdEmail, MdPhone, MdLocationOn, MdSchool, MdWork, MdEdit, MdStar } from 'react-icons/md';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import SkillCard from '../../components/skills/SkillCard/SkillCard';
import styles from './Profile.module.css';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/userService';

const Profile = () => {
    const navigate = useNavigate();
    // Use centralized UserService for basic auth check
    const sessionUser = UserService.getUser();
    const userID = sessionUser?.userId || null;

    // Profile data fetched from ProfileService (API)
    const [profileData, setProfileData] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [taughtCourses, setTaughtCourses] = useState();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // Merge session user with fetched profile data (profile data takes precedence)
    const user = profileData ? { ...sessionUser, ...profileData } : sessionUser;
    const userRole = user?.role || null;
    const isLearner = userRole === 'learner' || userRole === 'LEARNER' || userRole === 'both' || userRole === 'BOTH';
    const isMentor = userRole === 'mentor' || userRole === 'MENTOR' || userRole === 'both' || userRole === 'BOTH';
    const userName = user?.name || null;

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setProfileError(null);

            try {
                // Fetch profile data from ProfileService (API)
                if (userID) {
                    try {
                        const profile = await ProfileService.getUserProfile();
                        setProfileData(profile);

                        // Update session storage with latest profile data
                        if (profile) {
                            UserService.updateStoredUser(profile);
                        }
                    } catch (profileErr) {
                        console.warn('Could not fetch profile from API, using session data:', profileErr.message);
                        // Continue with session data if profile fetch fails
                    }
                }

                // Fetch role-specific data
                if (isLearner && userID) {
                    // Fetch enrolled courses for learners
                    const enrolledCoursesData = await SkillApi.getEnrolledCourses(userID);
                    setEnrolledCourses(enrolledCoursesData);

                    // Fetch mentors for enrolled courses
                    const uniqueMentorIds = [...new Set(enrolledCoursesData.map(course => course.mentorId))];
                    const mentorData = uniqueMentorIds.map(id => ({
                        id,
                        name: enrolledCoursesData.find(c => c.mentorId === id)?.mentorName,
                        avatar: enrolledCoursesData.find(c => c.mentorId === id)?.mentorAvatar,
                        specialization: enrolledCoursesData.find(c => c.mentorId === id)?.category
                    }));
                    setMentors(mentorData);
                }

                if (isMentor && userID) {
                    // Fetch courses taught by mentor - use userID for consistency
                    const taughtCoursesData = await SkillApi.getTaughtCourses(userID);
                    setTaughtCourses(taughtCoursesData);
                    console.log('Taught Courses Data:', taughtCoursesData);

                    // Fetch students enrolled in mentor's courses
                    const studentsData = await SkillApi.getEnrolledStudents(userID);
                    setStudents(studentsData);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
                setProfileError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchUserData();
    }, [isLearner, isMentor, userID]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Helper to format role display text safely
    const formatRole = (role) => {
        if (!role) return 'User';
        const lowerRole = role.toLowerCase();
        if (lowerRole === 'both') return 'Learner & Mentor';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    // Safely handle null user state (no authenticated session)
    if (!sessionUser) {
        return (
            <div className={styles.container}>
                <Card className={styles.userInfoCard}>
                    <p>Please log in to view your profile.</p>
                </Card>
            </div>
        );
    }

    // Show loading state while fetching profile
    if (loading && !user) {
        return (
            <div className={styles.container}>
                <Card className={styles.userInfoCard}>
                    <p>Loading profile...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* User Info Section */}
            <Card className={styles.userInfoCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt={userName || 'User'} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {getInitials(userName)}
                            </div>
                        )}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.userName}>{userName || 'User'}</h1>
                        <p className={styles.userRole}>{formatRole(userRole)}</p>
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
                                            {/* <span>{user.degree}</span> */}
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
                    </>
                )}
                {isMentor && (
                    <>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{taughtCourses?.length || 0}</div>
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
                                <SkillCard key={course.SkillId} skill={course} viewMode="grid" />
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
                        <Button variant="secondary" size="sm" onClick={() => navigate('/create-skill')}>
                            Create Course
                        </Button>
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading courses...</div>
                    ) : taughtCourses.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>You haven't created any courses yet.</p>
                            <Button variant="primary" onClick={() => navigate('/create-skill')}>
                                Create Your First Course
                            </Button>
                        </Card>
                    ) : (
                        <div className={styles.coursesGrid}>
                            {taughtCourses.map(course => (
                                <SkillCard key={course.skillId} skill={course} viewMode="grid" />
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
