import ProfileApi from "../api/ProfileApi";
import UserService from "./userService";

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
            if (!profile) {
                throw new Error('Profile not found');
                return null;
            }
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
    // check if user profile is complete
    static async isUserProfileComplete() {
        try {
            const profile = await this.getUserProfile();
            // Define your criteria for a complete profile
            if (profile == null) {
                console.log('Profile is incomplete: no profile data found');
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            console.error('Error checking profile completeness:', error);
            return false;
        }

    }
}

export default ProfileService;