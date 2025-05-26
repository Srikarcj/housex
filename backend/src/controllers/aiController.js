const { generateAIResponse } = require('../utils/aiService');
const Professional = require('../models/Professional');

const aiController = {
  generateResponse: async (req, res) => {
    try {
      const { query, professional } = req.body;
      const response = await generateAIResponse(query, professional);
      res.json({ response });
    } catch (error) {
      console.error('Error generating AI response:', error);
      res.status(500).json({ message: 'Error generating response' });
    }
  },

  searchProfessionals: async (req, res) => {
    try {
      const { query } = req.body;
      const professionals = await Professional.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { services: { $regex: query, $options: 'i' } },
          { skills: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);

      res.json(professionals);
    } catch (error) {
      console.error('Error searching professionals:', error);
      res.status(500).json({ message: 'Error searching professionals' });
    }
  }
};

module.exports = aiController; 