// src/services/api.js
// Connects React frontend to FastAPI backend

const API_BASE_URL = 'http://localhost:8000';

/**
 * Send chat message to backend
 * @param {string} message - User's health question
 * @param {string} language - Language code (en, ta, hi, etc.)
 * @returns {Promise<Object>} - Answer with sources and metadata
 */
export async function sendChatMessage(message, language = 'en') {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v2/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                language: language
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Check backend health status
 * @returns {Promise<Object>} - System status
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v2/health`);
        return await response.json();
    } catch (error) {
        return { status: 'offline', error: error.message };
    }
}

/**
 * Get list of loaded medical documents
 * @returns {Promise<Object>} - Documents list
 */
export async function getDocuments() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v2/documents`);
        return await response.json();
    } catch (error) {
        return { documents: [], error: error.message };
    }
}
