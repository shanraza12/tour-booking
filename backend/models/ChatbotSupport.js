import mongoose from 'mongoose';

const ChatbotSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  query: { 
    type: String, 
    required: true 
  }, 
  api_embedding: { 
    type: String 
  }, // Stores data like encrypted biometric or vector context [cite: 406]
  captureTime: { 
    type: Date, 
    default: Date.now 
  } // Timestamp for the interaction [cite: 408]
});

// Use export default for ESM compatibility
const ChatbotSupport = mongoose.model('ChatbotSupport', ChatbotSchema);
export default ChatbotSupport;