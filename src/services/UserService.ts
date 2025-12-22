import { useNavigate } from 'react-router-dom';
import UserApi from '../api/UserApi';


class UserService {


    static async registerUser(userData) {

        // add missing fields
        userData.isVerified = false;
        userData.createdAt = new Date().toISOString();
        userData.updatedAt = new Date().toISOString();

        try {
            const user = await UserApi.createUser(userData);
            //save userID name to local storage

            console.log('User registered:', user);
            localStorage.setItem('userID', user.userId);
            localStorage.setItem('name', user.name);
            localStorage.setItem('role', user.role);

            return { success: true, data: user };

        }
        catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');

        }
    }


    static async verifyEmail() {
        try {
            const userId = localStorage.getItem('userID');
            const response = await UserApi.verifyUser(userId);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Email verification failed');
        }
    }


    static async loginUser(credentials) {
        try {
            const user = await UserApi.loginUser(credentials);
            console.log('User logged in:', user);
            localStorage.setItem('userID', user.userId);
            localStorage.setItem('name', user.name);
            localStorage.setItem('role', user.role);


            return { success: true, data: user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    static logout() {

        localStorage.removeItem('userID');
        localStorage.removeItem('name');
        localStorage.removeItem('role');

    }
}

export default UserService;