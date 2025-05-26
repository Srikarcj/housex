import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Simulated AI-powered search suggestions
  const generateAISuggestions = async (searchQuery) => {
    // In a real app, this would call your AI service
    const mockSuggestions = [
      { type: 'painter', name: 'Interior Painters', count: 15 },
      { type: 'builder', name: 'Home Renovation', count: 8 },
      { type: 'service', name: 'Wall Painting', count: 12 },
      { type: 'location', name: 'Local Contractors', count: 20 }
    ].filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return mockSuggestions;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        const results = await generateAISuggestions(query);
        setSuggestions(results);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'painter':
        navigate('/professionals?type=painter');
        break;
      case 'builder':
        navigate('/professionals?type=builder');
        break;
      case 'service':
        navigate('/services');
        break;
      default:
        navigate('/search?q=' + encodeURIComponent(suggestion.name));
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for services, professionals, or locations..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (query.length > 2) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
          >
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading suggestions...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                >
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium text-gray-900">{suggestion.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({suggestion.count} results)
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No suggestions found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 