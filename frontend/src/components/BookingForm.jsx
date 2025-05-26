import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Calendar, Clock, MapPin, DollarSign, Info, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Notification from './Notification';

const SERVICE_TYPES = [
  { id: 'interior_painting', label: 'Interior Painting', icon: '🎨' },
  { id: 'exterior_painting', label: 'Exterior Painting', icon: '🏠' },
  { id: 'home_renovation', label: 'Home Renovation', icon: '🔨' },
  { id: 'other', label: 'Other Services', icon: '✨' }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const BookingForm = ({ professional, onSuccess }) => {
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    jobDetails: {
      description: '',
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: { lat: null, lng: null }
      },
      preferredDate: null,
      preferredTime: '',
      budget: '',
      duration: '',
      additionalNotes: '',
      contactInfo: {
        type: 'email',
        value: ''
      }
    }
  });
  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNextDays = (count) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = getNextDays(14); // Show next 14 days

  useEffect(() => {
    // Fetch available dates for the professional
    const fetchAvailableDates = async () => {
      try {
        const response = await bookingService.getAvailableDates(professional._id);
        setFormData(prev => ({ ...prev, jobDetails: { ...prev.jobDetails, preferredDate: response.data.dates[0] } }));
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    };
    fetchAvailableDates();
  }, [professional._id]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.serviceType) {
          newErrors.serviceType = 'Please select a service type';
        }
        break;
      case 2:
        if (!formData.jobDetails.description) {
          newErrors.description = 'Please provide a job description';
        }
        if (!formData.jobDetails.location.address) {
          newErrors.address = 'Please provide an address';
        }
        break;
      case 3:
        if (!selectedDate) {
          newErrors.date = 'Please select a date';
        }
        if (!selectedTime) {
          newErrors.time = 'Please select a time';
        }
        if (!formData.jobDetails.budget) {
          newErrors.budget = 'Please provide a budget';
        }
        if (!formData.jobDetails.duration) {
          newErrors.duration = 'Please provide estimated duration';
        }
        if (!formData.jobDetails.contactInfo.value) {
          newErrors.contactInfo = 'Please provide contact information';
        } else if (formData.jobDetails.contactInfo.type === 'email' && 
          !formData.jobDetails.contactInfo.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newErrors.contactInfo = 'Please enter a valid email address';
        } else if (formData.jobDetails.contactInfo.type === 'phone' && 
          !formData.jobDetails.contactInfo.value.match(/^\+?[\d\s-]{10,}$/)) {
          newErrors.contactInfo = 'Please enter a valid phone number';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleLocationSearch = async (value) => {
    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      setLocationSuggestions(data.features);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleLocationSelect = (suggestion) => {
    const [lng, lat] = suggestion.center;
    setFormData(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        location: {
          address: suggestion.place_name,
          coordinates: { lat, lng }
        }
      }
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      const bookingData = {
        professionalId: professional._id,
        serviceType: formData.serviceType,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: formData.jobDetails.duration,
        location: formData.jobDetails.location.address,
        description: formData.jobDetails.description,
        contactInfo: {
          type: formData.jobDetails.contactInfo.type,
          value: formData.jobDetails.contactInfo.value
        },
        jobDetails: {
          ...formData.jobDetails,
          preferredDate: selectedDate,
          preferredTime: selectedTime
        }
      };

      const response = await bookingService.createBooking(bookingData);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Booking request sent successfully!',
        duration: 5000
      });

      // Call the success callback
      onSuccess(response.data);

      // Reset form
      setFormData({
        serviceType: '',
        jobDetails: {
          description: '',
          location: {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            coordinates: { lat: null, lng: null }
          },
          preferredDate: null,
          preferredTime: '',
          budget: '',
          duration: '',
          additionalNotes: '',
          contactInfo: {
            type: 'email',
            value: ''
          }
        }
      });
      setSelectedDate(null);
      setSelectedTime('');
      setStep(1);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to create booking',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">Select Service Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {SERVICE_TYPES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: service.id }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.serviceType === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <div className="font-medium">{service.label}</div>
                </button>
              ))}
            </div>
            {errors.serviceType && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.serviceType}
              </p>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">Job Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={formData.jobDetails.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    jobDetails: { ...prev.jobDetails, description: e.target.value }
                  }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Describe your project requirements..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.jobDetails.location.address}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        jobDetails: {
                          ...prev.jobDetails,
                          location: { ...prev.jobDetails.location, address: e.target.value }
                        }
                      }));
                      handleLocationSearch(e.target.value);
                    }}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your address"
                  />
                  <MapPin className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        {suggestion.place_name}
                      </button>
                    ))}
                  </div>
                )}
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">Schedule & Budget</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <select
                    value={selectedDate ? formatDate(selectedDate) : ''}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setSelectedDate(date);
                    }}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select date</option>
                    {availableDates.map((date) => (
                      <option key={date.toISOString()} value={date.toISOString()}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.jobDetails.budget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jobDetails: { ...prev.jobDetails, budget: e.target.value }
                    }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    placeholder="Enter your budget"
                  />
                  <DollarSign className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration (hours)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.jobDetails.duration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jobDetails: { ...prev.jobDetails, duration: e.target.value }
                    }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    placeholder="Enter estimated duration"
                  />
                  <Clock className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData.jobDetails.contactInfo.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jobDetails: {
                        ...prev.jobDetails,
                        contactInfo: {
                          ...prev.jobDetails.contactInfo,
                          type: e.target.value,
                          value: '' // Clear value when type changes
                        }
                      }
                    }))}
                    className="w-1/3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                  <input
                    type={formData.jobDetails.contactInfo.type === 'email' ? 'email' : 'tel'}
                    value={formData.jobDetails.contactInfo.value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jobDetails: {
                        ...prev.jobDetails,
                        contactInfo: {
                          ...prev.jobDetails.contactInfo,
                          value: e.target.value
                        }
                      }
                    }))}
                    placeholder={formData.jobDetails.contactInfo.type === 'email' ? 'Enter email' : 'Enter phone number'}
                    className="w-2/3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {errors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.contactInfo}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.jobDetails.additionalNotes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  jobDetails: { ...prev.jobDetails, additionalNotes: e.target.value }
                }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Any additional information or special requirements..."
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to book a service</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Book a Service</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Step {step} of 3</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Book Now'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 