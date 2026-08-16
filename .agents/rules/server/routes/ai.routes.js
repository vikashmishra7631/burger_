import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'http://127.0.0.1:8081/v1/chat/completions';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'sk-gemini';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

router.post('/chat', async (req, res, next) => {
  try {
    const { messages, userContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    // Retrieve active menu data for dynamic context
    let menuContext = '';
    try {
      const burgerMenu = db.getMenuItems('burger');
      const pizzaMenu = db.getMenuItems('pizza');
      menuContext = `
Available Burgers: ${burgerMenu.map(b => `${b.name} ($${b.price}) - ${b.desc}`).join('; ')}
Available Pizzas: ${pizzaMenu.map(p => `${p.name} ($${p.price}) - ${p.desc}`).join('; ')}
`;
    } catch (e) {
      console.warn('Could not load menu context:', e.message);
    }

    const systemPrompt = `You are "Chef Gemini", the friendly, knowledgeable, and energetic AI Food Concierge at Bistro & Stack (and Bistro & Slice).
Your goal is to help customers choose delicious burgers, pizzas, sides, and combos, answer dietary/ingredient questions, and provide personalized recommendations.
Keep responses concise, mouth-watering, and helpful. Use emojis where appropriate.

Menu Information:
${menuContext}

Active coupons:
- FIRSTSTACK (20% off first order)
- CHEFSTACK (15% off orders over $40)
- FREEDRINK (Free drink on orders over $30)

Delivery time is approx 25-35 minutes. Free delivery over $35.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-8) // keep last 8 messages for context
    ];

    const payload = {
      model: GEMINI_MODEL,
      messages: formattedMessages
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'I am ready to help you with your order!';

    res.json({
      success: true,
      reply,
      model: GEMINI_MODEL
    });

  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response. Please make sure the Gemini API service is running.'
    });
  }
});

export default router;
