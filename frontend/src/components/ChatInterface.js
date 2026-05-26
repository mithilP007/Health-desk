// src/components/ChatInterface.js
// Main chat interface connecting to backend

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import { Mic, Send, Loader, MicOff } from 'lucide-react';
import './ChatInterface.css';

function ChatInterface() {
    const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧', locale: 'en-US' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', locale: 'ta-IN' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳', locale: 'hi-IN' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳', locale: 'te-IN' },
    ];

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            const currentLangObj = languages.find(l => l.code === language);
            recognition.lang = currentLangObj ? currentLangObj.locale : 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInput(prev => prev ? prev + ' ' + transcript : transcript);
                }
            };

            recognitionRef.current = recognition;
        }
    }, [language]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const msg = input.trim();
        setInput('');
        await sendMessage(msg, language);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickQuestion = (question) => {
        setInput(question);
        sendMessage(question, language);
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error("Recognition start error:", err);
            }
        }
    };

    return (
        <div className="chat-interface">
            {/* Header */}
            <header className="chat-header">
                <div className="header-left">
                    <div className="logo">🏥</div>
                    <div>
                        <h1>HealthDesk Pro</h1>
                        <span className="status-badge">🔒 Offline • AI Medical Reasoning</span>
                    </div>
                </div>
                
                <div className="header-right">
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                    
                    <button className="clear-btn" onClick={clearMessages}>
                        Clear
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <main className="messages-area">
                {messages.length === 0 ? (
                    <div className="welcome-screen">
                        <div className="welcome-icon">🩺</div>
                        <h2>How can I help you today?</h2>
                        <p>Ask about symptoms, diseases, or general health information</p>
                        
                        <div className="quick-questions">
                            <button onClick={() => handleQuickQuestion("What are dengue symptoms?")}>
                                🤒 What are dengue symptoms?
                            </button>
                            <button onClick={() => handleQuickQuestion("How to prevent malaria?")}>
                                🦟 How to prevent malaria?
                            </button>
                            <button onClick={() => handleQuickQuestion("I have chest pain")}>
                                🚨 I have chest pain
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="loading-indicator">
                                <Loader className="spin" size={24} />
                                <span>Analyzing with medical AI...</span>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Error Banner */}
            {error && (
                <div className="error-banner">
                    ⚠️ {error}. Make sure backend is running on localhost:8000
                </div>
            )}

            {/* Input Area */}
            <footer className="input-area">
                <button 
                    className={`mic-btn ${isListening ? 'listening' : ''}`} 
                    onClick={handleMicClick}
                    title={isListening ? "Listening... Click to stop" : "Voice input"}
                    type="button"
                >
                    {isListening ? <MicOff size={20} className="pulse-mic" /> : <Mic size={20} />}
                </button>
                
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening... Speak now..." : "Describe symptoms or ask a health question..."}
                    disabled={isLoading}
                    className="chat-input"
                />
                
                <button 
                    className="send-btn" 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                >
                    <Send size={20} />
                </button>
            </footer>
        </div>
    );
}

export default ChatInterface;
