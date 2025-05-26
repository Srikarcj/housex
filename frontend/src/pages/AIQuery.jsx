import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Send, Bot, Loader2, Sparkles, MessageSquare, Trash2, Settings, Info, HelpCircle, Clock, Star, Shield, Calendar, DollarSign, Users, Home, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AIQuery = () => {
  const { getToken } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [context, setContext] = useState({});
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const chatContainerRef = useRef(null);

  // Site knowledge base
  const siteKnowledge = {
    services: {
      painting: {
        types: ['interior', 'exterior', 'cabinet', 'texture', 'color_consultation'],
        process: ['consultation', 'quote', 'preparation', 'execution', 'inspection'],
        materials: ['premium_paint', 'eco_friendly', 'specialty_finishes'],
        warranty: '2 years on workmanship'
      },
      renovation: {
        types: ['kitchen', 'bathroom', 'basement', 'room_addition', 'general'],
        process: ['design', 'permits', 'execution', 'inspection'],
        materials: ['premium', 'standard', 'budget'],
        warranty: '1 year on workmanship'
      },
      maintenance: {
        types: ['preventive', 'emergency', 'routine', 'seasonal'],
        response_time: {
          emergency: '2-4 hours',
          routine: '24-48 hours'
        }
      }
    },
    pricing: {
      painting: {
        interior: '$2-4 per sq ft',
        exterior: '$3-6 per sq ft',
        cabinet: '$50-100 per door',
        factors: ['surface_area', 'paint_quality', 'preparation_needed']
      },
      renovation: {
        kitchen: '$15,000-50,000',
        bathroom: '$8,000-25,000',
        basement: '$20-50 per sq ft',
        factors: ['scope', 'materials', 'labor', 'permits']
      }
    },
    booking: {
      process: ['service_selection', 'date_time', 'professional_matching', 'confirmation'],
      payment: ['credit_card', 'bank_transfer', 'financing_available'],
      cancellation: '24 hours notice required'
    },
    professionals: {
      requirements: ['licensed', 'insured', 'background_checked', 'experience'],
      rating_system: '5-star based on customer reviews',
      specialties: ['painting', 'renovation', 'maintenance']
    }
  };

  // Common user prompts and responses
  const commonPrompts = {
    greetings: {
      patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        "Hello! I'm your home services assistant. How can I help you today?",
        "Hi there! I'm here to help with all your home service needs. What can I assist you with?",
        "Good day! I'm ready to help you with painting, renovation, or maintenance services. What would you like to know?"
      ]
    },
    service_inquiries: {
      patterns: ['what services', 'what do you offer', 'what can you do', 'help me with'],
      responses: [
        "We offer a wide range of home services including:\n• Interior & Exterior Painting\n• Home Renovation\n• Maintenance & Repairs\n• Emergency Services\n\nWhich service interests you the most?",
        "Our services include professional painting, renovation, and maintenance solutions. Would you like details about any specific service?"
      ]
    },
    pricing_questions: {
      patterns: ['how much', 'what is the cost', 'price', 'cost', 'budget'],
      responses: [
        "Our pricing varies based on the project scope. We offer free consultations to provide accurate estimates. Would you like to know more about pricing for a specific service?",
        "We provide transparent pricing with no hidden fees. Would you like a detailed quote for your project?"
      ]
    },
    booking_questions: {
      patterns: ['how to book', 'schedule', 'appointment', 'when can you come', 'availability'],
      responses: [
        "Booking is easy! You can:\n1. Choose your service\n2. Select a preferred date\n3. Get matched with professionals\n4. Receive confirmation\n\nWould you like to start the booking process?",
        "We have flexible scheduling options. When would you like to schedule your service?"
      ]
    },
    emergency_queries: {
      patterns: ['emergency', 'urgent', 'asap', 'immediately', 'right now'],
      responses: [
        "For emergencies, we offer 24/7 service with a 2-4 hour response time. Please describe your emergency, and we'll respond immediately.",
        "We understand emergencies need quick attention. Our team is available 24/7. What's the nature of your emergency?"
      ]
    },
    warranty_questions: {
      patterns: ['warranty', 'guarantee', 'assurance', 'coverage'],
      responses: [
        "We offer comprehensive warranties:\n• Painting: 2 years on workmanship\n• Renovation: 1 year on workmanship\n• All materials: Manufacturer warranty\n\nWould you like more details about our warranty coverage?",
        "All our work comes with a satisfaction guarantee and warranty coverage. What specific service are you interested in?"
      ]
    },
    professional_queries: {
      patterns: ['who will come', 'are you licensed', 'experience', 'qualifications'],
      responses: [
        "Our professionals are:\n• Fully licensed and insured\n• Background checked\n• Experienced in their field\n• Customer-rated\n\nWould you like to see available professionals in your area?",
        "We only work with qualified, experienced professionals. Would you like to know more about our team?"
      ]
    },
    payment_questions: {
      patterns: ['how to pay', 'payment options', 'financing', 'credit card'],
      responses: [
        "We accept various payment methods:\n• Credit/Debit Cards\n• Bank Transfer\n• Financing Options\n• Cash\n\nWould you like to know more about our payment options?",
        "We offer flexible payment options to suit your needs. What payment method would you prefer?"
      ]
    },
    timeline_questions: {
      patterns: ['how long', 'duration', 'timeframe', 'when will it be done'],
      responses: [
        "Project timelines vary based on scope. We'll provide a detailed timeline during your free consultation. Would you like to schedule one?",
        "We can give you an accurate timeline after assessing your project. What type of service are you considering?"
      ]
    },
    quality_questions: {
      patterns: ['quality', 'materials', 'standards', 'guarantee'],
      responses: [
        "We use only premium materials and maintain high standards:\n• Quality-tested materials\n• Skilled professionals\n• Quality control checks\n• Satisfaction guarantee\n\nWould you like to know more about our quality standards?",
        "Quality is our priority. We use top-grade materials and follow strict quality control procedures."
      ]
    }
  };

  // Quick prompt suggestions
  const quickPrompts = [
    "What services do you offer?",
    "How much does painting cost?",
    "How do I book a service?",
    "What's your emergency response time?",
    "Do you offer warranties?",
    "Are your professionals licensed?",
    "What payment methods do you accept?",
    "How long does a typical project take?",
    "What materials do you use?",
    "Do you offer free consultations?"
  ];

  // Enhanced response system with common prompts
  const getEnhancedResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    const currentContext = context;

    // Check common prompts first
    for (const [category, data] of Object.entries(commonPrompts)) {
      if (data.patterns.some(pattern => lowerQuery.includes(pattern))) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }

    // If no common prompt matches, use the existing response system
    return getDetailedResponse(query);
  };

  // Detailed response system for specific queries
  const getDetailedResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Service-related queries
    if (lowerQuery.includes('service') || lowerQuery.includes('help')) {
      if (lowerQuery.includes('painting')) {
        const paintingInfo = siteKnowledge.services.painting;
        return `Our professional painting services include:\n\nTypes of Services:\n• ${paintingInfo.types.join('\n• ')}\n\nOur Process:\n• ${paintingInfo.process.join('\n• ')}\n\nMaterials We Use:\n• ${paintingInfo.materials.join('\n• ')}\n\nWarranty: ${paintingInfo.warranty}\n\nWould you like to know more about any specific aspect of our painting services?`;
      }
      
      if (lowerQuery.includes('renovation')) {
        const renovationInfo = siteKnowledge.services.renovation;
        return `Our renovation services include:\n\nTypes of Renovations:\n• ${renovationInfo.types.join('\n• ')}\n\nOur Process:\n• ${renovationInfo.process.join('\n• ')}\n\nMaterial Options:\n• ${renovationInfo.materials.join('\n• ')}\n\nWarranty: ${renovationInfo.warranty}\n\nWhat type of renovation project are you considering?`;
      }

      if (lowerQuery.includes('maintenance')) {
        const maintenanceInfo = siteKnowledge.services.maintenance;
        return `Our maintenance services include:\n\nTypes of Maintenance:\n• ${maintenanceInfo.types.join('\n• ')}\n\nResponse Times:\n• Emergency: ${maintenanceInfo.response_time.emergency}\n• Routine: ${maintenanceInfo.response_time.routine}\n\nWould you like to schedule a maintenance service?`;
      }

      return `We offer a comprehensive range of home services:\n\n• Painting Services\n• Renovation & Remodeling\n• Maintenance & Repairs\n• Emergency Services\n\nEach service comes with:\n• Professional, licensed contractors\n• Quality materials\n• Warranty coverage\n• Customer satisfaction guarantee\n\nWhich service interests you the most?`;
    }
    
    // Pricing-related queries with detailed information
    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      if (lowerQuery.includes('painting')) {
        const paintingPricing = siteKnowledge.pricing.painting;
        return `Our painting services are priced as follows:\n\n• Interior Painting: ${paintingPricing.interior}\n• Exterior Painting: ${paintingPricing.exterior}\n• Cabinet Refinishing: ${paintingPricing.cabinet}\n\nPricing factors include:\n• ${paintingPricing.factors.join('\n• ')}\n\nWe offer free consultations and detailed quotes. Would you like to schedule one?`;
      }

      if (lowerQuery.includes('renovation')) {
        const renovationPricing = siteKnowledge.pricing.renovation;
        return `Our renovation services are priced as follows:\n\n• Kitchen Renovation: ${renovationPricing.kitchen}\n• Bathroom Renovation: ${renovationPricing.bathroom}\n• Basement Finishing: ${renovationPricing.basement}\n\nPricing factors include:\n• ${renovationPricing.factors.join('\n• ')}\n\nWe provide detailed quotes after a free consultation. Would you like to schedule one?`;
      }

      return `Our pricing is transparent and based on your specific needs. We consider:\n\n• Project scope and complexity\n• Materials and finishes\n• Labor requirements\n• Timeline and scheduling\n\nWe offer free consultations to provide accurate estimates. Would you like to schedule one?`;
    }

    // Booking-related queries with process details
    if (lowerQuery.includes('book') || lowerQuery.includes('appointment')) {
      const bookingInfo = siteKnowledge.booking;
      return `Here's our simple booking process:\n\n1. ${bookingInfo.process[0]}\n2. ${bookingInfo.process[1]}\n3. ${bookingInfo.process[2]}\n4. ${bookingInfo.process[3]}\n\nPayment Options:\n• ${bookingInfo.payment.join('\n• ')}\n\nCancellation Policy: ${bookingInfo.cancellation}\n\nWould you like to start the booking process now?`;
    }

    // Professional-related queries
    if (lowerQuery.includes('professional') || lowerQuery.includes('contractor')) {
      const proInfo = siteKnowledge.professionals;
      return `Our professionals are:\n\nRequirements:\n• ${proInfo.requirements.join('\n• ')}\n\nSpecialties:\n• ${proInfo.specialties.join('\n• ')}\n\nRating System: ${proInfo.rating_system}\n\nWould you like to see available professionals in your area?`;
    }

    // Emergency service queries
    if (lowerQuery.includes('emergency') || lowerQuery.includes('urgent')) {
      return `For emergency services:\n\n• 24/7 availability\n• ${siteKnowledge.services.maintenance.response_time.emergency} response time\n• Emergency repair specialists\n• Priority scheduling\n• Immediate assessment and solution\n\nPlease describe your emergency, and we'll respond immediately.`;
    }

    // General queries with helpful suggestions
    return `I understand you're looking for information. To help you better, please specify:\n\n• The type of service you need\n• Your timeline\n• Any specific requirements\n• Your location\n\nThis will help me provide more detailed and relevant information about our services, pricing, and available professionals.`;
  };

  const handleQuickPrompt = (prompt) => {
    setQuery(prompt);
    // Automatically submit the form
    const event = new Event('submit', { cancelable: true });
    document.querySelector('form').dispatchEvent(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/professionals/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query,
          context: context
        })
      });

      let data;
      if (!response.ok) {
        console.warn('API call failed, using enhanced response system');
        data = { response: getEnhancedResponse(query) };
      } else {
        data = await response.json();
      }
      
      const newContext = updateContext(query, data.response);
      setContext(newContext);
      
      setResponse(data.response);
      setChatHistory(prev => [...prev, { query, response: data.response }]);
      setQuery('');
      setShowQuickPrompts(false); // Hide quick prompts after first interaction
    } catch (error) {
      console.error('AI query error:', error);
      const enhancedResponse = getEnhancedResponse(query);
      setResponse(enhancedResponse);
      setChatHistory(prev => [...prev, { query, response: enhancedResponse }]);
      setQuery('');
      setShowQuickPrompts(false);
      toast.error('Using enhanced response system');
    } finally {
      setIsLoading(false);
    }
  };

  // Update context based on conversation
  const updateContext = (query, response) => {
    const lowerQuery = query.toLowerCase();
    const newContext = { ...context };

    // Track service interests
    if (lowerQuery.includes('painting')) {
      newContext.interestedService = 'painting';
    } else if (lowerQuery.includes('renovation')) {
      newContext.interestedService = 'renovation';
    } else if (lowerQuery.includes('maintenance')) {
      newContext.interestedService = 'maintenance';
    }

    // Track pricing interests
    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      newContext.pricingInquiry = true;
    }

    // Track booking stage
    if (lowerQuery.includes('book') || lowerQuery.includes('schedule')) {
      newContext.bookingStage = 'interested';
    }

    return newContext;
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setResponse('');
    setContext({});
    toast.success('Chat history cleared');
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={clearChatHistory}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Prompts */}
            {showQuickPrompts && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Questions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-left p-2 text-sm text-gray-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat History */}
            <div 
              ref={chatContainerRef}
              className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
            >
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-3">
                  {/* User Message */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-3 bg-indigo-50 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm font-medium text-indigo-900">You</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{chat.query}</p>
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 bg-green-50 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm font-medium text-green-900">AI Assistant</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{chat.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Query Input */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything about our services..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </div>
  );
};

export default AIQuery; 