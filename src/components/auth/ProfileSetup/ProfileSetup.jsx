// src/components/auth/ProfileSetup/ProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Card from '../../common/Card/Card';
import styles from './ProfileSetup.module.css';
import clsx from 'clsx';
import ProfileService from '../../../services/profileService';

const INTERESTS_LIST = [
    'Web Development', 'Mobile Development', 'Data Science', 'Graphic Design',
    'UI/UX Design', 'Digital Marketing', 'English Language', 'Urdu Language',
    'Business', 'Mathematics', 'Physics', 'Chemistry'
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Single profile for any role: bio, skills, location, city
    const [profile, setProfile] = useState({
        bio: '',
        skills: [],
        location: '',
        city: '',
    });


    const handleSkillToggle = (skillName) => {
        setProfile(prev => {
            const exists = prev.skills.includes(skillName);
            if (exists) return { ...prev, skills: prev.skills.filter(s => s !== skillName) };
            if (prev.skills.length >= 15) return prev;
            return { ...prev, skills: [...prev.skills, skillName] };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await ProfileService.completeUserProfile(profile);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderProfileForm = () => (
        <div className={styles.grid}>
            <div className={styles.fullWidth}>
                <Input
                    label="Bio"
                    as="textarea"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                />
            </div>
            <div className={styles.fullWidth}>
                <label className={styles.sectionTitle}>Skills</label>
                <div className={styles.pills}>
                    {INTERESTS_LIST.map(skill => (
                        <div
                            key={skill}
                            className={clsx(styles.pill, { [styles.selected]: profile.skills.includes(skill) })}
                            onClick={() => handleSkillToggle(skill)}
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Input
                    label="Location"
                    placeholder="e.g. Sindh, Pakistan"
                    value={profile.location}
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                />
            </div>
            <div>
                <Input
                    label="City"
                    placeholder="e.g. Karachi"
                    value={profile.city}
                    onChange={e => setProfile({ ...profile, city: e.target.value })}
                />
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <Card padding="lg">
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Complete Your Profile</h1>

                {renderProfileForm()}

                <div style={{ marginTop: '2rem' }}>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ProfileSetup;
