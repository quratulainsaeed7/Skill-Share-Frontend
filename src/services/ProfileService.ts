import ProfileApi from "../api/ProfileApi";
import UserApi from "../api/UserApi";

class ProfileService {
    static async getUserProfile() {
        try {
            const userId = localStorage.getItem('userID');
            const profile = await UserApi.getUserProfileById(userId);
            return profile;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
        }

    }

    static async completeUserProfile(profileData) {
        try {
            const userId = localStorage.getItem('userID');
            const profile = await ProfileApi.createProfile(userId, profileData);
            return profile;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to complete user profile');
        }
    }
}


export default ProfileService;