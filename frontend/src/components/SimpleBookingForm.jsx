import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
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

const SimpleBookingForm = ({ onSuccess, onCancel }) => {
  const { isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [formData, setFormData] = useState({
    professionalId: '',
    serviceType: '',
    date: '',
    time: '',
    location: '',
    duration: 2,
    notes: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch professionals on component mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await bookingService.getProfessionals();
        setProfessionals(response.data || []);
      } catch (error) {
        console.error('Error fetching professionals:', error);
        setError('Failed to load professionals. Please try again.');
      }
    };

    fetchProfessionals();
  }, []);

  const convertTimeTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.professionalId) {
      newErrors.professionalId = 'Please select a professional';
    }
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    if (!formData.location) {
      newErrors.location = 'Please enter a location';
    }

    if (!formData.contactInfo.email && !formData.contactInfo.phone) {
      newErrors.contactInfo = 'Please provide either an email or phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      if (!validateForm()) {
        throw new Error('Please fill in all required fields');
      }

      // Convert time to 24-hour format
      const [hours, minutes] = formData.time.split(':');
      const scheduleDate = new Date(formData.date);
      scheduleDate.setHours(parseInt(hours), parseInt(minutes));

      const bookingData = {
        professionalId: formData.professionalId,
        serviceType: formData.serviceType,
        schedule: scheduleDate.toISOString(),
        duration: parseInt(formData.duration),
          location: {
          address: formData.location,
          coordinates: {
            lat: 0,
            lng: 0
          }
        },
        notes: formData.notes || '',
        status: 'pending',
        priority: 'normal',
        amount: 0,
        contactInfo: {
          name: formData.contactInfo.name,
          email: formData.contactInfo.email,
          phone: formData.contactInfo.phone
        }
      };
      
      console.log('Submitting booking data:', bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking response:', response);

      setSuccess('Booking created successfully!');
      onSuccess(response);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Please sign in to book a service</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-3 bg-white rounded-lg shadow-sm">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="space-y-2">
        {/* Professional Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            Select Professional
          </label>
          <select
            value={formData.professionalId}
            onChange={(e) => setFormData(prev => ({ ...prev, professionalId: e.target.value }))}
            className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a professional</option>
            {professionals.map((professional) => (
              <option key={professional._id} value={professional._id}>
                {professional.firstName} {professional.lastName}
              </option>
            ))}
          </select>
          {errors.professionalId && (
            <p className="text-red-500 text-xs mt-0.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.professionalId}
            </p>
          )}
        </div>

        {/* Service Type and Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Service Type
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select service</option>
              {SERVICE_TYPES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.icon} {service.label}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.serviceType}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Date
            </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            {errors.date && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Time and Duration */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Time
            </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>{time}</option>
                ))}
              </select>
            {errors.time && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.time}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Duration (hrs)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            Location
          </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter address"
            className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          {errors.location && (
            <p className="text-red-500 text-xs mt-0.5 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.location}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Contact Type
            </label>
            <select
              value={formData.contactInfo.type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, type: e.target.value }
              }))}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Contact Info
            </label>
              <input
                type={formData.contactInfo.type === 'email' ? 'email' : 'tel'}
                value={formData.contactInfo.value}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, value: e.target.value }
                }))}
              placeholder={formData.contactInfo.type === 'email' ? 'Email' : 'Phone'}
              className="w-full p-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            {errors.contactInfo && (
              <p className="text-red-500 text-xs mt-0.5 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.contactInfo}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SimpleBookingForm; 