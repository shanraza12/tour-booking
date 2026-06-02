// client/src/hooks/useSkyChat.js
import { useState } from 'react';
import axios from 'axios';

export const useSkyChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (userInput) => {
        setLoading(true);
        const newMessage = { role: "user", parts: [{ text: userInput }] };
        
        try {
            const response = await axios.post('/api/sky/chat', {
                message: userInput,
                chatHistory: messages
            });
            
            setMessages([...messages, newMessage, { role: "model", parts: [{ text: response.data.reply }] }]);
        } catch (err) {
            console.error("Chat Error", err);
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading };
};