import React, { useState } from 'react';
import { Star, MapPin, Clock, Award, Shield, Users, Filter } from 'lucide-react';

const professionals = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Master Painter',
    experience: '15+ years',
    rating: 4.9,
    reviews: 128,
    location: 'New York, NY',
    specialties: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    availability: 'Available next week',
    certifications: ['Certified Master Painter', 'Safety First Certified'],
    bio: 'With over 15 years of experience, John specializes in high-end residential and commercial painting projects. His attention to detail and commitment to quality has earned him numerous industry awards.'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Interior Design Specialist',
    experience: '12+ years',
    rating: 4.8,
    reviews: 95,
    location: 'Los Angeles, CA',
    specialties: ['Color Consultation', 'Wallpaper Installation', 'Faux Finishing'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    availability: 'Available this week',
    certifications: ['Interior Design Certification', 'Color Theory Expert'],
    bio: 'Sarah brings creativity and expertise to every project. Her background in interior design allows her to provide comprehensive solutions that transform spaces into beautiful, functional environments.'
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'Exterior Specialist',
    experience: '10+ years',
    rating: 4.7,
    reviews: 82,
    location: 'Chicago, IL',
    specialties: ['Exterior Painting', 'Deck Staining', 'Weather Protection'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    availability: 'Available in 2 weeks',
    certifications: ['Exterior Specialist', 'Weather Protection Certified'],
    bio: 'Michael specializes in exterior projects, ensuring your home is protected and beautiful. His expertise in weather-resistant coatings and surface preparation guarantees long-lasting results.'
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'Cabinet Refinishing Expert',
    experience: '8+ years',
    rating: 4.9,
    reviews: 76,
    location: 'Miami, FL',
    specialties: ['Cabinet Refinishing', 'Wood Staining', 'Custom Finishes'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    availability: 'Available next week',
    certifications: ['Cabinet Refinishing Expert', 'Wood Finishing Specialist'],
    bio: 'Emily is passionate about transforming kitchens through cabinet refinishing. Her attention to detail and custom finishing techniques have made her a sought-after expert in the field.'
  }
];

const specialties = [
  'All Specialties',
  'Interior Painting',
  'Exterior Painting',
  'Cabinet Refinishing',
  'Wallpaper Installation',
  'Deck Staining',
  'Faux Finishing',
  'Color Consultation'
];

const Professionals = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || 
      professional.specialties.includes(selectedSpecialty);
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Our Professionals
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Our team of experienced professionals is ready to bring your vision to life
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Professionals
              </label>
              <input
                type="text"
                placeholder="Search by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{professional.name}</h3>
                    <p className="text-gray-600">{professional.role}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-900 font-semibold">{professional.rating}</span>
                    <span className="ml-1 text-gray-500">({professional.reviews})</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{professional.experience} experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{professional.availability}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfessional(professional)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Details Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <img
                  src={selectedProfessional.image}
                  alt={selectedProfessional.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProfessional.name}</h2>
                  <p className="text-gray-600">{selectedProfessional.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfessional(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{selectedProfessional.bio}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProfessional.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h3>
                <div className="space-y-2">
                  {selectedProfessional.certifications.map((certification, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <Shield className="w-5 h-5 text-indigo-600 mr-2" />
                      <span>{certification}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-900 font-semibold">{selectedProfessional.rating}</span>
                  <span className="ml-1 text-gray-500">({selectedProfessional.reviews} reviews)</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProfessional(null);
                    // Navigate to bookings page
                    window.location.href = '/bookings';
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professionals; 