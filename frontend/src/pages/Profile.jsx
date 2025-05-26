import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { userService } from '../services/api';
import Notification from '../components/Notification';
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  Save,
  X,
  Loader2,
  Image,
  Plus,
  Trash2
} from 'lucide-react';

const Profile = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profile, setProfile] = useState({
    businessName: '',
    phone: '',
    email: '',
    accountType: 'builder',
    services: [],
    hourlyRate: '',
    profilePicture: '',
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: { start: '09:00', end: '17:00' }
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bio: '',
    portfolio: [],
    documents: []
  });

  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    category: 'builder',
    image: null
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getProfile();
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load profile',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image size should be less than 5MB');
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file');
        }

        // Convert image to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64String = reader.result;
            const response = await userService.updateProfile({
              ...profile,
              profilePicture: base64String
            });
            setProfile(prev => ({
              ...prev,
              profilePicture: response.data.profilePicture
            }));
            setNotification({
              type: 'success',
              message: 'Profile picture updated successfully',
              duration: 5000
            });
          } catch (error) {
            console.error('Error updating profile picture:', error);
            setNotification({
              type: 'error',
              message: error.message || 'Failed to update profile picture',
              duration: 5000
            });
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling profile picture:', error);
        setNotification({
          type: 'error',
          message: error.message || 'Failed to process profile picture',
          duration: 5000
        });
      }
    }
  };

  const handlePortfolioImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          type: 'error',
          message: 'Image size should be less than 5MB',
          duration: 5000
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPortfolioItem(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!newPortfolioItem.title || !newPortfolioItem.category || !newPortfolioItem.image) {
        throw new Error('Please fill in all required fields');
      }

      // Validate image data
      if (!newPortfolioItem.image.startsWith('data:image')) {
        throw new Error('Invalid image format');
      }

      // Validate image size (max 5MB)
      const base64Data = newPortfolioItem.image.split(',')[1];
      const imageSize = Math.ceil((base64Data.length * 3) / 4);
      if (imageSize > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      const response = await userService.addPortfolioItem({
        title: newPortfolioItem.title,
        description: newPortfolioItem.description,
        category: newPortfolioItem.category,
        imageData: newPortfolioItem.image
      });
      
      setProfile(prev => ({
        ...prev,
        portfolio: response.data.portfolio
      }));
      
      setNewPortfolioItem({
        title: '',
        description: '',
        category: 'builder',
        image: null
      });
      
      setNotification({
        type: 'success',
        message: 'Portfolio item added successfully',
        duration: 5000
      });
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to add portfolio item',
        duration: 5000
      });
    }
  };

  const handleRemovePortfolioItem = async (itemId) => {
    try {
      const response = await userService.removePortfolioItem(itemId);
      setProfile(prev => ({
        ...prev,
        portfolio: response.data.portfolio
      }));
      setNotification({
        type: 'success',
        message: 'Portfolio item removed successfully',
        duration: 5000
      });
    } catch (error) {
      console.error('Error removing portfolio item:', error);
      setNotification({
        type: 'error',
        message: 'Failed to remove portfolio item',
        duration: 5000
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setProfile(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleLocationChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Ensure all required fields are present
      if (!profile.accountType) {
        throw new Error('Please select an account type');
      }

      // Validate phone number if provided
      if (profile.phone && !/^\+?[\d\s-]{10,}$/.test(profile.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      // Validate hourly rate if provided
      if (profile.hourlyRate && isNaN(profile.hourlyRate)) {
        throw new Error('Please enter a valid hourly rate');
      }

      const response = await userService.updateProfile(profile);
      setProfile(response.data);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully',
        duration: 5000
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update profile',
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          
          {/* Account Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Type</h2>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accountType"
                  value="builder"
                  checked={profile.accountType === 'builder'}
                  onChange={(e) => setProfile(prev => ({ ...prev, accountType: e.target.value }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Builder</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accountType"
                  value="painter"
                  checked={profile.accountType === 'painter'}
                  onChange={(e) => setProfile(prev => ({ ...prev, accountType: e.target.value }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Painter</span>
              </label>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {profile.portfolio.map((item) => (
                <div key={item._id} className="relative group">
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleRemovePortfolioItem(item._id)}
                      className="text-white hover:text-red-500"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mt-1">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Portfolio Item Form */}
            <form onSubmit={handleAddPortfolioItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newPortfolioItem.title}
                    onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newPortfolioItem.category}
                    onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="builder">Builder</option>
                    <option value="painter">Painter</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newPortfolioItem.description}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center">
                  <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Image className="w-4 h-4 mr-2" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePortfolioImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                  {newPortfolioItem.image && (
                    <span className="ml-2 text-sm text-gray-600">
                      Image selected
                    </span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Portfolio
              </button>
            </form>
          </div>

          {/* Existing form sections */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Services</h2>
              <div className="space-y-4">
                {profile.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => {
                        const newServices = [...profile.services];
                        newServices[index] = e.target.value;
                        setProfile(prev => ({ ...prev, services: newServices }));
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newServices = profile.services.filter((_, i) => i !== index);
                        setProfile(prev => ({ ...prev, services: newServices }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setProfile(prev => ({
                      ...prev,
                      services: [...prev.services, '']
                    }));
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Service
                </button>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(profile.availability).map(([day, times]) => (
                  <div key={day} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">{day}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={times.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        type="time"
                        value={times.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={profile.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={profile.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={profile.location.state}
                    onChange={(e) => handleLocationChange('state', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    value={profile.location.zipCode}
                    onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bio</h2>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 