import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

const BookingSystem = ({ professionalId, professionalName }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Generate time slots (9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  // Simulate fetching available slots
  const fetchAvailableSlots = async (date) => {
    setIsLoading(true);
    // In a real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    const allSlots = generateTimeSlots();
    const bookedSlots = ['10:00', '11:30', '14:00']; // Simulated booked slots
    const available = allSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvailableSlots(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);
    // In a real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBookingStatus('success');
    setTimeout(() => {
      setBookingStatus(null);
      setSelectedTime(null);
    }, 3000);
  };

  const renderCalendar = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(new Date(), i));
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => (
          <motion.button
            key={date.toISOString()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDateSelect(date)}
            className={`p-2 rounded-lg text-center ${
              selectedDate.toDateString() === date.toDateString()
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm font-medium">
              {format(date, 'EEE')}
            </div>
            <div className="text-lg">
              {format(date, 'd')}
            </div>
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Book with {professionalName}</h3>
        <p className="text-sm text-gray-500">Select a date and time for your appointment</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h4 className="font-medium">Select Date</h4>
          </div>
          {renderCalendar()}
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h4 className="font-medium">Available Time Slots</h4>
          </div>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-2 rounded-lg text-center ${
                    selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {bookingStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-4 rounded-lg ${
                bookingStatus === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {bookingStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <p>
                  {bookingStatus === 'success'
                    ? 'Booking confirmed! You will receive a confirmation email shortly.'
                    : 'Failed to book appointment. Please try again.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime || isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingSystem; 