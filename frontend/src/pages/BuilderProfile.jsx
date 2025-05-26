import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Shield, 
  Users, 
  Calendar,
  DollarSign,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
  Building2,
  Hammer,
  Ruler
} from 'lucide-react';

const BuilderProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: 'Professional Building Services',
    description: 'Licensed general contractor specializing in residential and commercial construction projects.',
    yearsOfExperience: '15+',
    completedProjects: 200,
    rating: 4.8,
    reviews: 156,
    location: 'New York, NY',
    services: [
      'New Home Construction',
      'Home Renovations',
      'Commercial Construction',
      'Project Management'
    ],
    certifications: [
      'Licensed General Contractor',
      'OSHA Safety Certified',
      'LEED Certified Professional',
      'Building Code Certified'
    ],
    availability: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' }
    },
    portfolio: [
      {
        id: 1,
        title: 'Modern Residential Home',
        description: 'Complete construction of a 3,500 sq ft modern home',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        date: '2024-02-15'
      },
      {
        id: 2,
        title: 'Commercial Office Renovation',
        description: 'Major renovation of a 10,000 sq ft office space',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        date: '2024-01-20'
      }
    ],
    pricing: {
      newHomeConstruction: { min: 150000, max: 500000 },
      homeRenovations: { min: 25000, max: 150000 },
      commercialConstruction: { min: 100000, max: 1000000 },
      projectManagement: { min: 5000, max: 25000 }
    },
    specialties: [
      'Custom Home Building',
      'Green Building',
      'Historic Renovations',
      'Smart Home Integration'
    ],
    equipment: [
      'Heavy Construction Equipment',
      'Safety Equipment',
      'Surveying Tools',
      'Quality Control Instruments'
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically handle the form submission to update the profile
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                <p className="text-gray-600">{profileData.businessName}</p>
                <div className="mt-2 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-900 font-semibold">{profileData.rating}</span>
                  <span className="ml-1 text-gray-500">({profileData.reviews} reviews)</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-5 h-5 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'portfolio'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'services'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Services & Pricing
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'availability'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Availability
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                      <p className="text-gray-600">{profileData.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>{profileData.yearsOfExperience} years of experience</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span>{profileData.completedProjects} projects completed</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{profileData.location}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                        <div className="space-y-2">
                          {profileData.certifications.map((certification, index) => (
                            <div key={index} className="flex items-center text-gray-600">
                              <Shield className="w-5 h-5 text-blue-600 mr-2" />
                              <span>{certification}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                        <div className="space-y-2">
                          {profileData.specialties.map((specialty, index) => (
                            <div key={index} className="flex items-center text-gray-600">
                              <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                              <span>{specialty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment</h3>
                        <div className="space-y-2">
                          {profileData.equipment.map((item, index) => (
                            <div key={index} className="flex items-center text-gray-600">
                              <Ruler className="w-5 h-5 text-blue-600 mr-2" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Project
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profileData.portfolio.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative h-48">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                              <Trash2 className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                            <p className="text-gray-600 mt-1">{project.description}</p>
                            <p className="text-gray-500 text-sm mt-2">{project.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.services.map((service, index) => (
                          <div key={index} className="flex items-center text-gray-600">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(profileData.pricing).map(([service, price]) => (
                          <div key={service} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-gray-900 capitalize">
                              {service.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <div className="mt-2 flex items-center text-gray-600">
                              <DollarSign className="w-5 h-5 mr-1" />
                              <span>${price.min.toLocaleString()} - ${price.max.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
                    <div className="space-y-4">
                      {Object.entries(profileData.availability).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-gray-900 font-medium capitalize">{day}</span>
                          <span className="text-gray-600">
                            {hours.start} - {hours.end}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderProfile; 