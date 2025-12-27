import axios from 'axios';

const request = async (url, options = {}) => {
    const method = options.method || 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
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
            const errorMessage = errData?.message || errData?.error || `HTTP ${status}: ${statusText || ''}`.trim();
            throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        }

        throw new Error('Unable to connect to service. Please check your connection.');
    }
};

export default request;
