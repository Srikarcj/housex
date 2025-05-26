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
  Users,
  TrendingUp,
  Briefcase,
  Bell,
  Settings,
  FileText,
  Award
} from 'lucide-react';

const ProfessionalDashboard = () => {
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: [],
    completedBookings: [],
    earnings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0
    },
    reviews: [],
    unreadMessages: 0,
    notifications: [],
    businessMetrics: {
      rating: 0,
      totalClients: 0,
      completionRate: 0,
      responseTime: 0
    },
    recentInquiries: [],
    documents: []
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
      const response = await fetch('/api/professional/dashboard', {
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
        <h1 className="text-3xl font-bold">Professional Dashboard</h1>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Briefcase className="w-5 h-5" />
            <span>Manage Services</span>
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
              <p className="text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold">${dashboardData.earnings.today}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Upcoming Jobs</p>
              <p className="text-2xl font-bold">{dashboardData.upcomingBookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="text-2xl font-bold">{dashboardData.businessMetrics.rating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold">{dashboardData.businessMetrics.totalClients}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {dashboardData.upcomingBookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.serviceType}</h3>
                    <p className="text-gray-600">{booking.clientName}</p>
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

        {/* Business Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Business Metrics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold">{dashboardData.businessMetrics.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Response Time</p>
                <p className="text-2xl font-bold">{dashboardData.businessMetrics.responseTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Monthly Earnings</p>
                <p className="text-2xl font-bold">${dashboardData.earnings.thisMonth}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {dashboardData.reviews.map((review) => (
            <div key={review._id} className="border-b last:border-b-0 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={review.clientImage}
                  alt={review.clientName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{review.clientName}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 ml-auto">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
        <div className="space-y-4">
          {dashboardData.recentInquiries.map((inquiry) => (
            <div key={inquiry._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{inquiry.serviceType}</h3>
                  <p className="text-gray-600">{inquiry.clientName}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(inquiry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{inquiry.message}</p>
              <div className="mt-4 flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Accept
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Important Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.documents.map((doc) => (
            <div key={doc._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard; 