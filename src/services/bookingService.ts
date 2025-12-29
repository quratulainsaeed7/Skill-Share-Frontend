import BookingApi from '../api/BookingApi';

export interface Booking {
    bookingId: string;
    learnerId: string;
    mentorId: string;
    lessonId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    // Extended fields from joins
    skillId?: string;        // Derived from lesson, not stored
    skillTitle?: string;
    mentorName?: string;
    mentorAvatar?: string;
    learnerName?: string;
    learnerAvatar?: string;
}

export interface CreateBookingData {
    learnerId: string;
    mentorId: string;
    lessonId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
}

export interface BulkBookingData {
    mentorId: string;
    lessonId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
}

class BookingService {
    /**
     * Create a new booking
     * Note: Payment is handled during skill enrollment
     * This just schedules a lesson session with the mentor
     */
    async createBooking(bookingData: CreateBookingData): Promise<Booking> {
        try {
            return await BookingApi.createBooking(bookingData);
        } catch (error: any) {
            console.error('Failed to create booking:', error);
            throw new Error(error.message || 'Failed to create booking');
        }
    }

    /**
     * Schedule bulk meeting for all enrolled students
     * Mentor schedules a lesson, system creates bookings for all enrolled students
     */
    async scheduleBulkMeeting(bulkBookingData: BulkBookingData): Promise<Booking[]> {
        try {
            return await BookingApi.scheduleBulkMeeting(bulkBookingData);
        } catch (error: any) {
            console.error('Failed to schedule bulk meeting:', error);
            throw new Error(error.message || 'Failed to schedule meeting for students');
        }
    }

    /**
     * Get all bookings (admin only)
     */
    async getAllBookings(): Promise<Booking[]> {
        try {
            return await BookingApi.getAllBookings();
        } catch (error: any) {
            console.error('Failed to fetch all bookings:', error);
            throw new Error(error.message || 'Failed to fetch bookings');
        }
    }

    /**
     * Get a specific booking by ID
     */
    async getBookingById(bookingId: string): Promise<Booking> {
        try {
            return await BookingApi.getBookingById(bookingId);
        } catch (error: any) {
            console.error(`Failed to fetch booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to fetch booking details');
        }
    }

    /**
     * Get all bookings for a learner
     */
    async getBookingsByLearner(learnerId: string): Promise<Booking[]> {
        if (!learnerId) {
            throw new Error('Learner ID is required');
        }

        try {
            return await BookingApi.getBookingsByLearner(learnerId);
        } catch (error: any) {
            console.error(`Failed to fetch bookings for learner ${learnerId}:`, error);
            throw new Error(error.message || 'Failed to fetch your bookings');
        }
    }

    /**
     * Get all bookings for a mentor
     */
    async getBookingsByMentor(mentorId: string): Promise<Booking[]> {
        if (!mentorId) {
            throw new Error('Mentor ID is required');
        }

        try {
            return await BookingApi.getBookingsByMentor(mentorId);
        } catch (error: any) {
            console.error(`Failed to fetch bookings for mentor ${mentorId}:`, error);
            throw new Error(error.message || 'Failed to fetch your bookings');
        }
    }

    /**
     * Update booking details
     */
    async updateBooking(bookingId: string, updateData: Partial<Booking>): Promise<Booking> {
        try {
            return await BookingApi.updateBooking(bookingId, updateData);
        } catch (error: any) {
            console.error(`Failed to update booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to update booking');
        }
    }

    /**
     * Cancel a booking
     */
    async cancelBooking(bookingId: string): Promise<void> {
        try {
            await BookingApi.cancelBooking(bookingId);
        } catch (error: any) {
            console.error(`Failed to cancel booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to cancel booking');
        }
    }

    /**
     * Accept a booking (mentor action)
     */
    async acceptBooking(bookingId: string): Promise<Booking> {
        try {
            return await BookingApi.acceptBooking(bookingId);
        } catch (error: any) {
            console.error(`Failed to accept booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to accept booking');
        }
    }

    /**
     * Reject a booking (mentor action)
     */
    async rejectBooking(bookingId: string): Promise<Booking> {
        try {
            return await BookingApi.rejectBooking(bookingId);
        } catch (error: any) {
            console.error(`Failed to reject booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to reject booking');
        }
    }

    /**
     * Mark booking as completed
     */
    async completeBooking(bookingId: string): Promise<Booking> {
        try {
            return await BookingApi.completeBooking(bookingId);
        } catch (error: any) {
            console.error(`Failed to complete booking ${bookingId}:`, error);
            throw new Error(error.message || 'Failed to complete booking');
        }
    }

    /**
     * Get upcoming bookings (status: ACCEPTED or PENDING, excluding REJECTED/CANCELLED/COMPLETED)
     */
    async getUpcomingBookings(userId: string, userRole: 'learner' | 'mentor'): Promise<Booking[]> {
        try {
            const bookings = userRole === 'learner'
                ? await this.getBookingsByLearner(userId)
                : await this.getBookingsByMentor(userId);

            return bookings.filter(booking => {
                return (booking.status === 'ACCEPTED' || booking.status === 'PENDING');
            });
        } catch (error: any) {
            console.error('Failed to fetch upcoming bookings:', error);
            throw new Error(error.message || 'Failed to fetch upcoming bookings');
        }
    }

    /**
     * Get past bookings (status: COMPLETED, REJECTED, or CANCELLED)
     */
    async getPastBookings(userId: string, userRole: 'learner' | 'mentor'): Promise<Booking[]> {
        try {
            const bookings = userRole === 'learner'
                ? await this.getBookingsByLearner(userId)
                : await this.getBookingsByMentor(userId);

            return bookings.filter(booking => {
                return (booking.status === 'COMPLETED' ||
                    booking.status === 'REJECTED' ||
                    booking.status === 'CANCELLED');
            });
        } catch (error: any) {
            console.error('Failed to fetch past bookings:', error);
            throw new Error(error.message || 'Failed to fetch past bookings');
        }
    }
}

export const bookingService = new BookingService();
export default bookingService;
