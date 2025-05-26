const express = require('express');
const router = express.Router();
const { UserProfile, SearchHistory } = require('../models/schema');
const { validateRequest } = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Search professionals
router.get('/professionals', async (req, res) => {
  try {
    const {
      query,
      service,
      location,
      minRating,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery = { isProfessional: true };
    
    if (query) {
      searchQuery.$or = [
        { firstName: new RegExp(query, 'i') },
        { lastName: new RegExp(query, 'i') },
        { 'professionalDetails.businessName': new RegExp(query, 'i') },
        { 'professionalDetails.services': new RegExp(query, 'i') }
      ];
    }
    
    if (service) {
      searchQuery['professionalDetails.services'] = new RegExp(service, 'i');
    }
    
    if (location) {
      searchQuery.$or = [
        { 'address.city': new RegExp(location, 'i') },
        { 'address.state': new RegExp(location, 'i') }
      ];
    }

    if (minRating) {
      searchQuery['professionalDetails.rating'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      searchQuery['professionalDetails.hourlyRate'] = { $lte: parseFloat(maxPrice) };
    }

    // Execute search
    const professionals = await UserProfile.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ 'professionalDetails.rating': -1 });

    const total = await UserProfile.countDocuments(searchQuery);

    // Save search history if user is authenticated
    if (req.auth?.userId) {
      const searchHistory = new SearchHistory({
        userId: req.auth.userId,
        query,
        filters: {
          type: 'professional',
          location,
          priceRange: {
            min: minRating,
            max: maxPrice
          }
        },
        results: professionals.map(p => ({
          type: 'professional',
          id: p.userId,
          relevance: p.professionalDetails.rating || 0
        }))
      });
      await searchHistory.save();
    }

    res.json({
      professionals,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error searching professionals' });
  }
});

// Get AI-powered search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Get recent successful searches
    const recentSearches = await SearchHistory.find({
      query: new RegExp(query, 'i')
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Generate AI suggestions
    const prompt = `Given the search query "${query}" for a home services platform, suggest relevant search terms. Consider:
    1. Common home services
    2. Professional titles
    3. Service locations
    4. Related services
    Format as JSON array of objects with 'type' and 'name' fields.`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150,
      temperature: 0.7
    });

    const aiSuggestions = JSON.parse(completion.data.choices[0].text);

    // Combine recent searches and AI suggestions
    const suggestions = [
      ...recentSearches.map(search => ({
        type: 'recent',
        name: search.query,
        count: search.results.length
      })),
      ...aiSuggestions
    ];

    res.json(suggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Error generating suggestions' });
  }
});

// Get search history
router.get('/history', validateRequest, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await SearchHistory.find({ userId: req.auth.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SearchHistory.countDocuments({ userId: req.auth.userId });

    res.json({
      history,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching search history' });
  }
});

// Clear search history
router.delete('/history', validateRequest, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.auth.userId });
    res.json({ message: 'Search history cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing search history' });
  }
});

module.exports = router; 