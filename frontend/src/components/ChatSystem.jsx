import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Bot, User, Loader2, Settings, History, Trash2 } from 'lucide-react';

const ChatSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI response generation with context awareness
  const generateAIResponse = async (message) => {
    // Analyze message intent and context
    const intent = analyzeIntent(message);
    const relevantContext = getRelevantContext(message, context);
    
    // Generate response based on intent and context
    const responses = {
      greeting: {
        morning: 'Good morning! How can I assist you today?',
        afternoon: 'Good afternoon! How can I help you?',
        evening: 'Good evening! What can I do for you?',
        default: 'Hello! How can I help you today?'
      },
      question: {
        service: 'I can help you with various home services including painting, renovation, and maintenance. What specific service are you interested in?',
        booking: 'I can help you book a service. Would you like to see available professionals in your area?',
        pricing: 'Our pricing varies based on the service and scope. Could you provide more details about what you need?',
        default: 'I understand your question. Let me help you with that.'
      },
      feedback: {
        positive: 'Thank you for your positive feedback! We\'re glad we could help.',
        negative: 'I\'m sorry to hear that. Please let me know how we can improve your experience.',
        default: 'Thank you for your feedback. We value your input.'
      },
      default: 'I understand. How else can I assist you?'
    };

    // Determine time of day for greeting
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    return new Promise((resolve) => {
      setTimeout(() => {
        let response;
        if (intent.type === 'greeting') {
          response = responses.greeting[timeOfDay] || responses.greeting.default;
        } else if (intent.type === 'question') {
          response = responses.question[intent.subtype] || responses.question.default;
        } else if (intent.type === 'feedback') {
          response = responses.feedback[intent.sentiment] || responses.feedback.default;
        } else {
          response = responses.default;
        }

        // Add context-aware information if available
        if (relevantContext) {
          response += ` ${relevantContext}`;
        }

        resolve(response);
      }, 1000);
    });
  };

  // Analyze message intent
  const analyzeIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/^(hi|hello|hey|good (morning|afternoon|evening))/)) {
      return { type: 'greeting' };
    }
    
    if (lowerMessage.includes('?')) {
      if (lowerMessage.includes('service')) {
        return { type: 'question', subtype: 'service' };
      }
      if (lowerMessage.includes('book')) {
        return { type: 'question', subtype: 'booking' };
      }
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return { type: 'question', subtype: 'pricing' };
      }
      return { type: 'question' };
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('great') || lowerMessage.includes('awesome')) {
      return { type: 'feedback', sentiment: 'positive' };
    }
    
    if (lowerMessage.includes('bad') || lowerMessage.includes('poor') || lowerMessage.includes('terrible')) {
      return { type: 'feedback', sentiment: 'negative' };
    }
    
    return { type: 'default' };
  };

  // Get relevant context based on message
  const getRelevantContext = (message, context) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('service') && context.lastService) {
      return `Based on your previous interest in ${context.lastService}, I can provide more specific information.`;
    }
    
    if (lowerMessage.includes('book') && context.lastBooking) {
      return `I see you were interested in booking ${context.lastBooking}. Would you like to proceed with that?`;
    }
    
    return null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Update context based on user message
    const intent = analyzeIntent(inputMessage);
    if (intent.type === 'question' && intent.subtype === 'service') {
      setContext(prev => ({ ...prev, lastService: inputMessage }));
    }
    if (intent.type === 'question' && intent.subtype === 'booking') {
      setContext(prev => ({ ...prev, lastBooking: inputMessage }));
    }

    const aiResponse = await generateAIResponse(inputMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, botMessage]);
    setChatHistory(prev => [...prev, { user: userMessage, bot: botMessage }]);
    setIsTyping(false);
  };

  const clearChatHistory = () => {
    setMessages([]);
    setChatHistory([]);
    setContext({});
    localStorage.removeItem('chatHistory');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-gray-200"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearChatHistory}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                    </div>
                    <p>{message.text}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSystem; 