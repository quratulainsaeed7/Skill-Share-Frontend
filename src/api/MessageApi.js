import axios from 'axios';

const API_URL = import.meta.env.VITE_MESSAGING_API_URL || 'http://localhost:4004';

class MessageApi {
  /**
   * Send a message
   * @param {Object} messageData - The message data
   * @param {number} messageData.senderId - The sender's user ID
   * @param {number} messageData.receiverId - The receiver's user ID
   * @param {string} messageData.content - The message content
   * @param {number} [messageData.bookingId] - Optional booking ID
   * @returns {Promise<Object>} The created message
   */
  async sendMessage(messageData) {
    try {
      const response = await axios.post(`${API_URL}/messages`, messageData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get conversation between two users
   * @param {Object} params - Query parameters
   * @param {number} params.senderId - Sender user ID
   * @param {number} params.receiverId - Receiver user ID
   * @param {number} [params.bookingId] - Optional booking ID
   * @returns {Promise<Array>} List of messages
   */
  async getConversation(params) {
    try {
      const response = await axios.get(`${API_URL}/messages`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Mark a message as read
   * @param {string} messageId - The message ID
   * @param {Object} data - The mark read data
   * @param {number} data.readerId - The reader's user ID
   * @returns {Promise<Object>} Update result
   */
  async markMessageRead(messageId, data) {
    try {
      const response = await axios.patch(
        `${API_URL}/messages/${messageId}/read`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error.response?.data || error;
    }
  }
}

export default new MessageApi();
