import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'http://127.0.0.1:8081/v1/chat/completions';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'sk-gemini';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

// Smart rule-based fallback assistant when Gemini API server is offline
function generateSmartFallbackResponse(userMessage, burgerMenu, pizzaMenu, activeCoupons) {
  const query = (userMessage || '').toLowerCase();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|yo|good (morning|afternoon|evening))\b/i.test(query)) {
    return `Hey there! 👨‍🍳 Welcome to **Bistro & Stack**! I'm **Chef Gemini**, your personal food concierge.\n\nI can help you with:\n- 🔥 Finding our **best smash burgers** & **wood-fired pizzas**\n- 🌶️ Spicy or 🥑 plant-based recommendations\n- 🎟️ Active **discount coupons**\n- 🍔 Building a custom **combo deal** (Save $5.51!)\n\nWhat are you craving today?`;
  }

  // 2. Coupons / Promo codes / Discounts / Offers
  if (/coupon|promo|discount|offer|deal|code|save|cheap/i.test(query)) {
    return `🎟️ **Active Discounts & Deals Today:**\n\n- **FLAME25** — **25% OFF** on all orders!\n- **BURGER10** — 10% OFF on orders over $15\n- **PIZZA20** — 20% OFF on orders over $20\n- **Meal Deal Builder** — Save **$5.51** instantly when building a custom combo!\n\n💡 *Tip: Enter **FLAME25** at checkout in the promo code box!*`;
  }

  // 3. Spicy recommendations
  if (/spicy|hot|fiery|inferno|diablo|chili|jalapeno|cayenne/i.test(query)) {
    return `🌶️ **Looking for some serious heat? Here are our top spicy favorites:**\n\n1. 🔥 **Inferno Double Angus** ($13.99) — Double 1/3 lb Angus, Smoked Gouda, charred jalapeño crisps & house brisket jam.\n2. 🍗 **Nashville Crispy Clucker** ($12.99) — Buttermilk fried chicken tossed in fiery cayenne oil, dill pickles & tangy slaw.\n3. 🍕 **Diavola Hot Honey Pepperoni Pizza** ($15.99) — Artisan cupping pepperoni, fresh buffalo mozzarella & spicy hot honey drizzle.\n\nWould you like me to recommend a drink to cool down? 🥤`;
  }

  // 4. Vegetarian / Vegan / Plant-Based
  if (/veg|vegan|plant|beyond|meatless|vegetarian/i.test(query)) {
    return `🥑 **Plant-Powered & Vegetarian Highlights:**\n\n1. 🍔 **Green Supreme Beyond Burger** ($13.99) — 100% Plant-based Beyond Patty, avocado puree, vegan garlic aioli, heirloom tomatoes & crispy iceberg on a vegan potato bun.\n2. 🍕 **Vegan Margherita Supreme** ($15.49) — Cashew mozzarella, roasted heirloom cherry tomatoes & basil pesto.\n3. 🍟 **Cajun Truffle Waffle Fries** ($5.99) & **Beer-Battered Onion Rings** ($5.49)\n4. 🧄 **Garlic Parmesan Dough Knots** ($6.49)\n\nAll cooked in dedicated vegetarian fryers! 🌱`;
  }

  // 5. Best Seller / Popular / Top Recommendations
  if (/best|recommend|popular|favorite|signature|top|suggest/i.test(query)) {
    return `🏆 **Chef's Must-Try Recommendations:**\n\n🍔 **Top Burgers:**\n- **Smash Beast Double** ($11.99) — Grass-fed beef, caramelized onions, aged cheese & secret stack sauce.\n- **Truffle & Smoked Gouda** ($15.99) — Black truffle aioli, wild porcini & arugula.\n\n🍕 **Top Pizzas:**\n- **Truffle Burrata & Wild Porcini** ($17.49) — Pugliese burrata heart & sourdough crust.\n- **Diavola Hot Honey Pepperoni** ($15.99) — Crispy pepperoni with hot honey drizzle.\n\n🍟 Don't forget to add **Cajun Truffle Waffle Fries** ($5.99)!`;
  }

  // 6. Delivery time / Shipping / Track
  if (/delivery|time|track|fast|speed|how long|min/i.test(query)) {
    return `⚡ **Delivery Info:**\n- **Average Delivery Time:** 18–25 minutes via express thermal carriers\n- **Free Delivery:** On all orders **over $30** ($2.99 otherwise)\n- **Live Tracking:** You can watch your courier Marcus B. in real-time on our interactive tracker radar! 🚴`;
  }

  // 7. Burger Specific
  if (/burger|smash|angus|beef|chicken|patty/i.test(query)) {
    return `🍔 **Our Handcrafted Burger Lineup:**\n\n- **Smash Beast Double** ($11.99) — Double smash beef, American cheese, crispy caramelized onions.\n- **Inferno Double Angus** ($13.99) — Double Angus, Smoked Gouda, charred jalapeños.\n- **Smokey BBQ Bacon Stack** ($13.49) — Applewood bacon, double cheddar, crispy onion strings.\n- **Nashville Crispy Clucker** ($12.99) — Fiery fried chicken breast with slaw.\n\n👉 *You can click "Customize" on any item to add extra cheese, bacon strips, or truffle aioli!*`;
  }

  // 8. Pizza Specific
  if (/pizza|slice|crust|dough|mozzarella|pepperoni|margherita/i.test(query)) {
    return `🍕 **Wood-Fired Neapolitan Pizza Lineup (Baked at 900°F):**\n\n- **Margherita D.O.P. Classica** ($13.99) — San Marzano tomatoes, fior di latte & fresh basil.\n- **Diavola Hot Honey Pepperoni** ($15.99) — Cupping pepperoni & Mike's Hot Honey.\n- **Truffle Burrata & Wild Porcini** ($17.49) — Creamy burrata & black truffle crema.\n- **Detroit Crispy Edge Pepperoni** ($18.99) — Caramelized cheese crust & deep dish sauce.\n\nSwitch to **Pizza Mode** at the top of the page to browse all options!`;
  }

  // 9. Combo / Meal Deal
  if (/combo|meal deal|bundle|package/i.test(query)) {
    return `🎉 **Custom Meal Deal Builder (Save $5.51!):**\n\nFor only **$16.99**, you get:\n1. 🍔 **Main Item:** Choose your signature burger or artisan pizza\n2. 🍟 **Loaded Side:** Cajun Truffle Fries, Onion Rings, or Tots\n3. 🥤 **Beverage:** Hand-spun shakes or craft sodas\n4. 🍯 **Artisanal Dip:** Smoky Flame Mayo, Truffle Aioli, or Hot Honey\n\nScroll up to the **Custom Meal Deal Builder** section to build yours!`;
  }

  // 10. Shakes / Drinks / Dessert / Sides
  if (/drink|shake|beverage|soda|side|fries|rings|dessert/i.test(query)) {
    return `🥤 **Sides & Hand-Spun Beverages:**\n\n- **Smoked Vanilla Salted Caramel Shake** ($6.49) — Bourbon caramel & toasted marshmallow\n- **Cajun Truffle Waffle Fries** ($5.99) — Creole spice, white truffle oil & parmesan\n- **Beer-Battered Onion Rings** ($5.49) — IPA craft batter & campfire dip\n- **Sicilian Blood Orange Soda** ($3.99) — Sparkling citrus & fresh mint`;
  }

  // Default intelligent helpful response
  return `👨‍🍳 **Chef Gemini at your service!**\n\nI can help you pick the perfect meal today! You can ask me about:\n- **"What's your best spicy burger?"**\n- **"Show vegetarian options"**\n- **"What coupons are active?"**\n- **"How does the combo meal deal work?"**\n\nOr feel free to ask about any specific dish or dietary preference! 🍔🍕`;
}

router.post('/chat', async (req, res, next) => {
  try {
    const { messages, userContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // Retrieve active menu data for dynamic context
    let burgerMenu = [];
    let pizzaMenu = [];
    try {
      burgerMenu = db.getMenuItems('burger');
      pizzaMenu = db.getMenuItems('pizza');
    } catch (e) {
      console.warn('Could not load menu context:', e.message);
    }

    // Try calling external LLM API service if available
    let reply = null;
    try {
      const systemPrompt = `You are "Chef Gemini", the friendly, knowledgeable, and energetic AI Food Concierge at Bistro & Stack (and Bistro & Slice).
Your goal is to help customers choose delicious burgers, pizzas, sides, and combos, answer dietary/ingredient questions, and provide personalized recommendations.
Keep responses concise, mouth-watering, and helpful. Use emojis where appropriate.

Menu Information:
Burgers: ${burgerMenu.map(b => `${b.name} ($${b.price})`).join('; ')}
Pizzas: ${pizzaMenu.map(p => `${p.name} ($${p.price})`).join('; ')}

Active coupons:
- FLAME25 (25% off)
- BURGER10 (10% off over $15)
- PIZZA20 (20% off over $20)

Delivery is 18-25 mins. Free delivery over $30.`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-8)
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for snappy UI

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          messages: formattedMessages
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        reply = data?.choices?.[0]?.message?.content;
      }
    } catch (apiError) {
      // Remote API offline or timeout, proceed to smart fallback
      console.log('[AI Concierge] Local fallback activated:', apiError.message);
    }

    // If external API did not return a response, use our smart fallback concierge
    if (!reply) {
      reply = generateSmartFallbackResponse(lastUserMessage, burgerMenu, pizzaMenu);
    }

    return res.json({
      success: true,
      reply,
      model: GEMINI_MODEL
    });

  } catch (error) {
    console.error('AI chat route error:', error.message);
    const fallbackReply = generateSmartFallbackResponse('hi', [], []);
    return res.json({
      success: true,
      reply: fallbackReply,
      model: 'chef-gemini-engine'
    });
  }
});

export default router;

