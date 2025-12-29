import LessonApi from '../api/LessonApi';

export interface Lesson {
    lessonId: string;
    skillId: string;
    description: string;
    duration: number;
    meetingLink?: string;
    schedule?: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface CreateLessonData {
    skillId: string;
    description: string;
    duration: number;
    meetingLink?: string;
    schedule?: string;
}

export interface UpdateLessonData {
    description?: string;
    duration?: number;
    meetingLink?: string;
    schedule?: string;
    status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

class LessonService {
    /**
     * Create a new lesson
     */
    async createLesson(lessonData: CreateLessonData): Promise<Lesson> {
        try {
            return await LessonApi.createLesson(lessonData);
        } catch (error: any) {
            console.error('Failed to create lesson:', error);
            throw new Error(error.message || 'Failed to create lesson');
        }
    }

    /**
     * Get all lessons for a skill
     */
    async getLessonsBySkill(skillId: string): Promise<Lesson[]> {
        try {
            return await LessonApi.getLessonsBySkill(skillId);
        } catch (error: any) {
            console.error(`Failed to fetch lessons for skill ${skillId}:`, error);
            throw new Error(error.message || 'Failed to fetch lessons');
        }
    }

    /**
     * Get a specific lesson by ID
     */
    async getLessonById(lessonId: string): Promise<Lesson> {
        try {
            return await LessonApi.getLessonById(lessonId);
        } catch (error: any) {
            console.error(`Failed to fetch lesson ${lessonId}:`, error);
            throw new Error(error.message || 'Failed to fetch lesson');
        }
    }

    /**
     * Update a lesson
     */
    async updateLesson(lessonId: string, updateData: UpdateLessonData): Promise<Lesson> {
        try {
            return await LessonApi.updateLesson(lessonId, updateData);
        } catch (error: any) {
            console.error(`Failed to update lesson ${lessonId}:`, error);
            throw new Error(error.message || 'Failed to update lesson');
        }
    }

    /**
     * Delete a lesson
     */
    async deleteLesson(lessonId: string): Promise<void> {
        try {
            await LessonApi.deleteLesson(lessonId);
        } catch (error: any) {
            console.error(`Failed to delete lesson ${lessonId}:`, error);
            throw new Error(error.message || 'Failed to delete lesson');
        }
    }

    /**
     * Update lesson status
     */
    async updateLessonStatus(lessonId: string, status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'): Promise<Lesson> {
        return this.updateLesson(lessonId, { status });
    }

    /**
     * Generate a Jitsi meeting link with a unique hash
     */
    generateMeetingLink(lessonId: string): string {
        const hash = Math.random().toString(36).substring(2, 10);
        return `https://meet.jit.si/skillshare-${lessonId}-${hash}`;
    }
}

export const lessonService = new LessonService();
export default lessonService;
