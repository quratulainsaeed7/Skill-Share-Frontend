import request from './apiClient';

const API_URL = import.meta.env.VITE_MESSAGING_SERVICE_URL || 'http://localhost:4007';
const MESSAGES_ENDPOINT = `${API_URL}/messages`;

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
