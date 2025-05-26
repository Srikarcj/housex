import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import {
  Send,
  Loader2,
  User,
  Bot,
  Search,
  Filter,
  X
} from 'lucide-react';

const AIChat = () => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProfessionals = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/professionals', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch professionals');
      const data = await response.json();
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast.error('Failed to load professionals');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedProfessional) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          professionalId: selectedProfessional._id
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Professionals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Professionals</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Professionals List */}
              <div className="space-y-2">
                {filteredProfessionals.map((professional) => (
                  <button
                    key={professional._id}
                    onClick={() => setSelectedProfessional(professional)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      selectedProfessional?._id === professional._id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{professional.name}</div>
                    <div className="text-sm text-gray-500">
                      {professional.services.join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                {selectedProfessional ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedProfessional.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedProfessional.services.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProfessional(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a professional to start chatting</p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSend} className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!selectedProfessional || isLoading}
                    className="flex-1 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!selectedProfessional || isLoading || !input.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 