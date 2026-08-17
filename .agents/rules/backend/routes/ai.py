import os
import re
import requests
from flask import Blueprint, request, jsonify
from ..db import get_menu_items
from ..middleware.security import get_sanitized_json

ai_bp = Blueprint('ai', __name__)

GEMINI_API_URL = os.getenv('GEMINI_API_URL', 'http://127.0.0.1:8081/v1/chat/completions')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'sk-gemini')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-3.7-flash')

def generate_smart_fallback_response(user_message, burger_menu=None, pizza_menu=None):
    query = (user_message or '').lower().strip()

    # 1. Greetings
    if re.search(r'^(hi|hello|hey|greetings|hola|namaste|yo|good (morning|afternoon|evening))\b', query):
        return ("Hey there! 👨‍🍳 Welcome to **Bistro & Stack**! I'm **Chef Gemini**, your personal food concierge.\n\n"
                "I can help you with:\n"
                "- 🔥 Finding our **best smash burgers** & **wood-fired pizzas**\n"
                "- 🌶️ Spicy or 🥑 plant-based recommendations\n"
                "- 🎟️ Active **discount coupons**\n"
                "- 🍔 Building a custom **combo deal** (Save $5.51!)\n\n"
                "What are you craving today?")

    # 2. Coupons
    if re.search(r'coupon|promo|discount|offer|deal|code|save|cheap', query):
        return ("🎟️ **Active Discounts & Deals Today:**\n\n"
                "- **FLAME25** — **25% OFF** on all orders!\n"
                "- **BURGER10** — 10% OFF on orders over $15\n"
                "- **PIZZA20** — 20% OFF on orders over $20\n"
                "- **Meal Deal Builder** — Save **$5.51** instantly when building a custom combo!\n\n"
                "💡 *Tip: Enter **FLAME25** at checkout in the promo code box!*")

    # 3. Spicy
    if re.search(r'spicy|hot|fiery|inferno|diablo|chili|jalapeno|cayenne', query):
        return ("🌶️ **Looking for some serious heat? Here are our top spicy favorites:**\n\n"
                "1. 🔥 **Inferno Double Angus** ($13.99) — Double 1/3 lb Angus, Smoked Gouda, charred jalapeño crisps & house brisket jam.\n"
                "2. 🍗 **Nashville Crispy Clucker** ($12.99) — Buttermilk fried chicken tossed in fiery cayenne oil, dill pickles & tangy slaw.\n"
                "3. 🍕 **Diavola Hot Honey Pepperoni Pizza** ($15.99) — Artisan cupping pepperoni, fresh buffalo mozzarella & spicy hot honey drizzle.\n\n"
                "Would you like me to recommend a drink to cool down? 🥤")

    # 4. Vegetarian / Vegan
    if re.search(r'veg|vegan|plant|beyond|meatless|vegetarian', query):
        return ("🥑 **Plant-Powered & Vegetarian Highlights:**\n\n"
                "1. 🍔 **Green Supreme Beyond Burger** ($13.99) — 100% Plant-based Beyond Patty, avocado puree, vegan garlic aioli, heirloom tomatoes & crispy iceberg on a vegan potato bun.\n"
                "2. 🍕 **Vegan Margherita Supreme** ($15.49) — Cashew mozzarella, roasted heirloom cherry tomatoes & basil pesto.\n"
                "3. 🍟 **Cajun Truffle Waffle Fries** ($5.99) & **Beer-Battered Onion Rings** ($5.49)\n"
                "4. 🧄 **Garlic Parmesan Dough Knots** ($6.49)\n\n"
                "All cooked in dedicated vegetarian fryers! 🌱")

    # 5. Best Seller / Recommendations
    if re.search(r'best|recommend|popular|favorite|signature|top|suggest', query):
        return ("🏆 **Chef's Must-Try Recommendations:**\n\n"
                "🍔 **Top Burgers:**\n"
                "- **Smash Beast Double** ($11.99) — Grass-fed beef, caramelized onions, aged cheese & secret stack sauce.\n"
                "- **Truffle & Smoked Gouda** ($15.99) — Black truffle aioli, wild porcini & arugula.\n\n"
                "🍕 **Top Pizzas:**\n"
                "- **Truffle Burrata & Wild Porcini** ($17.49) — Pugliese burrata heart & sourdough crust.\n"
                "- **Diavola Hot Honey Pepperoni** ($15.99) — Crispy pepperoni with hot honey drizzle.\n\n"
                "🍟 Don't forget to add **Cajun Truffle Waffle Fries** ($5.99)!")

    # 6. Delivery
    if re.search(r'delivery|time|track|fast|speed|how long|min', query):
        return ("⚡ **Delivery Info:**\n"
                "- **Average Delivery Time:** 18–25 minutes via express thermal carriers\n"
                "- **Free Delivery:** On all orders **over $30** ($2.99 otherwise)\n"
                "- **Live Tracking:** You can watch your courier Marcus B. in real-time on our interactive tracker radar! 🚴")

    # 7. Burgers
    if re.search(r'burger|smash|angus|beef|chicken|patty', query):
        return ("🍔 **Our Handcrafted Burger Lineup:**\n\n"
                "- **Smash Beast Double** ($11.99) — Double smash beef, American cheese, crispy caramelized onions.\n"
                "- **Inferno Double Angus** ($13.99) — Double Angus, Smoked Gouda, charred jalapeños.\n"
                "- **Smokey BBQ Bacon Stack** ($13.49) — Applewood bacon, double cheddar, crispy onion strings.\n"
                "- **Nashville Crispy Clucker** ($12.99) — Fiery fried chicken breast with slaw.\n\n"
                "👉 *You can click \"Customize\" on any item to add extra cheese, bacon strips, or truffle aioli!*")

    # 8. Pizza
    if re.search(r'pizza|slice|crust|dough|mozzarella|pepperoni|margherita', query):
        return ("🍕 **Wood-Fired Neapolitan Pizza Lineup (Baked at 900°F):**\n\n"
                "- **Margherita D.O.P. Classica** ($13.99) — San Marzano tomatoes, fior di latte & fresh basil.\n"
                "- **Diavola Hot Honey Pepperoni** ($15.99) — Cupping pepperoni & Mike's Hot Honey.\n"
                "- **Truffle Burrata & Wild Porcini** ($17.49) — Creamy burrata & black truffle crema.\n"
                "- **Detroit Crispy Edge Pepperoni** ($18.99) — Caramelized cheese crust & deep dish sauce.\n\n"
                "Switch to **Pizza Mode** at the top of the page to browse all options!")

    # 9. Combo
    if re.search(r'combo|meal deal|bundle|package', query):
        return ("🎉 **Custom Meal Deal Builder (Save $5.51!):**\n\n"
                "For only **$16.99**, you get:\n"
                "1. 🍔 **Main Item:** Choose your signature burger or artisan pizza\n"
                "2. 🍟 **Loaded Side:** Cajun Truffle Fries, Onion Rings, or Tots\n"
                "3. 🥤 **Beverage:** Hand-spun shakes or craft sodas\n"
                "4. 🍯 **Artisanal Dip:** Smoky Flame Mayo, Truffle Aioli, or Hot Honey\n\n"
                "Scroll up to the **Custom Meal Deal Builder** section to build yours!")

    # 10. Shakes / Drinks
    if re.search(r'drink|shake|beverage|soda|side|fries|rings|dessert', query):
        return ("🥤 **Sides & Hand-Spun Beverages:**\n\n"
                "- **Smoked Vanilla Salted Caramel Shake** ($6.49) — Bourbon caramel & toasted marshmallow\n"
                "- **Cajun Truffle Waffle Fries** ($5.99) — Creole spice, white truffle oil & parmesan\n"
                "- **Beer-Battered Onion Rings** ($5.49) — IPA craft batter & campfire dip\n"
                "- **Sicilian Blood Orange Soda** ($3.99) — Sparkling citrus & fresh mint")

    return ("👨‍🍳 **Chef Gemini at your service!**\n\n"
            "I can help you pick the perfect meal today! You can ask me about:\n"
            "- **\"What's your best spicy burger?\"**\n"
            "- **\"Show vegetarian options\"**\n"
            "- **\"What coupons are active?\"**\n"
            "- **\"How does the combo meal deal work?\"**\n\n"
            "Or feel free to ask about any specific dish or dietary preference! 🍔🍕")

@ai_bp.route('/chat', methods=['POST'], strict_slashes=False)
def chat():
    try:
        body = get_sanitized_json()
        messages = body.get('messages', [])

        if not messages or not isinstance(messages, list):
            return jsonify({'success': False, 'error': 'Messages array is required'}), 400

        last_user_message = ''
        for m in reversed(messages):
            if m.get('role') == 'user':
                last_user_message = m.get('content', '')
                break

        burger_menu = []
        pizza_menu = []
        try:
            burger_menu = get_menu_items('burger')
            pizza_menu = get_menu_items('pizza')
        except Exception as e:
            pass

        reply = None
        try:
            burger_list_str = "; ".join([f"{b.get('name', '')} (${b.get('price', '')})" for b in burger_menu])
            pizza_list_str = "; ".join([f"{p.get('name', '')} (${p.get('price', '')})" for p in pizza_menu])

            system_prompt = (
                'You are "Chef Gemini", the friendly, knowledgeable, and energetic AI Food Concierge at Bistro & Stack (and Bistro & Slice).\n'
                'Your goal is to help customers choose delicious burgers, pizzas, sides, and combos, answer dietary/ingredient questions, and provide personalized recommendations.\n'
                'Keep responses concise, mouth-watering, and helpful. Use emojis where appropriate.\n\n'
                f'Burgers: {burger_list_str}\n'
                f'Pizzas: {pizza_list_str}\n\n'
                'Active coupons:\n- FLAME25 (25% off)\n- BURGER10 (10% off over $15)\n- PIZZA20 (20% off over $20)\n\n'
                'Delivery is 18-25 mins. Free delivery over $30.'
            )

            formatted_messages = [{'role': 'system', 'content': system_prompt}] + messages[-8:]
            res = requests.post(
                GEMINI_API_URL,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {GEMINI_API_KEY}'
                },
                json={
                    'model': GEMINI_MODEL,
                    'messages': formatted_messages
                },
                timeout=3.5
            )
            if res.ok:
                data = res.json()
                reply = data.get('choices', [{}])[0].get('message', {}).get('content')
        except Exception:
            pass

        if not reply:
            reply = generate_smart_fallback_response(last_user_message, burger_menu, pizza_menu)

        return jsonify({
            'success': True,
            'reply': reply,
            'model': GEMINI_MODEL
        }), 200
    except Exception as e:
        fallback = generate_smart_fallback_response('hi')
        return jsonify({
            'success': True,
            'reply': fallback,
            'model': 'chef-gemini-engine'
        }), 200
