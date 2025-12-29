import axios from 'axios';

/**
 * Get JWT token from storage
 */
const getToken = () => {
    return sessionStorage.getItem('skillshare_token');
};

/**
 * API request wrapper with automatic JWT token attachment
 */
const request = async (url, options = {}) => {
    const method = options.method || 'GET';
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    // Attach JWT token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const data = options.body ? JSON.parse(options.body) : undefined;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
            params: options.params,
            validateStatus: () => true,
        });

        const resData = response.data ?? null;

        // Handle authentication errors
        if (response.status === 401) {
            // Token expired or invalid - clear auth and redirect to login
            sessionStorage.removeItem('skillshare_token');
            sessionStorage.removeItem('skillshare_user');

            const errorMessage = resData?.message || 'Session expired. Please login again.';

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }

            throw new Error(errorMessage);
        }

        if (response.status === 403) {
            throw new Error(resData?.message || 'Access forbidden. Insufficient permissions.');
        }

        if (response.status < 200 || response.status >= 300) {
            const errorMessage = resData?.message || resData?.error || `HTTP ${response.status}: ${response.statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        return resData;
    } catch (error) {
        if (error.message && !error.response) {
            throw error;
        }

        if (error.response) {
            const { status, statusText, data: errData } = error.response;

            // Handle 401 Unauthorized
            if (status === 401) {
                sessionStorage.removeItem('skillshare_token');
                sessionStorage.removeItem('skillshare_user');

                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }

            const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        throw new Error('Unable to connect to service. Please check your connection.');
    }
};

export default request;
