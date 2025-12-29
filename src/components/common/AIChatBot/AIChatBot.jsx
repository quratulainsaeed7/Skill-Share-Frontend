// src/components/common/AIChatBot/AIChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { IoSparkles, IoClose, IoSend, IoChevronDown } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import GeminiApi from '../../../api/GeminiApi';
import UserService from '../../../services/UserService';
import styles from './AIChatBot.module.css';

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Check if user is authenticated
    const isAuthenticated = UserService.isAuthenticated();

    // Welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                type: 'bot',
                content: "👋 Hi! I'm your AI learning assistant powered by Gemini. I can help you with:\n\n• Study tips and techniques\n• Explaining concepts\n• Answering academic questions\n• Learning guidance\n\nHow can I help you today?",
                timestamp: new Date()
            }]);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    const toggleChat = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const minimizeChat = (e) => {
        e.stopPropagation();
        setIsMinimized(true);
    };

    const closeChat = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        setIsMinimized(false);
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!message.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: message.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // Build conversation history for context
            const history = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: m.type === 'user' ? 'user' : 'model',
                    parts: [m.content]
                }));

            const response = await GeminiApi.generalChat({
                question: userMessage.content,
                history: history.slice(-10) // Keep last 10 messages for context
            });

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: response.answer || response.message || "I'm sorry, I couldn't process that request. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: isAuthenticated 
                    ? "I'm having trouble connecting right now. Please try again in a moment."
                    : "Please log in to use the AI assistant.",
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessage = (content) => {
        // Simple formatting for newlines and basic markdown
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < content.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className={styles.chatbotContainer}>
            {/* Chat Window */}
            {isOpen && !isMinimized && (
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <div className={styles.headerIcon}>
                                <IoSparkles />
                            </div>
                            <div className={styles.headerText}>
                                <span className={styles.headerTitle}>AI Assistant</span>
                                <span className={styles.headerStatus}>
                                    {isLoading ? 'Thinking...' : 'Online'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button 
                                className={styles.headerBtn} 
                                onClick={minimizeChat}
                                aria-label="Minimize"
                            >
                                <IoChevronDown />
                            </button>
                            <button 
                                className={styles.headerBtn} 
                                onClick={closeChat}
                                aria-label="Close"
                            >
                                <IoClose />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`${styles.message} ${styles[msg.type]} ${msg.isError ? styles.error : ''}`}
                            >
                                {msg.type === 'bot' && (
                                    <div className={styles.botAvatar}>
                                        <IoSparkles />
                                    </div>
                                )}
                                <div className={styles.messageContent}>
                                    <div className={styles.messageText}>
                                        {formatMessage(msg.content)}
                                    </div>
                                    <span className={styles.messageTime}>
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.message} ${styles.bot}`}>
                                <div className={styles.botAvatar}>
                                    <IoSparkles />
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.typingIndicator}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className={styles.inputContainer} onSubmit={handleSendMessage}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isAuthenticated ? "Ask me anything..." : "Please log in to chat"}
                            disabled={isLoading || !isAuthenticated}
                            className={styles.input}
                        />
                        <button 
                            type="submit" 
                            className={styles.sendBtn}
                            disabled={!message.trim() || isLoading || !isAuthenticated}
                        >
                            <IoSend />
                        </button>
                    </form>
                </div>
            )}

            {/* Minimized Bar */}
            {isOpen && isMinimized && (
                <div className={styles.minimizedBar} onClick={toggleChat}>
                    <div className={styles.minimizedContent}>
                        <IoSparkles />
                        <span>AI Assistant</span>
                    </div>
                    <button 
                        className={styles.headerBtn} 
                        onClick={closeChat}
                        aria-label="Close"
                    >
                        <IoClose />
                    </button>
                </div>
            )}

            {/* Floating Button */}
            <button 
                className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`}
                onClick={toggleChat}
                aria-label="Open AI Assistant"
            >
                <div className={styles.floatingBtnIcon}>
                    <BsChatDots />
                </div>
                <div className={styles.floatingBtnPulse}></div>
                <span className={styles.floatingBtnLabel}>AI</span>
            </button>
        </div>
    );
};

export default AIChatBot;
