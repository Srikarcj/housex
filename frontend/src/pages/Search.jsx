import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Sliders,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Search = () => {
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceType: '',
    rating: 0,
    priceRange: [0, 1000],
    availability: 'all',
    location: '',
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    fetchProfessionals();
  }, [searchParams, filters]);

  const fetchProfessionals = async () => {
    try {
      const token = await getToken();
      const queryParams = new URLSearchParams({
        q: searchQuery,
        ...filters
      });

      const response = await fetch(`/api/professionals/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch professionals');
      const data = await response.json();
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast.error('Failed to load search results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      serviceType: '',
      rating: 0,
      priceRange: [0, 1000],
      availability: 'all',
      location: '',
      sortBy: 'rating'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Professionals</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for services, skills, or professionals..."
              className="w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                <option value="painting">Painting</option>
                <option value="construction">Construction</option>
                <option value="renovation">Renovation</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating)}
                    className={`p-2 rounded-full ${
                      filters.rating === rating
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <div
            key={professional._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={professional.coverImage}
                alt={professional.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={professional.profileImage}
                  alt={professional.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{professional.name}</h3>
                  <p className="text-gray-600">{professional.serviceType}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {professional.rating}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                  {professional.hourlyRate}/hr
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-500 mr-1" />
                  {professional.responseTime}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{professional.bio}</p>
              <div className="flex items-center gap-2 mb-4">
                {professional.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {professionals.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Search; 