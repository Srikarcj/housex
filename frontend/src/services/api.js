import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // Increased timeout for file uploads
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  try {
    // Get the token from Clerk
    const token = await window.Clerk?.session?.getToken();
    
    if (!token) {
      console.error('No authentication token available');
      // Redirect to sign in if not already there
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
      return Promise.reject(new Error('Please sign in to continue'));
    }

    // Add the token to the request headers
    config.headers.Authorization = `Bearer ${token}`;
    
    // Handle file uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    // Redirect to sign in if not already there
    if (window.location.pathname !== '/sign-in') {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      console.error('Authentication error:', error);
      // Redirect to sign in if not already there
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
      return Promise.reject(new Error('Please sign in to continue'));
    }

    // Handle other errors
    const errorMessage = error.response.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return { data: null };
    }
  },

  updateProfile: async (data) => {
    try {
      const formData = new FormData();
      
      // Handle file upload
      if (data.profilePhoto instanceof File) {
        formData.append('profilePhoto', data.profilePhoto);
      }
      
      // Append other profile data
      Object.keys(data).forEach(key => {
        if (key !== 'profilePhoto') {
          formData.append(key, data[key]);
        }
      });
      
      const response = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  deleteProfile: async () => {
    try {
      const response = await api.delete('/profile');
      return response;
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete profile');
    }
  },

  addPortfolioItem: async (data) => {
    try {
      const response = await api.post('/profile/portfolio', data);
      return response;
    } catch (error) {
      console.error('Error in addPortfolioItem:', error);
      throw new Error(error.response?.data?.message || 'Failed to add portfolio item');
    }
  },

  removePortfolioItem: async (itemId) => {
    try {
      const response = await api.delete(`/profile/portfolio/${itemId}`);
      return response;
    } catch (error) {
      console.error('Error in removePortfolioItem:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove portfolio item');
    }
  }
};

export const bookingService = {
  getBookings: async (params = '') => {
    try {
      const response = await api.get(`/bookings${params}`);
      return response;
    } catch (error) {
      console.error('Error in getBookings:', error);
      return {
        data: {
          bookings: [],
          total: 0,
          page: 1,
          totalPages: 1,
          hasMore: false
        }
      };
    }
  },
  getProfessionals: async () => {
    try {
      console.log('Fetching professionals...');
      const response = await api.get('/professionals');
      console.log('Professionals response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response;
    } catch (error) {
      console.error('Error in getProfessionals:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch professionals');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Failed to fetch professionals. Please try again.');
      }
    }
  },
  getBooking: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response;
    } catch (error) {
      console.error('Error in getBooking:', error);
      return { data: null };
    }
  },
  getAvailableDates: async (professionalId) => {
    try {
      const response = await api.get(`/professionals/${professionalId}/available-dates`);
      return response;
    } catch (error) {
      console.error('Error in getAvailableDates:', error);
      return { data: { dates: [] } };
    }
  },
  createBooking: async (data) => {
    try {
      console.log('Creating booking with data:', JSON.stringify(data, null, 2));
      const response = await api.post('/bookings', data);
      console.log('Booking response:', response.data);
      
      // Create notifications for both client and professional
      try {
        await Promise.all([
          api.post('/notifications', {
            recipient: data.professionalId,
            type: 'booking_request',
            title: 'New Booking Request',
            message: `You have received a new booking request for ${data.serviceType}`,
            data: { bookingId: response.data._id }
          }),
          api.post('/notifications', {
            recipient: response.data.client,
            type: 'booking_request',
            title: 'Booking Request Sent',
            message: 'Your booking request has been sent successfully',
            data: { bookingId: response.data._id }
          })
        ]);
      } catch (notificationError) {
        console.error('Error creating notifications:', notificationError);
        // Don't fail the booking if notifications fail
      }
      
      return response;
    } catch (error) {
      console.error('Error in createBooking:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        throw new Error(errorMessages);
      } else if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create booking. Please try again.');
    }
  },
  updateBooking: async (id, data) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, data);
      // Create notification for status update
      await api.post('/notifications', {
        recipient: response.data.client,
        type: 'booking_status_updated',
        title: 'Booking Status Updated',
        message: `Your booking status has been updated to ${data.status}`,
        data: { bookingId: id }
      });
      return response;
    } catch (error) {
      console.error('Error in updateBooking:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update booking');
    }
  },
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      // Create notification for booking cancellation
      await api.post('/notifications', {
        recipient: response.data.professional,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: 'A booking has been cancelled',
        data: { bookingId: id }
      });
      return response;
    } catch (error) {
      console.error('Error in deleteBooking:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete booking');
    }
  }
};

export const serviceService = {
  getServices: () => api.get('/services'),
  getService: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};

export const professionalService = {
  getProfessionals: () => api.get('/professionals'),
  getProfessional: (id) => api.get(`/professionals/${id}`),
  createProfessional: (data) => api.post('/professionals', data),
  updateProfessional: (id, data) => api.put(`/professionals/${id}`, data),
  deleteProfessional: (id) => api.delete(`/professionals/${id}`),
};

export const reviewService = {
  getReviews: (professionalId) => api.get(`/professionals/${professionalId}/reviews`),
  createReview: (professionalId, data) => api.post(`/professionals/${professionalId}/reviews`, data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response;
    } catch (error) {
      console.error('Error in getNotifications:', error);
      // Return empty notifications array instead of throwing
      return {
        data: {
          notifications: [],
          unreadCount: 0,
          total: 0,
          page: 1,
          totalPages: 1,
          hasMore: false
        }
      };
    }
  },
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return { data: { success: false } };
    }
  },
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return { data: { success: false } };
    }
  },
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return { data: { success: false } };
    }
  }
};

export default api; 