import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  MessageSquare,
  Star,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Bell
} from 'lucide-react';

const ClientDashboard = () => {
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    activeBookings: [],
    pastBookings: [],
    unreadMessages: 0,
    savedProfessionals: [],
    notifications: [],
    recentSearches: [],
    recommendedProfessionals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/client/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Search className="w-5 h-5" />
            <span>Find Professionals</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Bell className="w-5 h-5" />
            <span>{dashboardData.notifications.length}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Bookings</p>
              <p className="text-2xl font-bold">{dashboardData.activeBookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Unread Messages</p>
              <p className="text-2xl font-bold">{dashboardData.unreadMessages}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Saved Professionals</p>
              <p className="text-2xl font-bold">{dashboardData.savedProfessionals.length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Recent Searches</p>
              <p className="text-2xl font-bold">{dashboardData.recentSearches.length}</p>
            </div>
            <Filter className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Active Bookings</h2>
          <div className="space-y-4">
            {dashboardData.activeBookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.serviceType}</h3>
                    <p className="text-gray-600">{booking.professionalName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {booking.estimatedCost}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {booking.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Professionals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Professionals</h2>
          <div className="space-y-4">
            {dashboardData.recommendedProfessionals.map((professional) => (
              <div key={professional._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <img
                    src={professional.imageUrl}
                    alt={professional.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.serviceType}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 ml-1">{professional.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {dashboardData.notifications.map((notification) => (
            <div key={notification._id} className="flex items-start space-x-4 p-4 border-b last:border-b-0">
              <div className={`p-2 rounded-full ${
                notification.type === 'booking' ? 'bg-blue-100' :
                notification.type === 'message' ? 'bg-green-100' :
                'bg-yellow-100'
              }`}>
                {notification.type === 'booking' ? <Calendar className="w-5 h-5 text-blue-500" /> :
                 notification.type === 'message' ? <MessageSquare className="w-5 h-5 text-green-500" /> :
                 <Bell className="w-5 h-5 text-yellow-500" />}
              </div>
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 