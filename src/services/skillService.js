// src/services/skillService.js
import { MOCK_SKILLS, CATEGORIES } from '../mock/skills';

export const skillService = {
    getCategories: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return CATEGORIES;
    },

    getAllSkills: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_SKILLS;
    },

    getSkills: async (filters = {}) => {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency

        let results = [...MOCK_SKILLS];

        // Search Query
        if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(skill =>
                skill.title.toLowerCase().includes(q) ||
                skill.description.toLowerCase().includes(q) ||
                skill.mentorName.toLowerCase().includes(q) ||
                skill.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }

        // Category Filter (Array of selected subcategories/categories)
        if (filters.categories && filters.categories.length > 0) {
            results = results.filter(skill =>
                filters.categories.includes(skill.category) ||
                filters.categories.includes(skill.subcategory)
            );
        }

        // Mode Filter
        if (filters.mode && filters.mode !== 'all') {
            results = results.filter(skill =>
                // If mode is 'online', match 'Online'
                // If mode is 'in-person', match 'In-Person'
                skill.mode.toLowerCase() === filters.mode.toLowerCase()
            );
        }

        // City Filter (only if in-person is selected or mode is all/filtered)
        if (filters.city && (filters.mode === 'in-person' || !filters.mode || filters.mode === 'all')) {
            // If a specific city is selected, show skills in that city (mostly for in-person)
            // But also allow checking if mentor is from that city even if online? 
            // Requirement says "Only shows if In-Person mode selected" for the filter UI.
            // Logic: if city is present, filter by it.
            results = results.filter(skill => skill.city === filters.city);
        }

        // Price Type
        if (filters.priceTypes && filters.priceTypes.length > 0) {
            results = results.filter(skill => {
                // skill.priceType can be 'cash', 'credits', 'both'
                // filter.priceTypes e.g. ['cash'] or ['credits'] or ['both'] ... wait logic check
                // If user selects 'Cash', show 'cash' and 'both'.
                // If user selects 'Credits', show 'credits' and 'both'.

                let matches = false;
                if (filters.priceTypes.includes('cash') && (skill.priceType === 'cash' || skill.priceType === 'both')) matches = true;
                if (filters.priceTypes.includes('credits') && (skill.priceType === 'credits' || skill.priceType === 'both')) matches = true;
                if (filters.priceTypes.includes('both') && skill.priceType === 'both') matches = true; // redundancy check

                return matches;
            });
        }

        // Price Range (Cash)
        if (filters.priceRange && filters.priceRange.length === 2) {
            const [min, max] = filters.priceRange;
            results = results.filter(skill => {
                if (!skill.priceCash) return false; // If no cash price, exclude? Or keep if it matches other filters?
                // Assuming if filtering by cash range, we only care about cash skills
                return skill.priceCash >= min && skill.priceCash <= max;
            });
        }

        // Rating
        if (filters.minRating) {
            results = results.filter(skill => skill.rating >= filters.minRating);
        }

        // Sorting
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'highest_rated':
                    results.sort((a, b) => b.rating - a.rating);
                    break;
                case 'lowest_price':
                    // Prefer cash price for sorting
                    results.sort((a, b) => (a.priceCash || 0) - (b.priceCash || 0));
                    break;
                case 'highest_price':
                    results.sort((a, b) => (b.priceCash || 0) - (a.priceCash || 0));
                    break;
                case 'most_reviews':
                    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
                    break;
                default: // Relevance (id/default order)
                    break;
            }
        }

        return results;
    },

    getSkillById: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return MOCK_SKILLS.find(s => s.id === id);
    },

    getEnrolledCourses: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Mock: Return first 3 skills as enrolled courses
        // In a real app, this would fetch from a backend with user enrollment data
        const enrolledCourseIds = localStorage.getItem(`enrolled_courses_${userId}`);
        if (!enrolledCourseIds) {
            // Return first 3 skills as default enrolled courses
            return MOCK_SKILLS.slice(0, 3);
        }
        const ids = JSON.parse(enrolledCourseIds);
        return MOCK_SKILLS.filter(skill => ids.includes(skill.id));
    },

    getTaughtCourses: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Mock: Return courses that match the user as mentor
        // In a real app, this would fetch courses where mentorId === userId
        return MOCK_SKILLS.slice(0, 4); // Return first 4 as taught courses
    },

    getEnrolledStudents: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        // Mock: Return list of students enrolled in mentor's courses
        return [
            { id: 's1', name: 'Ahmad Ali', avatar: 'https://i.pravatar.cc/150?u=ahmad', course: 'Web Development', progress: 75 },
            { id: 's2', name: 'Fatima Khan', avatar: 'https://i.pravatar.cc/150?u=fatima', course: 'Graphic Design', progress: 60 },
            { id: 's3', name: 'Hassan Raza', avatar: 'https://i.pravatar.cc/150?u=hassan', course: 'Web Development', progress: 45 },
            { id: 's4', name: 'Ayesha Malik', avatar: 'https://i.pravatar.cc/150?u=ayesha', course: 'UI/UX Design', progress: 90 },
        ];
    }
};
