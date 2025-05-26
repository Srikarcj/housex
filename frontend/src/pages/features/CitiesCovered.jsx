import React from 'react';
import { MapPin, Users, Building2, Award } from 'lucide-react';

const CitiesCovered = () => {
  const cities = [
    {
      name: "New York",
      projects: 120,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      activeProfessionals: 45
    },
    {
      name: "Los Angeles",
      projects: 95,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      activeProfessionals: 38
    },
    {
      name: "Chicago",
      projects: 85,
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      activeProfessionals: 32
    },
    // Add more cities as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">50+ Cities Covered</h1>
              <p className="text-xl text-blue-100 mb-8">
                Bringing professional home services to neighborhoods across the country.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-300" />
                  <span className="ml-2 text-lg">Nationwide Coverage</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-blue-100">Cities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">1000+</div>
                    <div className="text-blue-100">Active Professionals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">4.9</div>
                    <div className="text-blue-100">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">Service Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Experts</h3>
            <p className="text-gray-600">
              Professional teams in every city, familiar with local requirements.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">City-Specific Services</h3>
            <p className="text-gray-600">
              Tailored solutions for each city's unique needs and regulations.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consistent Quality</h3>
            <p className="text-gray-600">
              Same high standards of service across all locations.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Cities Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{city.name}</h3>
                    <span className="text-sm font-medium text-blue-600">{city.rating} ★</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>Projects Completed: {city.projects}</p>
                    <p>Active Professionals: {city.activeProfessionals}</p>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View Services
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Find Services in Your City</h2>
          <p className="text-xl text-blue-100 mb-8">
            Professional home services available in your area
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitiesCovered; 