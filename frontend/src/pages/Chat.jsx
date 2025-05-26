import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  X,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';

const Chat = () => {
  const { getToken } = useAuth();
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      } else if (data.type === 'typing') {
        setIsTyping(data.isTyping);
      }
    };

    return () => ws.close();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setMessages(data.messages);
      setChatInfo(data.chatInfo);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = await getToken();
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) throw new Error('Failed to send message');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = await getToken();
      const response = await fetch(`/api/chats/${chatId}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={chatInfo?.participant.avatar}
            alt={chatInfo?.participant.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{chatInfo?.participant.name}</h2>
            <p className="text-sm text-gray-500">
              {isTyping ? 'Typing...' : chatInfo?.participant.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {message.type === 'text' ? (
                  <p>{message.content}</p>
                ) : message.type === 'image' ? (
                  <img
                    src={message.content}
                    alt="Shared image"
                    className="rounded-lg max-w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <File className="w-5 h-5" />
                    <a
                      href={message.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {message.fileName}
                    </a>
                  </div>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 