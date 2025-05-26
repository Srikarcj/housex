const { UserProfile, SearchHistory } = require('../models/schema');

const searchController = {
  // Advanced search with multiple filters
  async advancedSearch(req, res) {
    try {
      const {
        query,
        userType,
        serviceType,
        location,
        rating,
        priceRange,
        availability,
        skills,
        sortBy = 'rating',
        page = 1,
        limit = 10,
        radius = 50, // Search radius in kilometers
        experience,
        languages,
        certifications
      } = req.query;

      // Build search query
      const searchQuery = {
        isProfessional: true
      };

      // Text search with multiple fields
      if (query) {
        searchQuery.$or = [
          { 'firstName': { $regex: query, $options: 'i' } },
          { 'lastName': { $regex: query, $options: 'i' } },
          { 'professionalDetails.businessName': { $regex: query, $options: 'i' } },
          { 'professionalDetails.description': { $regex: query, $options: 'i' } },
          { 'professionalDetails.skills': { $regex: query, $options: 'i' } },
          { 'professionalDetails.services': { $regex: query, $options: 'i' } }
        ];
      }

      // Filter by user type
      if (userType) {
        searchQuery.userType = userType;
      }

      // Filter by service type
      if (serviceType) {
        searchQuery['professionalDetails.services'] = {
          $in: serviceType.split(',').map(service => new RegExp(service, 'i'))
        };
      }

      // Filter by location with radius
      if (location) {
        searchQuery['professionalDetails.serviceAreas'] = {
          $elemMatch: {
            city: { $regex: location, $options: 'i' },
            radius: { $gte: parseInt(radius) }
          }
        };
      }

      // Filter by rating
      if (rating) {
        searchQuery['professionalDetails.rating'] = { $gte: parseFloat(rating) };
      }

      // Filter by price range
      if (priceRange) {
        const [min, max] = priceRange.split('-');
        searchQuery['professionalDetails.hourlyRate'] = {
          $gte: parseFloat(min),
          $lte: parseFloat(max)
        };
      }

      // Filter by availability
      if (availability) {
        const [day, time] = availability.split(' ');
        searchQuery['professionalDetails.availability'] = {
          $elemMatch: {
            day,
            'slots': {
              $elemMatch: {
                start: { $lte: time },
                end: { $gte: time },
                isBooked: false
              }
            }
          }
        };
      }

      // Filter by skills
      if (skills) {
        const skillsArray = skills.split(',');
        searchQuery['professionalDetails.skills'] = {
          $all: skillsArray.map(skill => new RegExp(skill, 'i'))
        };
      }

      // Filter by experience
      if (experience) {
        searchQuery['professionalDetails.experience'] = { $gte: parseInt(experience) };
      }

      // Filter by languages
      if (languages) {
        searchQuery['professionalDetails.languages'] = {
          $all: languages.split(',').map(lang => new RegExp(lang, 'i'))
        };
      }

      // Filter by certifications
      if (certifications) {
        searchQuery['professionalDetails.certifications.name'] = {
          $in: certifications.split(',').map(cert => new RegExp(cert, 'i'))
        };
      }

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Execute search with sorting and pagination
      const results = await UserProfile.find(searchQuery)
        .sort({ [`professionalDetails.${sortBy}`]: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-preferences');

      // Get total count for pagination
      const total = await UserProfile.countDocuments(searchQuery);

      // Save search history
      if (req.user) {
        await SearchHistory.create({
          userId: req.user.id,
          query,
          filters: {
            userType,
            serviceType,
            location,
            rating,
            priceRange,
            availability,
            skills,
            experience,
            languages,
            certifications
          },
          results: results.map(result => ({
            type: 'user',
            id: result._id.toString(),
            relevance: 1
          }))
        });
      }

      // Get aggregated statistics
      const stats = await UserProfile.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$professionalDetails.rating' },
            avgPrice: { $avg: '$professionalDetails.hourlyRate' },
            totalProfessionals: { $sum: 1 },
            serviceTypes: { $addToSet: '$professionalDetails.services' },
            skills: { $addToSet: '$professionalDetails.skills' }
          }
        }
      ]);

      res.json({
        success: true,
        data: results,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        },
        stats: stats[0] || {
          avgRating: 0,
          avgPrice: 0,
          totalProfessionals: 0,
          serviceTypes: [],
          skills: []
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Error performing search'
      });
    }
  },

  // Get search suggestions with advanced filtering
  async getSuggestions(req, res) {
    try {
      const { query, type } = req.query;
      
      if (!query) {
        return res.json({ suggestions: [] });
      }

      const matchStage = {
        $or: [
          { 'firstName': { $regex: query, $options: 'i' } },
          { 'lastName': { $regex: query, $options: 'i' } },
          { 'professionalDetails.businessName': { $regex: query, $options: 'i' } },
          { 'professionalDetails.services': { $regex: query, $options: 'i' } }
        ]
      };

      if (type) {
        matchStage.userType = type;
      }

      const suggestions = await UserProfile.aggregate([
        { $match: matchStage },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            userType: 1,
            'businessName': '$professionalDetails.businessName',
            'services': '$professionalDetails.services',
            'rating': '$professionalDetails.rating',
            'hourlyRate': '$professionalDetails.hourlyRate',
            'location': '$professionalDetails.serviceAreas.city'
          }
        },
        {
          $limit: 10
        }
      ]);

      res.json({
        success: true,
        suggestions
      });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting suggestions'
      });
    }
  },

  // Get search history with filters
  async getSearchHistory(req, res) {
    try {
      const { type, limit = 20 } = req.query;
      const query = { userId: req.user.id };

      if (type) {
        query['filters.userType'] = type;
      }

      const history = await SearchHistory.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting search history'
      });
    }
  }
};

module.exports = searchController; 