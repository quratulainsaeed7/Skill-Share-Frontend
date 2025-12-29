import request from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const MESSAGES_ENDPOINT = `${API_BASE_URL}/api/messaging`;

export const MessageApi = {
  sendMessage: async (messageData) => {
    return request(MESSAGES_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getConversation: async (params) => {
    return request(MESSAGES_ENDPOINT, {
      params,
    });
  },

  markMessageRead: async (messageId, data) => {
    return request(`${MESSAGES_ENDPOINT}/${messageId}/read`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export default MessageApi;
