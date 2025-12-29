import MessageApi from '../api/MessageApi';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  sender: {
    userId: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    userId: string;
    name: string;
    avatar?: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface SendMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
  bookingId?: string;
}

export interface ConversationParams {
  senderId: string;
  receiverId: string;
  bookingId?: string;
}

export interface MarkReadParams {
  readerId: string;
}

class MessageService {
  private socket: Socket | null = null;
  private messageCallbacks: Array<(message: Message) => void> = [];
  private readReceiptCallbacks: Array<(messageId: string) => void> = [];

  /**
   * Initialize WebSocket connection
   */
  connectSocket(userId: string): void {
    const SOCKET_URL = import.meta.env.VITE_MESSAGING_API_URL || 'http://localhost:4007';

    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to message socket');
      this.socket?.emit('register', userId);
    });

    this.socket.on('message', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('read', (messageId: string) => {
      this.readReceiptCallbacks.forEach(callback => callback(messageId));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from message socket');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageCallbacks = [];
    this.readReceiptCallbacks = [];
  }

  /**
   * Register a callback for new messages
   */
  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for read receipts
   */
  onReadReceipt(callback: (messageId: string) => void): () => void {
    this.readReceiptCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      this.readReceiptCallbacks = this.readReceiptCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Send a message
   */
  async sendMessage(params: SendMessageParams): Promise<Message> {
    try {
      const message = await MessageApi.sendMessage(params);
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Get conversation between two users
   */
  async getConversation(params: ConversationParams): Promise<Message[]> {
    try {
      const messages = await MessageApi.getConversation(params);
      return messages;
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      throw error;
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string, params: MarkReadParams): Promise<{ ok: boolean; message?: Message }> {
    try {
      const result = await MessageApi.markMessageRead(messageId, params);
      return result;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  }

  /**
   * Mark multiple messages as read
   */
  async markMultipleAsRead(messageIds: string[], readerId: string): Promise<void> {
    try {
      await Promise.all(
        messageIds.map(id => this.markAsRead(id, { readerId }))
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  }
}

export default new MessageService();
