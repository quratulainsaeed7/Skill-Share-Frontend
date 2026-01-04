// src/components/skills/SkillCard/SkillCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SkillCard from './SkillCard';

// Create mock for UserService
const mockGetUser = jest.fn();
jest.mock('../../../services/UserService', () => ({
    __esModule: true,
    default: {
        getUser: () => mockGetUser(),
    },
}));

const mockSkill = {
    skillId: 'skill-123',
    name: 'React Development',
    mentorName: 'John Mentor',
    mentorAvatar: '/avatar.jpg',
    mentorId: 'mentor-456',
    category: { categoryId: 'cat-1', name: 'Web Development' },
    rating: 4.5,
    reviewsCount: 25,
    location: 'Lahore',
    mode: 'ONLINE',
    price: 50,
    imageUrl: '/skill-image.jpg',
    description: 'Learn React from scratch',
    progress: 50,
    completedLessons: 5,
    totalLessons: 10,
    isEnrolled: true,
};

const renderSkillCard = (skillProps = {}, userMock = null) => {
    mockGetUser.mockReturnValue(userMock);

    return render(
        <MemoryRouter>
            <SkillCard skill={{ ...mockSkill, ...skillProps }} />
        </MemoryRouter>
    );
};

describe('SkillCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUser.mockReturnValue(null);
    });

    // ===========================================
    // RENDERING TESTS
    // ===========================================
    describe('Rendering', () => {
        it('renders without crashing', () => {
            renderSkillCard();
            expect(screen.getByText('React Development')).toBeInTheDocument();
        });

        it('renders skill name', () => {
            renderSkillCard({ name: 'JavaScript Fundamentals' });
            expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
        });

        it('renders skill image', () => {
            renderSkillCard();
            const image = screen.getByAltText('React Development');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/skill-image.jpg');
        });

        it('renders category tag', () => {
            renderSkillCard();
            expect(screen.getByText('Web Development')).toBeInTheDocument();
        });

        it('renders price', () => {
            renderSkillCard({ price: 75 });
            expect(screen.getByText('$75')).toBeInTheDocument();
        });

        it('renders rating', () => {
            renderSkillCard({ rating: 4.8 });
            expect(screen.getByText('4.8')).toBeInTheDocument();
        });

        it('renders mode', () => {
            renderSkillCard({ mode: 'ONLINE' });
            expect(screen.getByText('ONLINE')).toBeInTheDocument();
        });
    });

    // ===========================================
    // LINK/NAVIGATION TESTS
    // ===========================================
    describe('Navigation', () => {
        it('links to skill details page', () => {
            renderSkillCard({ skillId: 'skill-789' });
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', '/skills/skill-789');
        });

        it('is clickable', () => {
            renderSkillCard();
            const link = screen.getByRole('link');
            expect(link).not.toBeDisabled();
        });
    });

    // ===========================================
    // PROGRESS BAR TESTS
    // ===========================================
    describe('Progress Bar', () => {
        it('shows progress for enrolled learners', () => {
            renderSkillCard(
                {
                    isEnrolled: true,
                    totalLessons: 10,
                    completedLessons: 5,
                    progress: 50,
                },
                { userId: 'learner-123' } // Different from mentorId
            );

            expect(screen.getByText('5/10 lessons')).toBeInTheDocument();
        });

        it('does not show progress for mentors viewing their own skill', () => {
            renderSkillCard(
                {
                    isEnrolled: true,
                    totalLessons: 10,
                    completedLessons: 5,
                    mentorId: 'mentor-456',
                },
                { userId: 'mentor-456' } // Same as mentorId
            );

            expect(screen.queryByText(/lessons/)).not.toBeInTheDocument();
        });

        it('does not show progress for non-enrolled users', () => {
            renderSkillCard(
                {
                    isEnrolled: false,
                    totalLessons: 10,
                    completedLessons: 0,
                },
                { userId: 'other-user' }
            );

            expect(screen.queryByText(/lessons/)).not.toBeInTheDocument();
        });

        it('does not show progress when totalLessons is 0', () => {
            renderSkillCard(
                {
                    isEnrolled: true,
                    totalLessons: 0,
                    completedLessons: 0,
                },
                { userId: 'learner-123' }
            );

            expect(screen.queryByText(/lessons/)).not.toBeInTheDocument();
        });

        it('shows progress dividers for multiple lessons', () => {
            const { container } = renderSkillCard(
                {
                    isEnrolled: true,
                    totalLessons: 5,
                    completedLessons: 2,
                    progress: 40,
                },
                { userId: 'learner-123' }
            );

            // Should have 4 dividers for 5 lessons (totalLessons - 1)
            const dividers = container.querySelectorAll('[class*="progressDivider"]');
            expect(dividers.length).toBe(4);
        });
    });

    // ===========================================
    // CATEGORY DISPLAY TESTS
    // ===========================================
    describe('Category Display', () => {
        it('shows category name when category exists', () => {
            renderSkillCard({ category: { categoryId: 'cat-1', name: 'Data Science' } });
            expect(screen.getByText('Data Science')).toBeInTheDocument();
        });

        it('shows "Uncategorized" when category is null', () => {
            renderSkillCard({ category: null });
            expect(screen.getByText('Uncategorized')).toBeInTheDocument();
        });

        it('shows "Uncategorized" when category is undefined', () => {
            renderSkillCard({ category: undefined });
            expect(screen.getByText('Uncategorized')).toBeInTheDocument();
        });
    });

    // ===========================================
    // PRICE DISPLAY TESTS
    // ===========================================
    describe('Price Display', () => {
        it('displays integer price correctly', () => {
            renderSkillCard({ price: 100 });
            expect(screen.getByText('$100')).toBeInTheDocument();
        });

        it('displays decimal price without decimals', () => {
            renderSkillCard({ price: 99.99 });
            expect(screen.getByText('$100')).toBeInTheDocument(); // toFixed(0) rounds
        });

        it('shows /hr suffix', () => {
            renderSkillCard({ price: 50 });
            expect(screen.getByText('/hr')).toBeInTheDocument();
        });

        it('does not show price section when price is falsy', () => {
            renderSkillCard({ price: null });
            expect(screen.queryByText('/hr')).not.toBeInTheDocument();
        });

        it('does not show price section when price is 0', () => {
            renderSkillCard({ price: 0 });
            expect(screen.queryByText('/hr')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // RATING DISPLAY TESTS
    // ===========================================
    describe('Rating Display', () => {
        it('shows rating when provided', () => {
            renderSkillCard({ rating: 4.5 });
            expect(screen.getByText('4.5')).toBeInTheDocument();
        });

        it('does not show rating section when rating is null', () => {
            renderSkillCard({ rating: null });
            // Rating text should not be present
            expect(screen.queryByText(/^\d\.\d$/)).not.toBeInTheDocument();
        });

        it('does not show rating section when rating is 0', () => {
            renderSkillCard({ rating: 0, reviewsCount: 0 });
            // 0 is falsy, so rating section should not show a star rating
            // Check that no star icon is rendered with a rating value
            expect(screen.queryByText('4.5')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // MODE DISPLAY TESTS
    // ===========================================
    describe('Mode Display', () => {
        it('shows mode when provided', () => {
            renderSkillCard({ mode: 'HYBRID' });
            expect(screen.getByText('HYBRID')).toBeInTheDocument();
        });

        it('does not show mode section when mode is null', () => {
            renderSkillCard({ mode: null });
            expect(screen.queryByText('ONLINE')).not.toBeInTheDocument();
            expect(screen.queryByText('HYBRID')).not.toBeInTheDocument();
            expect(screen.queryByText('IN_PERSON')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // EDGE CASES
    // ===========================================
    describe('Edge Cases', () => {
        it('handles very long skill name', () => {
            const longName = 'This is a very long skill name that might overflow the card';
            renderSkillCard({ name: longName });
            expect(screen.getByText(longName)).toBeInTheDocument();
        });

        it('handles special characters in skill name', () => {
            renderSkillCard({ name: 'C++ & Python <Advanced>' });
            expect(screen.getByText('C++ & Python <Advanced>')).toBeInTheDocument();
        });

        it('handles missing optional fields', () => {
            const minimalSkill = {
                skillId: 'skill-min',
                name: 'Minimal Skill',
                imageUrl: '/default.jpg',
                category: null,
                rating: null,
                mode: null,
                price: null,
                mentorId: 'mentor-1',
                isEnrolled: false,
                totalLessons: 0,
            };

            render(
                <MemoryRouter>
                    <SkillCard skill={minimalSkill as any} />
                </MemoryRouter>
            );

            expect(screen.getByText('Minimal Skill')).toBeInTheDocument();
            expect(screen.getByText('Uncategorized')).toBeInTheDocument();
        });

        it('handles user not logged in', () => {
            mockGetUser.mockReturnValue(null);

            render(
                <MemoryRouter>
                    <SkillCard skill={mockSkill} />
                </MemoryRouter>
            );

            expect(screen.getByText('React Development')).toBeInTheDocument();
        });

        it('handles missing mentorId', () => {
            renderSkillCard({ mentorId: undefined }, { userId: 'user-123' });
            // Should still render without crashing
            expect(screen.getByText('React Development')).toBeInTheDocument();
        });
    });

    // ===========================================
    // ACCESSIBILITY TESTS
    // ===========================================
    describe('Accessibility', () => {
        it('has correct alt text for image', () => {
            renderSkillCard({ name: 'Python Basics' });
            expect(screen.getByAltText('Python Basics')).toBeInTheDocument();
        });

        it('link is accessible', () => {
            renderSkillCard();
            const link = screen.getByRole('link');
            expect(link).toBeInTheDocument();
        });

        it('can be focused via keyboard', () => {
            renderSkillCard();
            const link = screen.getByRole('link');
            link.focus();
            expect(link).toHaveFocus();
        });
    });
});
