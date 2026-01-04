// src/test/mocks/handlers.ts
// MSW (Mock Service Worker) handlers for API mocking

// Note: These handlers can be used with MSW for more realistic API mocking
// For now, we'll define mock data structures that can be used across tests

export const mockSkillData = {
    skillId: 'skill-123',
    name: 'React Development',
    description: 'Learn React from scratch to advanced concepts',
    mentorId: 'mentor-456',
    mentorName: 'John Mentor',
    mentorAvatar: '/avatars/mentor.jpg',
    categoryId: 'cat-1',
    category: { categoryId: 'cat-1', name: 'Web Development' },
    rating: 4.5,
    reviewsCount: 25,
    location: 'Lahore',
    mode: 'ONLINE',
    price: 50,
    imageUrl: '/images/skill.jpg',
    isActive: true,
    lessons: [
        {
            lessonId: 'lesson-1',
            title: 'Introduction to React',
            description: 'Getting started with React basics',
            duration: 60,
            order: 1,
        },
        {
            lessonId: 'lesson-2',
            title: 'Components and Props',
            description: 'Understanding React components',
            duration: 90,
            order: 2,
        },
    ],
};

export const mockBookingData = {
    bookingId: 'booking-123',
    learnerId: 'learner-789',
    mentorId: 'mentor-456',
    lessonId: 'lesson-1',
    bookingDate: '2026-01-10',
    startTime: '10:00',
    endTime: '11:00',
    status: 'CONFIRMED',
    createdAt: '2026-01-04T10:00:00Z',
};

export const mockWalletData = {
    walletId: 'wallet-123',
    userId: 'user-456',
    balance: 500.0,
    currency: 'USD',
    transactions: [
        {
            transactionId: 'tx-1',
            amount: 100.0,
            type: 'CREDIT',
            description: 'Wallet top-up',
            createdAt: '2026-01-01T10:00:00Z',
        },
        {
            transactionId: 'tx-2',
            amount: -50.0,
            type: 'DEBIT',
            description: 'Course enrollment',
            createdAt: '2026-01-02T10:00:00Z',
        },
    ],
};

export const mockNotificationData = {
    notificationId: 'notif-123',
    userId: 'user-456',
    message: 'Your booking has been confirmed',
    type: 'BOOKING_CONFIRMED',
    isRead: false,
    createdAt: '2026-01-04T10:00:00Z',
};

export const mockReviewData = {
    reviewId: 'review-123',
    skillId: 'skill-123',
    userId: 'user-456',
    rating: 5,
    comment: 'Excellent course! Highly recommended.',
    createdAt: '2026-01-03T10:00:00Z',
};

export const mockEnrollmentData = {
    enrollmentId: 'enroll-123',
    userId: 'user-456',
    skillId: 'skill-123',
    status: 'ACTIVE',
    enrolledAt: '2026-01-01T10:00:00Z',
    progress: 50,
    completedLessons: 1,
    totalLessons: 2,
};

// API response creators
export const createSuccessResponse = <T>(data: T) => ({
    success: true,
    data,
    message: 'Success',
});

export const createErrorResponse = (message: string, code = 'ERROR') => ({
    success: false,
    error: {
        code,
        message,
    },
});

export const createPaginatedResponse = <T>(
    data: T[],
    page = 1,
    limit = 10,
    total = 100
) => ({
    success: true,
    data,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    },
});
