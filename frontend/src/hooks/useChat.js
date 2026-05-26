// src/hooks/useChat.js
// Custom React hook for chat functionality

import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Send message and handle response
     */
    const sendMessage = useCallback(async (userMessage, language = 'en') => {
        // Add user message to chat
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: userMessage,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            // Call backend API
            const response = await sendChatMessage(userMessage, language);
            
            // Add bot response
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.answer,
                sources: response.sources || response.citations || [],
                confidence: response.confidence || response.confidence_score || 90,
                emergency: response.emergency || response.emergency_detected || false,
                emergencyLevel: response.emergencyLevel || response.emergency_level || (response.emergency ? "CRITICAL" : null),
                emergencyAction: response.emergencyAction || response.emergency_action || "Seek professional clinical triage.",
                contextUsed: response.contextUsed || response.context_used,
                processingTime: response.processingTime || response.processing_time_ms,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMsg]);

        } catch (err) {
            setError(err.message || 'Failed to get response');
            
            // Add error message
            const errorMsg = {
                id: Date.now() + 1,
                type: 'error',
                text: 'Sorry, I could not process your request. Please make sure the backend server is running.',
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Clear all messages
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages
    };
}
