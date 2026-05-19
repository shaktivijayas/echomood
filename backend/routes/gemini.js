const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCraLWQXpbjjNBj6Eky1yKRisO3shoQ4J4';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Health check for Gemini service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'gemini-mood-ai',
    api_key_configured: !!GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE'
  });
});

// Generate AI response for mood
router.post('/gemini', async (req, res) => {
  try {
    // Validate API key
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(500).json({ 
        error: 'Gemini API key not configured',
        details: 'Please set GEMINI_API_KEY environment variable'
      });
    }

    // Get request data
    const { mood } = req.body;
    if (!mood || !mood.trim()) {
      return res.status(400).json({ 
        error: 'Mood text is required',
        details: 'Please provide a mood description'
      });
    }

    // Prepare the prompt for empathetic response
    const prompt = `The user is sharing their current mood or feelings: "${mood}"

Please respond empathetically and helpfully. Your response should:
1. Acknowledge their feelings with empathy
2. Provide gentle, supportive advice if appropriate
3. Be encouraging and positive
4. Keep the response conversational and warm
5. Be concise but meaningful (2-3 sentences)

Remember to be sensitive to their emotional state and avoid being overly clinical or dismissive.`;

    // Prepare the request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
        stopSequences: []
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY
    };

    console.log(`Making request to Gemini API for mood: ${mood.substring(0, 50)}...`);

    // Make request to Gemini API
    const response = await axios.post(GEMINI_URL, payload, { 
      headers,
      timeout: 30000
    });

    if (response.status !== 200) {
      console.error(`Gemini API error: ${response.status} - ${response.data}`);
      return res.status(response.status).json({
        error: 'Failed to generate response',
        details: response.data
      });
    }

    // Parse response
    const responseData = response.data;
    
    // Extract the generated text
    if (responseData.candidates && responseData.candidates.length > 0) {
      const candidate = responseData.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const generatedText = candidate.content.parts[0].text;
        
        console.log('Successfully generated mood response');
        
        return res.json({
          response: generatedText,
          user_mood: mood,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('Unexpected response structure from Gemini API');
        return res.status(500).json({ error: 'Unexpected response from AI service' });
      }
    } else {
      console.error('No candidates in Gemini API response');
      return res.status(500).json({ error: 'No response generated' });
    }

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request to Gemini API timed out');
      return res.status(504).json({ error: 'Request timed out' });
    } else if (error.response) {
      console.error(`Gemini API error: ${error.response.status} - ${error.response.data}`);
      return res.status(error.response.status).json({
        error: 'Failed to generate response',
        details: error.response.data
      });
    } else if (error.request) {
      console.error('Network error occurred:', error.message);
      return res.status(500).json({ error: 'Network error occurred' });
    } else {
      console.error('Unexpected error:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;