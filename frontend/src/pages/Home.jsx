import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Users, Clock, DollarSign, ChevronRight, Search, MapPin } from 'lucide-react';
import WhyChooseUs from '../components/WhyChooseUs';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 5,
    text: "The team did an amazing job with our interior painting. They were professional, clean, and the results exceeded our expectations. Highly recommend!",
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Michael Brown',
    role: 'Property Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 5,
    text: "We've used their services for multiple properties and they consistently deliver quality work. Their attention to detail and professionalism is outstanding.",
    location: 'Los Angeles, CA'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    rating: 5,
    text: "The cabinet refinishing service transformed our kitchen. The team was efficient and the quality of work was exceptional. Will definitely use them again!",
    location: 'Chicago, IL'
  }
];

const services = [
  {
    id: 1,
    name: 'Interior Painting',
    description: 'Transform your living spaces with our professional interior painting services.',
    image: 'https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/services/interior-painting'
  },
  {
    id: 2,
    name: 'Exterior Painting',
    description: 'Protect and beautify your home\'s exterior with our comprehensive painting services.',
    image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/services/exterior-painting'
  },
  {
    id: 3,
    name: 'Cabinet Refinishing',
    description: 'Give your kitchen a fresh look with our cabinet refinishing service.',
    image: 'https://images.pexels.com/photos/3990595/pexels-photo-3990595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    link: '/services/cabinet-refinishing'
  }
];

const Home = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const professionals = [
    { id: 1, name: 'Rajesh Kumar', role: 'Lead Painter', location: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 2, name: 'Priya Sharma', role: 'Senior Contractor', location: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { id: 3, name: 'Arjun Patel', role: 'Technical Specialist', location: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 4, name: 'Suresh Singh', role: 'Painter', location: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { id: 5, name: 'Anita Desai', role: 'Builder', location: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  ];

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setNotFoundMessage('Please enter a location to search.');
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setNotFoundMessage('');
    setSearchResults([]);

    setTimeout(() => {
      const filteredProfessionals = professionals.filter(
        (pro) => pro.location.toLowerCase() === searchLocation.trim().toLowerCase()
      );

      setSearchResults(filteredProfessionals);
      setLoading(false);

      if (filteredProfessionals.length === 0) {
        setNotFoundMessage(`No professionals found in ${searchLocation}.`);
      }

    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Trusted
              <br />
              House Builders & Painters
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl md:max-w-none">
              Transform your space with our expert painting and finishing services. Quality workmanship guaranteed.
            </p>
            <div className="max-w-xl md:max-w-none mx-auto md:mx-0">
              <div className="flex items-center bg-white rounded-lg p-2 shadow-lg">
                <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Enter your location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1 px-4 py-2 focus:outline-none text-gray-900"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  {loading ? 'Searching...' : 'Search'}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
              </div>
              {notFoundMessage && (
                <p className="mt-4 text-red-300 text-center md:text-left">{notFoundMessage}</p>
              )}
            </div>
          </div>
          {/* Decorative Design Element and Illustration */}
          <div className="flex-1 flex justify-center md:justify-end z-10 relative items-end">
            {/* Abstract shape or pattern goes here */}
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white bg-opacity-20 rounded-full mix-blend-screen blur-3xl animate-pulse-slow absolute bottom-0 right-1/4 transform translate-x-1/2"></div>
             <img
              src="https://img.freepik.com/free-vector/construction-engineer-cartoon-illustration_1150-62590.jpg"
              alt="Cartoon builder illustration"
              className="w-64 md:w-80 lg:w-96 object-contain relative z-20 animate-float hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
        </div>
        {/* Background blob/shape - can be added here if needed */}
      </div>

      {/* Map Display Area */}
      {searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Professionals Found</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(pro => (
              <div key={pro.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900">{pro.name}</h3>
                <p className="text-gray-600">{pro.role} in {pro.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Services Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              Find the perfect solution for your painting and finishing needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                className="block transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                   <div className="p-6 pt-0 flex items-center text-indigo-600 group-hover:text-indigo-800 font-semibold">
                    Learn More
                    <ChevronRight className="ml-1 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-lg"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Book a consultation with our experts today
            </p>
            <Link
              to="/bookings"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 