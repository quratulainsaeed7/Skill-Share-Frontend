// src/components/auth/ProfileSetup/ProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Card from '../../common/Card/Card';
import styles from './ProfileSetup.module.css';
import clsx from 'clsx';

const INTERESTS_LIST = [
    'Web Development', 'Mobile Development', 'Data Science', 'Graphic Design',
    'UI/UX Design', 'Digital Marketing', 'English Language', 'Urdu Language',
    'Business', 'Mathematics', 'Physics', 'Chemistry'
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfileSetup = () => {
    const { user, completeProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('learner'); // 'learner' | 'mentor'

    // Separate state for learner and mentor profiles
    const [learnerProfile, setLearnerProfile] = useState({
        bio: '',
        interests: [],
        goals: '',
        degree: '',
        institution: '',
    });

    const [mentorProfile, setMentorProfile] = useState({
        bio: '',
        experience: '',
        skills: [], // { name, proficiency, years }
        hourlyRate: '',
        availability: [] // 'Mon-Morning'
    });

    if (!user) return null;

    const isLearner = user.role === 'learner' || user.role === 'both';
    const isMentor = user.role === 'mentor' || user.role === 'both';
    const isBoth = user.role === 'both';

    // Initialize tab based on role
    React.useEffect(() => {
        if (!isBoth) {
            setActiveTab(user.role);
        }
    }, [user.role, isBoth]);


    const handleInterestToggle = (interest) => {
        setLearnerProfile(prev => {
            const exists = prev.interests.includes(interest);
            if (exists) return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            if (prev.interests.length >= 10) return prev;
            return { ...prev, interests: [...prev.interests, interest] };
        });
    };

    const handleSkillToggle = (skillName) => {
        setMentorProfile(prev => {
            const exists = prev.skills.find(s => s.name === skillName);
            if (exists) {
                return { ...prev, skills: prev.skills.filter(s => s.name !== skillName) };
            }
            if (prev.skills.length >= 15) return prev;
            return { ...prev, skills: [...prev.skills, { name: skillName, proficiency: 'Intermediate', years: 1 }] };
        });
    };

    const updateSkillDetail = (skillName, field, value) => {
        setMentorProfile(prev => ({
            ...prev,
            skills: prev.skills.map(s => s.name === skillName ? { ...s, [field]: value } : s)
        }));
    };

    const toggleAvailability = (day, slot) => {
        const id = `${day}-${slot}`;
        setMentorProfile(prev => {
            const exists = prev.availability.includes(id);
            if (exists) return { ...prev, availability: prev.availability.filter(a => a !== id) };
            return { ...prev, availability: [...prev.availability, id] };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const profileData = {};
            if (isLearner) profileData.learnerProfile = learnerProfile;
            if (isMentor) profileData.mentorProfile = mentorProfile;

            await completeProfile(profileData);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderLearnerForm = () => (
        <div className={styles.grid}>
            <div className={styles.fullWidth}>
                <Input
                    label="Bio"
                    as="textarea"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={learnerProfile.bio}
                    onChange={e => setLearnerProfile({ ...learnerProfile, bio: e.target.value })}
                />
            </div>
            <div className={styles.halfWidth}>
                <Input
                    label="Current Degree/Level of Study"
                    placeholder="e.g., Bachelor's in Computer Science, High School, etc."
                    value={learnerProfile.degree}
                    onChange={e => setLearnerProfile({ ...learnerProfile, degree: e.target.value })}
                />
            </div>
            <div className={styles.halfWidth}>
                <Input
                    label="Institution"
                    placeholder="e.g., University of Lahore, NUST, etc."
                    value={learnerProfile.institution}
                    onChange={e => setLearnerProfile({ ...learnerProfile, institution: e.target.value })}
                />
            </div>
            <div className={styles.fullWidth}>
                <label className={styles.sectionTitle}>Interests</label>
                <div className={styles.pills}>
                    {INTERESTS_LIST.map(interest => (
                        <div
                            key={interest}
                            className={clsx(styles.pill, { [styles.selected]: learnerProfile.interests.includes(interest) })}
                            onClick={() => handleInterestToggle(interest)}
                        >
                            {interest}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.fullWidth}>
                <Input
                    label="Learning Goals"
                    as="textarea"
                    placeholder="What do you want to achieve?"
                    value={learnerProfile.goals}
                    onChange={e => setLearnerProfile({ ...learnerProfile, goals: e.target.value })}
                />
            </div>
        </div>
    );

    const renderMentorForm = () => (
        <div className={styles.grid}>
            <div className={styles.fullWidth}>
                <Input
                    label="Professional Bio"
                    as="textarea"
                    rows={3}
                    placeholder="Share your expertise..."
                    value={mentorProfile.bio}
                    onChange={e => setMentorProfile({ ...mentorProfile, bio: e.target.value })}
                />
            </div>
            <div>
                <Input
                    label="Years of Experience"
                    type="number"
                    value={mentorProfile.experience}
                    onChange={e => setMentorProfile({ ...mentorProfile, experience: e.target.value })}
                />
            </div>
            <div>
                <Input
                    label="Hourly Rate (PKR)"
                    type="number"
                    placeholder="e.g. 1500"
                    value={mentorProfile.hourlyRate}
                    onChange={e => setMentorProfile({ ...mentorProfile, hourlyRate: e.target.value })}
                />
            </div>

            <div className={styles.fullWidth}>
                <label className={styles.sectionTitle}>Skills to Teach</label>
                <div className={styles.pills}>
                    {INTERESTS_LIST.map(skill => (
                        <div
                            key={skill}
                            className={clsx(styles.pill, { [styles.selected]: mentorProfile.skills.find(s => s.name === skill) })}
                            onClick={() => handleSkillToggle(skill)}
                        >
                            {skill}
                        </div>
                    ))}
                </div>

                {mentorProfile.skills.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {mentorProfile.skills.map(skill => (
                            <div key={skill.name} className={styles.skillRow}>
                                <strong>{skill.name}</strong>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        value={skill.proficiency}
                                        onChange={e => updateSkillDetail(skill.name, 'proficiency', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px' }}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Expert</option>
                                        <option>Master</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Years"
                                        value={skill.years}
                                        onChange={e => updateSkillDetail(skill.name, 'years', e.target.value)}
                                        style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.fullWidth}>
                <label className={styles.sectionTitle}>Availability</label>
                <div className={styles.scheduleGrid}>
                    {DAYS.map(day => (
                        <div key={day} className={styles.dayColumn}>
                            <div className={styles.dayLabel}>{day}</div>
                            {TIME_SLOTS.map(slot => {
                                const id = `${day}-${slot}`;
                                return (
                                    <div
                                        key={id}
                                        className={clsx(styles.timeSlot, { [styles.selected]: mentorProfile.availability.includes(id) })}
                                        onClick={() => toggleAvailability(day, slot)}
                                    >
                                        {slot}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <Card padding="lg">
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Complete Your Profile</h1>

                {isBoth && (
                    <div className={styles.tabs}>
                        <button
                            className={clsx(styles.tab, { [styles.active]: activeTab === 'learner' })}
                            onClick={() => setActiveTab('learner')}
                        >
                            Learner Profile
                        </button>
                        <button
                            className={clsx(styles.tab, { [styles.active]: activeTab === 'mentor' })}
                            onClick={() => setActiveTab('mentor')}
                        >
                            Mentor Profile
                        </button>
                    </div>
                )}

                {activeTab === 'learner' ? renderLearnerForm() : renderMentorForm()}

                <div style={{ marginTop: '2rem' }}>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={isBoth && activeTab === 'learner' ? () => setActiveTab('mentor') : handleSubmit}
                        disabled={loading}
                    >
                        {isBoth && activeTab === 'learner' ? 'Save & Continue' : (loading ? 'Saving...' : 'Complete Profile')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProfileSetup;
