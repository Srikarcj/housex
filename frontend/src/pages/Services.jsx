import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, Clock, DollarSign, Star, ChevronRight, Search, Filter, Plus } from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Interior Painting',
    description: 'Transform your living spaces with our professional interior painting services. We use premium quality paints and expert techniques to deliver flawless results.',
    duration: '2-3 days',
    price: 'Starting from $500',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Premium quality paints',
      'Detailed surface preparation',
      'Clean and professional finish',
      'Color consultation included',
      'Furniture protection'
    ],
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    name: 'Exterior Painting',
    description: "Protect and beautify your home's exterior with our comprehensive painting services. We use weather-resistant coatings to ensure long-lasting results.",
    duration: '3-4 days',
    price: 'Starting from $800',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Weather-resistant coatings',
      'Surface preparation and repair',
      'Pressure washing included',
      'Trim and detail work',
      '5-year warranty'
    ],
    rating: 4.8,
    reviews: 95
  },
  {
    id: 3,
    name: 'Cabinet Refinishing',
    description: "Give your kitchen a fresh look with our cabinet refinishing service. We'll transform your existing cabinets with a beautiful new finish.",
    duration: '2-3 days',
    price: 'Starting from $600',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Custom color matching',
      'Hardware replacement',
      'Thorough cleaning',
      'Durable finishes',
      'Minimal disruption'
    ],
    rating: 4.9,
    reviews: 76
  },
  {
    id: 4,
    name: 'Wallpaper Installation',
    description: 'Add texture and personality to your walls with our professional wallpaper installation service. We handle everything from selection to installation.',
    duration: '1-2 days',
    price: 'Starting from $400',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Pattern matching',
      'Seamless installation',
      'Wall preparation',
      'Removal of old wallpaper',
      'Clean up included'
    ],
    rating: 4.7,
    reviews: 82
  },
  {
    id: 5,
    name: 'Deck Staining',
    description: 'Protect and enhance your outdoor living space with our deck staining service. We use premium stains to ensure long-lasting beauty and protection.',
    duration: '1-2 days',
    price: 'Starting from $450',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Premium deck stains',
      'Surface preparation',
      'Repair of damaged areas',
      'Weather protection',
      '3-year warranty'
    ],
    rating: 4.8,
    reviews: 64
  },
  {
    id: 6,
    name: 'Faux Finishing',
    description: 'Add unique texture and character to your walls with our faux finishing techniques. Create stunning visual effects that transform your space.',
    duration: '2-3 days',
    price: 'Starting from $700',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: [
      'Custom design consultation',
      'Multiple technique options',
      'Premium materials',
      'Expert application',
      'Unique finishes'
    ],
    rating: 4.9,
    reviews: 45
  }
];

const categories = [
  'All Services',
  'Interior',
  'Exterior',
  'Cabinets',
  'Walls',
  'Decks',
  'Specialty'
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All Services' || 
      service.name.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of professional painting and finishing services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Services
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by service name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center bg-white rounded-full px-3 py-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-900 font-semibold">{service.rating}</span>
                  <span className="ml-1 text-gray-500">({service.reviews})</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>{service.price}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Learn More
                  </button>
                  <Link
                    to="/bookings"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-600">{selectedService.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-600">{selectedService.price}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-900 font-semibold">{selectedService.rating}</span>
                    <span className="ml-1 text-gray-500">({selectedService.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Description</h3>
                <p className="text-gray-600 mb-6">{selectedService.description}</p>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                <ul className="space-y-2 mb-6">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end">
                  <Link
                    to="/bookings"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 