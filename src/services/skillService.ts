import SkillApi from '../api/SkillApi';

interface SkillFilters {
    search?: string;
    categories?: string[];
    mode?: 'online' | 'in-person' | 'all';
    city?: string;
    priceTypes?: string[];
    priceRange?: [number, number];
    minRating?: number;
    sortBy?: 'highest_rated' | 'lowest_price' | 'highest_price' | 'most_reviews';
}

export const skillService = {
    getCategories: async (): Promise<any[]> => {
        try {
            return await SkillApi.getCategories();
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    },

    getAllSkills: async (): Promise<any[]> => {
        try {
            return await SkillApi.getAllSkills();
        } catch (error) {
            console.error('Failed to fetch all skills:', error);
            throw error;
        }
    },

    getSkills: async (filters: SkillFilters = {}): Promise<any[]> => {
        try {
            return await SkillApi.getSkills(filters);
        } catch (error) {
            console.error('Failed to fetch skills with filters:', error);
            throw error;
        }
    },

    getSkillById: async (id: string): Promise<any | null> => {
        try {
            return await SkillApi.getSkillById(id);
        } catch (error) {
            console.error(`Failed to fetch skill ${id}:`, error);
            throw error;
        }
    },

    getEnrolledCourses: async (userId: string): Promise<any[]> => {
        if (!userId) return [];
        try {
            return await SkillApi.getEnrolledCourses(userId);
        } catch (error) {
            console.error(`Failed to fetch enrolled courses for user ${userId}:`, error);
            throw error;
        }
    },

    getTaughtCourses: async (userId: string): Promise<any[]> => {
        if (!userId) return [];
        try {
            return await SkillApi.getTaughtCourses(userId);
        } catch (error) {
            console.error(`Failed to fetch taught courses for user ${userId}:`, error);
            throw error;
        }
    },

    getEnrolledStudents: async (userId: string): Promise<any[]> => {
        if (!userId) return [];
        try {
            return await SkillApi.getEnrolledStudents(userId);
        } catch (error) {
            console.error(`Failed to fetch enrolled students for mentor ${userId}:`, error);
            throw error;
        }
    },

    getMentorId: async (skillId: string): Promise<string | null> => {
        try {
            return await SkillApi.getMentorId(skillId);
        } catch (error) {
            console.error(`Failed to fetch mentor ID for skill ${skillId}:`, error);
            throw error;
        }
    },

    enrollInSkill: async (skillId: string, userId: string): Promise<any> => {
        const mentorId = await skillService.getMentorId(skillId);
        try {
            return await SkillApi.enrollInSkill(skillId, userId, mentorId!);
        } catch (error) {
            console.error(`Failed to enroll user ${userId} in skill ${skillId}:`, error);
            throw error;
        }
    },

    unenrollFromSkill: async (skillId: string, userId: string): Promise<any> => {
        const mentorId = await skillService.getMentorId(skillId);
        try {
            return await SkillApi.unenrollFromSkill(skillId, userId, mentorId);
        } catch (error) {
            console.error(`Failed to unenroll user ${userId} from skill ${skillId}:`, error);
            throw error;
        }
    }
};

export default skillService;
