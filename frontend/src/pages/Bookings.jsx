import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Loader2,
  Calendar as CalendarIcon,
  MoreVertical,
  Plus
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import BookingCalendar from '../components/BookingCalendar';
import BookingDetailsModal from '../components/BookingDetailsModal';
import NewBookingModal from '../components/NewBookingModal';
import useBookings from '../hooks/useBookings';

const Bookings = () => {
  const {
    bookings,
    isLoading,
    hasMore,
    filters,
    BOOKING_STATUS,
    updateStatus,
    rescheduleBooking,
    loadMore,
    updateFilters,
    fetchBookings
  } = useBookings();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const { ref, inView } = useInView();

  // Load more when scrolling
  if (inView && hasMore && !isLoading) {
    loadMore();
  }

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case BOOKING_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BOOKING_STATUS.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case BOOKING_STATUS.COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case BOOKING_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BOOKING_STATUS.ACCEPTED:
        return <CheckCircle className="w-5 h-5" />;
      case BOOKING_STATUS.PENDING:
        return <AlertCircle className="w-5 h-5" />;
      case BOOKING_STATUS.IN_PROGRESS:
        return <RefreshCw className="w-5 h-5" />;
      case BOOKING_STATUS.COMPLETED:
        return <CheckCircle className="w-5 h-5" />;
      case BOOKING_STATUS.CANCELLED:
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.clientName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      booking.serviceType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      booking.location?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || booking.status === filters.status;

    const matchesDate = (() => {
      if (filters.date === 'all') return true;
      const bookingDate = parseISO(booking.date);
      
      switch (filters.date) {
        case 'today':
          return isToday(bookingDate);
        case 'tomorrow':
          return isTomorrow(bookingDate);
        case 'week':
          return isThisWeek(bookingDate);
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading && !bookings.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-2 text-gray-600">
              Manage your professional appointments and service requests
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowNewBookingModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Now
            </button>
            <button
              onClick={() => setIsCalendarView(!isCalendarView)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              {isCalendarView ? 'List View' : 'Calendar View'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {Object.values(BOOKING_STATUS).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filters.date}
              onChange={(e) => updateFilters({ date: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                updateFilters({ sortBy, sortOrder });
              }}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="status-asc">Status A-Z</option>
              <option value="status-desc">Status Z-A</option>
            </select>
          </div>
        </div>

        {/* Calendar or List View */}
        {isCalendarView ? (
          <BookingCalendar
            bookings={filteredBookings}
            onEventClick={setSelectedBooking}
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{booking.serviceType}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {booking.clientName}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(parseISO(booking.date), 'PPP')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.location}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {booking.clientPhone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-1" />
                      {booking.clientEmail}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {booking.status === BOOKING_STATUS.PENDING && (
                      <>
                        <button
                          onClick={() => updateStatus(booking._id, BOOKING_STATUS.ACCEPTED)}
                          className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, BOOKING_STATUS.CANCELLED)}
                          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === BOOKING_STATUS.ACCEPTED && (
                      <button
                        onClick={() => updateStatus(booking._id, BOOKING_STATUS.IN_PROGRESS)}
                        className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        Start Service
                      </button>
                    )}
                    {booking.status === BOOKING_STATUS.IN_PROGRESS && (
                      <button
                        onClick={() => updateStatus(booking._id, BOOKING_STATUS.COMPLETED)}
                        className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
                      >
                        Complete Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Infinite scroll trigger */}
            <div ref={ref} className="h-10 flex items-center justify-center">
              {isLoading && <Loader2 className="w-6 h-6 animate-spin text-blue-600" />}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={updateStatus}
          onReschedule={rescheduleBooking}
        />
      )}

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <NewBookingModal
          onClose={() => setShowNewBookingModal(false)}
          onSuccess={() => {
            fetchBookings();
            setShowNewBookingModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Bookings; 