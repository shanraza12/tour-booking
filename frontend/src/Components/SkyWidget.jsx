import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // cite: 935
import axios from 'axios'; // cite: 119
import { MessageCircle, Send, X, Bot, RefreshCw } from 'lucide-react'; // cite: 934

export default function SkyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll logic for new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await axios.post("http://localhost:4000/api/v1/sky/chat", {
        message: input,
        history: currentHistory 
      });

      setMessages(prev => [...prev, { role: "model", parts: [{ text: data.reply }] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", parts: [{ text: "Sky is currently offline." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fixed positioning to the LEFT using Bootstrap style properties
    <div className="position-fixed bottom-0 right-5 start-0 m-4" style={{ zIndex: 1050 }}>
      
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
        style={{ width: '60px', height: '60px' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="card shadow-2xl position-absolute border-0"
            style={{ 
              bottom: '80px', 
              left: '0', 
              width: '350px', 
              height: '500px', 
              borderRadius: '15px',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center gap-2">
                <Bot size={20} />
                <div>
                  <h6 className="mb-0 fw-bold">Sky Agent</h6>
                  <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>Virtual Travel Expert</small>
                </div>
              </div>
              <button 
                onClick={() => setMessages([])} 
                className="btn btn-sm text-white p-0"
                title="Reset Chat"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef} 
              className="card-body bg-light overflow-auto p-3" 
              style={{ flex: '1' }}
            >
              {messages.length === 0 && (
                <div className="text-center mt-5 text-muted">
                  <p className="small">Hi! I'm Sky. Ask me about tour packages! 🏔️</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div 
                    className={`p-2 rounded-3 shadow-sm small ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-white border text-dark'
                    }`}
                    style={{ maxWidth: '85%' }}
                  >
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-muted small italic animate-pulse">Sky is thinking...</div>
              )}
            </div>

            {/* Footer Form */}
            <div className="card-footer bg-white border-top-0 p-3">
              <form onSubmit={handleSend} className="input-group">
                <input 
                  type="text"
                  className="form-control form-control-sm rounded-pill bg-light border-0 ps-3"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn btn-link text-primary p-1 ms-2"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}