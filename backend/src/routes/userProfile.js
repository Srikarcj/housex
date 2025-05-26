const express = require('express');
const router = express.Router();
const { UserProfile } = require('../models/schema');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const { validateRequest } = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get user profile
router.get('/profile', validateRequest, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Create or update user profile with advanced features
router.post('/', validateRequest, upload.array('images', 5), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      isProfessional,
      professionalDetails,
      preferences,
      skills,
      certifications,
      portfolio
    } = req.body;

    // Upload images to Cloudinary if provided
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({
            folder: 'housex/profiles',
            resource_type: 'auto'
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }).end(file.buffer);
        });
      });
      uploadedImages = await Promise.all(uploadPromises);
    }

    // Generate AI-powered profile suggestions
    const prompt = `Analyze this professional profile and provide suggestions for:
    1. Profile optimization
    2. Service presentation
    3. Portfolio enhancement
    Profile details: ${JSON.stringify(req.body)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200
    });

    const suggestions = completion.data.choices[0].text.trim();

    // Create or update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.auth.userId },
      {
        userId: req.auth.userId,
        firstName,
        lastName,
        phone,
        address,
        isProfessional,
        professionalDetails: isProfessional ? {
          ...professionalDetails,
          portfolio: [...(professionalDetails?.portfolio || []), ...uploadedImages],
          skills,
          certifications
        } : null,
        preferences,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      profile,
      suggestions
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get user profile with enhanced information
router.get('/', validateRequest, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.auth.userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Generate AI-powered profile insights
    const prompt = `Analyze this user profile and provide insights about:
    1. Profile completeness
    2. Professional strengths
    3. Areas for improvement
    4. Service recommendations
    Profile: ${JSON.stringify(profile)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200
    });

    const insights = completion.data.choices[0].text.trim();

    res.json({
      profile,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Get professional profile with advanced features
router.get('/professional/:id', validateRequest, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.params.id,
      isProfessional: true
    }).populate('professionalDetails.reviews');

    if (!profile) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    // Generate AI-powered professional analysis
    const prompt = `Analyze this professional profile and provide insights about:
    1. Service quality indicators
    2. Customer satisfaction metrics
    3. Professional strengths
    4. Service recommendations
    Profile: ${JSON.stringify(profile)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200
    });

    const analysis = completion.data.choices[0].text.trim();

    res.json({
      profile,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching professional profile' });
  }
});

// Search professionals
router.get('/professionals', async (req, res) => {
  try {
    const {
      service,
      location,
      minRating,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isProfessional: true };
    
    if (service) {
      query['professionalDetails.services'] = service;
    }
    
    if (location) {
      query['address.city'] = new RegExp(location, 'i');
    }

    const professionals = await UserProfile.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ 'professionalDetails.rating': -1 });

    const total = await UserProfile.countDocuments(query);

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

// Update professional availability
router.put('/availability', validateRequest, async (req, res) => {
  try {
    const { availability, serviceAreas, pricing } = req.body;

    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile || !profile.isProfessional) {
      return res.status(403).json({ error: 'Not a professional account' });
    }

    profile.professionalDetails.availability = availability;
    profile.professionalDetails.serviceAreas = serviceAreas;
    profile.professionalDetails.pricing = pricing;
    profile.lastUpdated = new Date();

    await profile.save();

    // Generate AI-powered availability insights
    const prompt = `Analyze this professional's availability and provide insights about:
    1. Peak service hours
    2. Service area optimization
    3. Pricing strategy recommendations
    Details: ${JSON.stringify(req.body)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150
    });

    const insights = completion.data.choices[0].text.trim();

    res.json({
      profile,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating availability' });
  }
});

// Add professional review
router.post('/review/:professionalId', validateRequest, async (req, res) => {
  try {
    const { rating, comment, serviceType } = req.body;
    const professional = await UserProfile.findOne({
      userId: req.params.professionalId,
      isProfessional: true
    });

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const review = {
      userId: req.auth.userId,
      rating,
      comment,
      serviceType,
      date: new Date()
    };

    professional.professionalDetails.reviews.push(review);
    
    // Update average rating
    const reviews = professional.professionalDetails.reviews;
    professional.professionalDetails.rating = 
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await professional.save();

    // Generate AI-powered review analysis
    const prompt = `Analyze this professional review and provide insights about:
    1. Review sentiment
    2. Service quality indicators
    3. Areas for improvement
    Review: ${JSON.stringify(review)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150
    });

    const analysis = completion.data.choices[0].text.trim();

    res.json({
      review,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding review' });
  }
});

// Get professional recommendations
router.get('/recommendations', validateRequest, async (req, res) => {
  try {
    const { serviceType, location, rating } = req.query;

    const query = {
      isProfessional: true,
      'professionalDetails.services': serviceType,
      'professionalDetails.rating': { $gte: rating || 0 }
    };

    if (location) {
      query['address.city'] = new RegExp(location, 'i');
    }

    const professionals = await UserProfile.find(query)
      .sort({ 'professionalDetails.rating': -1 })
      .limit(10);

    // Generate AI-powered recommendations
    const prompt = `Analyze these professional recommendations and provide insights about:
    1. Best matches for the service
    2. Location optimization
    3. Service quality indicators
    Professionals: ${JSON.stringify(professionals)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200
    });

    const insights = completion.data.choices[0].text.trim();

    res.json({
      professionals,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
});

// Delete user profile
router.delete('/profile', validateRequest, async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ userId: req.auth.userId });
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting profile' });
  }
});

module.exports = router; 