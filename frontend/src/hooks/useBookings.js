import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import websocketService from '../services/websocket';
import { bookingService } from '../services/api';

const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const useBookings = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    date: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const fetchBookings = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: pageNum,
        limit: 10,
        sortBy: filters.sortBy === 'date' ? 'schedule' : filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.date !== 'all' && { date: filters.date }),
        ...(filters.searchTerm && { search: filters.searchTerm })
      });

      const response = await bookingService.getBookings(`?${queryParams}`);
      const data = response.data;
      
      if (pageNum === 1) {
        setBookings(data.bookings || []);
      } else {
        setBookings(prev => [...prev, ...(data.bookings || [])]);
      }
      
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || 'Failed to load bookings');
      setBookings([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // WebSocket subscription for real-time updates
  useEffect(() => {
    const unsubscribe = websocketService.subscribe((data) => {
      if (data.type === 'booking_update') {
        setBookings(prev => prev.map(booking => 
          booking._id === data.booking._id ? data.booking : booking
        ));
        toast.success('Booking updated in real-time');
      }
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const response = await bookingService.updateBooking(bookingId, { status: newStatus });
      const updatedBooking = response.data;
      
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? updatedBooking : booking
      ));
      
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const rescheduleBooking = async (bookingId, newDate, newTime) => {
    try {
      const response = await bookingService.updateBooking(bookingId, { 
        date: newDate, 
        time: newTime 
      });
      const updatedBooking = response.data;
      
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? updatedBooking : booking
      ));
      
      toast.success('Booking rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to reschedule booking');
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchBookings(page + 1);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  return {
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
  };
};

export default useBookings; 