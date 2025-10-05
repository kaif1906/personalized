// To run this code you need to install the following dependencies:
// npm install @google/genai mime express multer
// npm install -D @types/node

const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const multer = require('multer');
require('dotenv').config();

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Main recipe generation function
async function generateRecipe(imageBuffer) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = ai.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  const prompt = "Generate a detailed recipe using the ingredients shown in this image. Include ingredients list, instructions, and cooking time.";

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBuffer.toString('base64')
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}

// Express route for recipe generation
router.post('/api/recipes', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const recipe = await generateRecipe(req.file.buffer);
    res.json({ recipes: [{ title: 'Generated Recipe', description: recipe }] });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

module.exports = router;
