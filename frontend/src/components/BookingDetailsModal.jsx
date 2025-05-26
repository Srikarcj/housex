import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  X,
  Edit,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const BookingDetailsModal = ({ booking, onClose, onStatusUpdate, onReschedule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(booking.date);
  const [newTime, setNewTime] = useState(booking.time);

  const handleReschedule = async () => {
    try {
      await onReschedule(booking._id, newDate, newTime);
      setIsEditing(false);
    } catch (error) {
      console.error('Error rescheduling:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-500">ID: {booking._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{booking.serviceType}</h3>
            <div className="mt-2 flex items-center space-x-2">
              {getStatusIcon(booking.status)}
              <span className="text-sm font-medium text-gray-700">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.clientName}</p>
                <p className="text-sm text-gray-500">Client</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.clientPhone}</p>
                <p className="text-sm text-gray-500">Phone</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.clientEmail}</p>
                <p className="text-sm text-gray-500">Email</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(parseISO(booking.date), 'PPP')}
                </p>
                <p className="text-sm text-gray-500">Date</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.time}</p>
                <p className="text-sm text-gray-500">Time</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.location}</p>
                <p className="text-sm text-gray-500">Location</p>
              </div>
            </div>
          </div>

          {/* Reschedule Section */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => onStatusUpdate(booking._id, 'accepted')}
                    className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onStatusUpdate(booking._id, 'cancelled')}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    Decline
                  </button>
                </>
              )}
              {booking.status === 'accepted' && (
                <button
                  onClick={() => onStatusUpdate(booking._id, 'in_progress')}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  Start Service
                </button>
              )}
              {booking.status === 'in_progress' && (
                <button
                  onClick={() => onStatusUpdate(booking._id, 'completed')}
                  className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
                >
                  Complete Service
                </button>
              )}
              {['pending', 'accepted'].includes(booking.status) && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Reschedule
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 