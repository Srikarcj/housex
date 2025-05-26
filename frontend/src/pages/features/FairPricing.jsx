import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle, ArrowRight, RefreshCw, Home, Paintbrush, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';

const FairPricing = () => {
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();

  const pricePlans = [
    {
      name: 'Basic',
      price: '₹15,000',
      image: "https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg",
      features: [
        'Single room painting',
        'Basic color consultation',
        'Standard materials',
        '1-year warranty'
      ]
    },
    {
      name: 'Standard',
      price: '₹25,000',
      image: "https://images.pexels.com/photos/106936/pexels-photo-106936.jpeg",
      features: [
        'Up to 3 rooms',
        'Premium color consultation',
        'Premium materials',
        '2-year warranty',
        'Free touch-ups'
      ]
    },
    {
      name: 'Premium',
      price: '₹45,000',
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      features: [
        'Full house painting',
        'Expert color consultation',
        'Premium materials',
        '5-year warranty',
        'Free touch-ups',
        'Priority scheduling'
      ]
    }
  ];

  const quotes = {
    painting: [
      { amount: '₹18,000', description: 'Basic Interior Painting Package - Single Room', category: 'Painting', icon: Paintbrush },
      { amount: '₹28,000', description: 'Standard Exterior Painting Package - Front & Back', category: 'Painting', icon: Paintbrush },
      { amount: '₹45,000', description: 'Premium Full House Painting Package', category: 'Painting', icon: Paintbrush },
      { amount: '₹22,000', description: 'Custom Cabinet Refinishing - Kitchen', category: 'Painting', icon: Paintbrush },
      { amount: '₹35,000', description: 'Complete Home Renovation - Interior', category: 'Painting', icon: Paintbrush }
    ],
    building: [
      { amount: '₹12,00,000', description: 'New Home Construction - Basic Package', category: 'Building', icon: Home },
      { amount: '₹22,00,000', description: 'Home Extension - 2 Bedrooms', category: 'Building', icon: Home },
      { amount: '₹7,50,000', description: 'Kitchen Remodeling - Complete', category: 'Building', icon: Home },
      { amount: '₹4,00,000', description: 'Bathroom Renovation - Premium', category: 'Building', icon: Home },
      { amount: '₹18,00,000', description: 'Home Renovation - Full House', category: 'Building', icon: Home }
    ],
    design: [
      { amount: '₹75,000', description: 'Interior Design Consultation - Full House', category: 'Design', icon: Ruler },
      { amount: '₹1,25,000', description: 'Architectural Design - New Home', category: 'Design', icon: Ruler },
      { amount: '₹40,000', description: 'Color Scheme Design - Complete', category: 'Design', icon: Ruler },
      { amount: '₹60,000', description: 'Space Planning - Open Concept', category: 'Design', icon: Ruler },
      { amount: '₹1,50,000', description: 'Custom Furniture Design Package', category: 'Design', icon: Ruler }
    ]
  };

  const generateRandomQuote = () => {
    const categories = Object.keys(quotes);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryQuotes = quotes[randomCategory];
    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    setQuote(randomQuote);
  };

  const handleGetStarted = () => {
    toast.success('Successfully selected Fair Pricing service. Redirecting to sign up...');
    setTimeout(() => {
      navigate('/sign-up');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Transparent & Fair Pricing</h1>
            <p className="text-xl text-indigo-100">
              Get detailed quotes and choose from our competitive pricing plans
            </p>
          </div>
        </div>
      </div>

      {/* Price Plans Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Pricing Plans</h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the perfect plan for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricePlans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="text-4xl font-bold text-indigo-600 mb-6">{plan.price}</div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleGetStarted}
                    className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Generator Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get an Instant Quote</h2>
            <p className="mt-4 text-xl text-gray-600">
              Click below to receive a random quote for our services
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <button
              onClick={generateRandomQuote}
              className="w-full flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Request Quote
            </button>
            {quote && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    <quote.icon className="w-4 h-4 mr-2" />
                    {quote.category}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">{quote.amount}</h3>
                <p className="text-gray-600 mb-6">{quote.description}</p>
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Get Started with this Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Choose your plan and begin your project today
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairPricing; 