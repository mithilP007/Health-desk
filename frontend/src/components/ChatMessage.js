// src/components/ChatMessage.js
// Individual chat message with formatting

import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message }) {
    const { type, text, sources, confidence, emergency, emergencyLevel, emergencyAction, processingTime } = message;

    // Emergency banner for bot messages
    const renderEmergencyBanner = () => {
        if (!emergency) return null;
        
        return (
            <div className={`emergency-banner ${emergencyLevel?.toLowerCase()}`}>
                <div className="emergency-icon">🚨</div>
                <div className="emergency-content">
                    <div className="emergency-title">{emergencyLevel} EMERGENCY DETECTED</div>
                    <div className="emergency-action">{emergencyAction}</div>
                    <button className="call-108-btn" onClick={() => window.location.href = 'tel:108'}>
                        📞 Call 108
                    </button>
                </div>
            </div>
        );
    };

    // Sources panel
    const renderSources = () => {
        if (!sources || sources.length === 0) return null;
        
        return (
            <div className="sources-panel">
                <div className="sources-title">📚 Medical Sources</div>
                {sources.map((source, index) => {
                    const docName = source.document || source.filename || source.file || "Unknown Guideline";
                    const pageNo = source.page || source.page_no || source.page_number || 1;
                    const relevanceVal = source.relevance || source.score || 0.95;
                    return (
                        <div key={index} className="source-item">
                            <span className="source-doc">{docName}</span>
                            <span className="source-page">Page {pageNo}</span>
                            <span className="source-relevance">{Math.round(relevanceVal * 100)}% match</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Confidence indicator
    const renderConfidence = () => {
        if (!confidence) return null;
        
        return (
            <div className="confidence-bar">
                <div className="confidence-label">Confidence: {confidence}%</div>
                <div className="confidence-track">
                    <div 
                        className="confidence-fill" 
                        style={{ width: `${confidence}%` }}
                    />
                </div>
            </div>
        );
    };

    // Processing time
    const renderMeta = () => {
        if (!processingTime) return null;
        
        return (
            <div className="message-meta">
                <span>⚡ {Math.round(processingTime)}ms</span>
                <span>•</span>
                <span>🔒 Offline</span>
            </div>
        );
    };

    return (
        <div className={`message ${type}`}>
            <div className="message-avatar">
                {type === 'user' ? '👤' : type === 'error' ? '⚠️' : '🏥'}
            </div>
            
            <div className="message-content">
                {/* Emergency banner (only for bot with emergency) */}
                {type === 'bot' && renderEmergencyBanner()}
                
                {/* Main text */}
                <div className="message-text">{text}</div>
                
                {/* Sources (only for bot) */}
                {type === 'bot' && renderSources()}
                
                {/* Confidence (only for bot) */}
                {type === 'bot' && renderConfidence()}
                
                {/* Meta info */}
                {type === 'bot' && renderMeta()}
                
                {/* Disclaimer (only for bot) */}
                {type === 'bot' && (
                    <div className="disclaimer">
                        ⚠️ General information only. Consult a qualified healthcare provider.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;
