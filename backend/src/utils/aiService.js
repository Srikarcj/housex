const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAIResponse = async (query, professional) => {
  try {
    const prompt = `You are an AI assistant helping a professional in the ${professional.services.join(', ')} industry. 
    The professional's name is ${professional.name}. 
    Please provide a helpful and professional response to the following query: ${query}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping a professional in the ${professional.services.join(', ')} industry. 
          The professional's name is ${professional.name}. 
          Please provide helpful, accurate, and professional responses.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};

module.exports = {
  generateAIResponse
}; 