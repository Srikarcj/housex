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
  Trash2
} from 'lucide-react';

const PainterProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: 'Professional Painting Services',
    description: 'Experienced painter specializing in residential and commercial projects.',
    yearsOfExperience: '10+',
    completedProjects: 150,
    rating: 4.9,
    reviews: 128,
    location: 'New York, NY',
    services: [
      'Interior Painting',
      'Exterior Painting',
      'Cabinet Refinishing',
      'Wallpaper Installation'
    ],
    certifications: [
      'Certified Master Painter',
      'Safety First Certified',
      'EPA Lead-Safe Certified'
    ],
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    portfolio: [
      {
        id: 1,
        title: 'Modern Living Room',
        description: 'Complete interior painting of a modern living room',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        date: '2024-02-15'
      },
      {
        id: 2,
        title: 'Kitchen Cabinet Refinishing',
        description: 'Cabinet refinishing project in a contemporary kitchen',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        date: '2024-01-20'
      }
    ],
    pricing: {
      interiorPainting: { min: 500, max: 2000 },
      exteriorPainting: { min: 800, max: 3000 },
      cabinetRefinishing: { min: 600, max: 1500 },
      wallpaperInstallation: { min: 400, max: 1200 }
    }
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
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-600">
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
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'portfolio'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'services'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Services & Pricing
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'availability'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                              <Shield className="w-5 h-5 text-indigo-600 mr-2" />
                              <span>{certification}</span>
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
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
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
                              <span>${price.min} - ${price.max}</span>
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

export default PainterProfile; 