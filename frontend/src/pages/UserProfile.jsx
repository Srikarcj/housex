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
  Home,
  Heart,
  MessageSquare,
  Settings,
  CreditCard,
  Bell
} from 'lucide-react';

const UserProfile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    savedAddresses: [
      {
        id: 1,
        name: 'Home',
        address: '123 Main St, New York, NY 10001',
        isDefault: true
      },
      {
        id: 2,
        name: 'Office',
        address: '456 Business Ave, New York, NY 10002',
        isDefault: false
      }
    ],
    savedProfessionals: [
      {
        id: 1,
        name: 'John Smith',
        type: 'Painter',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        name: 'Mike Johnson',
        type: 'Builder',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    recentBookings: [
      {
        id: 1,
        service: 'Interior Painting',
        professional: 'John Smith',
        date: '2024-03-15',
        status: 'Upcoming',
        amount: 1200
      },
      {
        id: 2,
        service: 'Home Renovation',
        professional: 'Mike Johnson',
        date: '2024-02-20',
        status: 'Completed',
        amount: 25000
      }
    ],
    paymentMethods: [
      {
        id: 1,
        type: 'Credit Card',
        last4: '4242',
        expiry: '12/25',
        isDefault: true
      },
      {
        id: 2,
        type: 'PayPal',
        email: 'user@example.com',
        isDefault: false
      }
    ],
    notifications: {
      email: true,
      sms: true,
      marketing: false,
      bookingUpdates: true,
      promotionalOffers: false
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
          <div className="relative h-48 bg-gradient-to-r from-green-600 to-teal-600">
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
                <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
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
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'saved'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Saved
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700"
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{profileData.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          <span>{profileData.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                      <div className="space-y-4">
                        {profileData.recentBookings.map((booking) => (
                          <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{booking.service}</h4>
                                <p className="text-gray-600">with {booking.professional}</p>
                                <p className="text-gray-500 text-sm mt-1">{booking.date}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                booking.status === 'Upcoming'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center text-gray-600">
                              <DollarSign className="w-5 h-5 mr-1" />
                              <span>${booking.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700">
                        <Plus className="w-5 h-5 mr-2" />
                        New Booking
                      </button>
                    </div>
                    <div className="space-y-4">
                      {profileData.recentBookings.map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{booking.service}</h4>
                              <p className="text-gray-600">with {booking.professional}</p>
                              <p className="text-gray-500 text-sm mt-1">{booking.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              booking.status === 'Upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="w-5 h-5 mr-1" />
                              <span>${booking.amount.toLocaleString()}</span>
                            </div>
                            <button className="text-green-600 hover:text-green-700">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Professionals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profileData.savedProfessionals.map((professional) => (
                          <div key={professional.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <img
                                src={professional.image}
                                alt={professional.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">{professional.name}</h4>
                                <p className="text-gray-600">{professional.type}</p>
                                <div className="flex items-center mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 text-gray-600">{professional.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Addresses</h3>
                      <div className="space-y-4">
                        {profileData.savedAddresses.map((address) => (
                          <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{address.name}</h4>
                                <p className="text-gray-600">{address.address}</p>
                              </div>
                              {address.isDefault && (
                                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                      <div className="space-y-4">
                        {profileData.paymentMethods.map((method) => (
                          <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900">{method.type}</h4>
                                  {method.last4 && (
                                    <p className="text-gray-600">•••• {method.last4}</p>
                                  )}
                                  {method.email && (
                                    <p className="text-gray-600">{method.email}</p>
                                  )}
                                </div>
                              </div>
                              {method.isDefault && (
                                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(profileData.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Bell className="w-5 h-5 text-gray-600 mr-2" />
                              <span className="text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                className="sr-only peer"
                                onChange={() => {
                                  setProfileData(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      [key]: !value
                                    }
                                  }));
                                }}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
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

export default UserProfile; 