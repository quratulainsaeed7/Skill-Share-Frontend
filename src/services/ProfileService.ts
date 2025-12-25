import ProfileApi from "../api/ProfileApi";
import UserService from "./UserService";

/**
 * ProfileService - Handles user profile operations.
 * Uses UserService.getUser() for user data access (centralized approach).
 */
class ProfileService {
    static async getUserProfile() {
        try {
            // Get userId from centralized UserService
            const user = UserService.getUser();
            if (!user?.userId) {
                throw new Error('No authenticated user found');
            }

            const profile = await ProfileApi.getProfile(user.userId);
            console.log('Fetched user profile:', profile);
            return profile;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }

    static async completeUserProfile(profileData) {
        try {
            // Get userId from centralized UserService
            const user = UserService.getUser();
            if (!user?.userId) {
                throw new Error('No authenticated user found');
            }

            const profile = await ProfileApi.createProfile(user.userId, profileData);

            // Update the stored user with profile completion status
            UserService.updateStoredUser({ profileCompleted: true });

            return profile;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to complete user profile');
        }
    }
}

export default ProfileService;