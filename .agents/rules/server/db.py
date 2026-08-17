"""
db.py  —  Python equivalent of server/db.js
In-memory store backed by burger_db.json
"""
import json
import os
import hashlib
import secrets
import uuid
from datetime import datetime, timezone
from threading import Lock

DB_FILE = os.path.join(os.path.dirname(__file__), "burger_db.json")
_lock = Lock()

# ── Initial seed data ────────────────────────────────────────────────────────

INITIAL_DATA = {
    "coupons": [
        {"code": "FLAME25",  "discountPercent": 25, "minOrder": 0,  "active": True, "description": "25% OFF on all orders"},
        {"code": "BURGER10", "discountPercent": 10, "minOrder": 15, "active": True, "description": "10% OFF on orders over $15"},
        {"code": "PIZZA20",  "discountPercent": 20, "minOrder": 20, "active": True, "description": "20% OFF on orders over $20"},
    ],
    "menu": {
        "burgers": [
            {"id": "b1", "name": "Smash Beast Double",         "category": "smash",   "price": 11.99, "origPrice": 13.99, "calories": 780, "diet": ["bestseller"], "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80", "desc": "Double smashed grass-fed beef patties, American aged cheese, crispy caramelized onions, stack glaze on toasted buttered brioche."},
            {"id": "b2", "name": "Inferno Double Angus",        "category": "angus",   "price": 13.99, "origPrice": 16.50, "calories": 890, "diet": ["spicy","bestseller"], "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80", "desc": "Double 1/3 lb Angus, Smoked Gouda, charred jalapeño crisps & house brisket jam on toasted brioche."},
            {"id": "b3", "name": "Truffle & Smoked Gouda",      "category": "angus",   "price": 15.99, "origPrice": 18.00, "calories": 840, "diet": [], "image": "https://images.unsplash.com/photo-1583032015879-6725bc7c5db0?w=800&auto=format&fit=crop&q=80", "desc": "Black truffle butter aioli, sautéed wild porcini mushrooms, melted smoked gouda cheese & baby arugula on brioche."},
            {"id": "b4", "name": "Nashville Crispy Clucker",    "category": "chicken", "price": 12.99, "origPrice": 14.50, "calories": 760, "diet": ["spicy"], "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80", "desc": "24hr buttermilk fried chicken breast tossed in fiery cayenne pepper oil, tangy dill pickles, creamy slaw & ranch drizzle."},
            {"id": "b5", "name": "Smokey BBQ Bacon Stack",      "category": "smash",   "price": 13.49, "origPrice": 15.99, "calories": 860, "diet": ["bestseller"], "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80", "desc": "Applewood smoked thick-cut bacon, double cheddar, crispy beer-battered onion strings & hickory chipotle BBQ glaze."},
            {"id": "b6", "name": "Green Supreme Beyond Burger", "category": "plant",   "price": 13.99, "origPrice": 15.99, "calories": 620, "diet": ["veggie"], "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80", "desc": "100% Plant-based Beyond Patty, avocado puree, vegan garlic aioli, heirloom tomatoes & crispy iceberg in vegan potato bun."},
            {"id": "s1", "name": "Cajun Truffle Waffle Fries",  "category": "sides",   "price": 5.99,  "calories": 420, "diet": ["bestseller"], "image": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80", "desc": "Criss-cross waffle potatoes dusted in signature Creole spice, white truffle oil & shaved parmesan cheese."},
            {"id": "s2", "name": "Beer-Battered Onion Rings",   "category": "sides",   "price": 5.49,  "calories": 390, "diet": [], "image": "https://images.unsplash.com/photo-1639024471287-032f6670523d?w=800&auto=format&fit=crop&q=80", "desc": "Jumbo sweet vidalia onions soaked in craft IPA batter, fried to golden crunch. Served with campfire dipping sauce."},
            {"id": "d1", "name": "Smoked Vanilla Salted Caramel Shake", "category": "drinks", "price": 6.49, "calories": 520, "diet": [], "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80", "desc": "Hand-spun vanilla bean ice cream, bourbon caramel swirl & house-smoked toasted marshmallow whip."},
            {"id": "d2", "name": "Sicilian Blood Orange Soda",  "category": "drinks",  "price": 3.99,  "calories": 120, "diet": [], "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80", "desc": "Sparkling Sicilian blood orange juice, fresh mint & hibiscus. Non-alcoholic craft soda."},
            {"id": "p1", "name": "Garlic Parmesan Dough Knots", "category": "sides",   "price": 6.49,  "calories": 310, "diet": ["veggie"], "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80", "desc": "Hand-rolled brioche knots brushed with roasted garlic butter & aged parmesan. Perfect for dipping."},
        ],
        "pizzas": [
            {"id": "pz1", "name": "Margherita D.O.P. Classica",      "category": "classic",  "price": 13.99, "origPrice": 16.00, "calories": 680, "diet": ["veggie","bestseller"], "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80", "desc": "Authentic San Marzano tomato sauce, fior di latte mozzarella, fresh basil & extra virgin olive oil on 48-hr sourdough crust."},
            {"id": "pz2", "name": "Diavola Hot Honey Pepperoni",      "category": "meat",     "price": 15.99, "origPrice": 18.50, "calories": 820, "diet": ["spicy","bestseller"], "image": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80", "desc": "Artisan cupping pepperoni, fresh buffalo mozzarella, nduja sausage & Mike's Hot Honey drizzle on Neapolitan crust."},
            {"id": "pz3", "name": "Truffle Burrata & Wild Porcini",   "category": "gourmet",  "price": 17.49, "origPrice": 21.00, "calories": 740, "diet": [], "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80", "desc": "Pugliese burrata heart, wild porcini mushrooms, black truffle crema & parmigiano-reggiano on sourdough crust."},
            {"id": "pz4", "name": "Detroit Crispy Edge Pepperoni",    "category": "detroit",  "price": 18.99, "origPrice": 22.00, "calories": 920, "diet": ["bestseller"], "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80", "desc": "Wisconsin brick cheese caramelized edges, pepperoni cups & double-layer Detroit-style deep dish with ember-roasted tomato sauce."},
            {"id": "pz5", "name": "Vegan Margherita Supreme",         "category": "vegan",    "price": 15.49, "origPrice": 18.00, "calories": 590, "diet": ["veggie"], "image": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&auto=format&fit=crop&q=80", "desc": "Cashew mozzarella, roasted heirloom cherry tomatoes, basil pesto & nutritional yeast on vegan sourdough base."},
            {"id": "pz6", "name": "Smoky BBQ Pulled Jackfruit Pizza", "category": "vegan",    "price": 16.49, "origPrice": 19.00, "calories": 640, "diet": ["veggie","spicy"], "image": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80", "desc": "Slow-cooked BBQ jackfruit, smoked vegan cheddar, pickled red onion & chipotle ranch on artisan crust."},
            {"id": "pzs1", "name": "Garlic Parmesan Dough Knots",    "category": "sides",    "price": 6.49,  "calories": 310, "diet": ["veggie"], "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80", "desc": "Hand-rolled brioche knots brushed with roasted garlic butter & aged parmesan. Perfect for dipping in marinara."},
            {"id": "pzs2", "name": "Sicilian Calamari Fritti",        "category": "sides",    "price": 8.49,  "calories": 480, "diet": [], "image": "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=800&auto=format&fit=crop&q=80", "desc": "Lightly battered Sicilian calamari rings, fried crispy golden, with charred lemon & marinara dip."},
            {"id": "pzd1", "name": "Sicilian Blood Orange Soda",      "category": "drinks",   "price": 3.99,  "calories": 120, "diet": [], "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80", "desc": "Sparkling Sicilian blood orange juice, fresh mint & hibiscus. Non-alcoholic craft soda."},
            {"id": "pzd2", "name": "Italian Espresso Affogato",       "category": "drinks",   "price": 5.49,  "calories": 290, "diet": [], "image": "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&auto=format&fit=crop&q=80", "desc": "Double ristretto espresso poured over vanilla gelato. Classic Italian dessert drink."},
        ],
    },
    "orders": [],
    "users": [],
}


# ── Internal helpers ─────────────────────────────────────────────────────────

def _hash_password(password: str, salt: str | None = None):
    if salt is None:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha512", password.encode(), salt.encode(), 1000, dklen=64)
    return salt, dk.hex()


def _verify_password(password: str, salt: str, stored_hash: str) -> bool:
    _, h = _hash_password(password, salt)
    return h == stored_hash


def _load() -> dict:
    if not os.path.exists(DB_FILE):
        return {k: v for k, v in INITIAL_DATA.items()}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Merge in any missing top-level keys
    for key in INITIAL_DATA:
        data.setdefault(key, INITIAL_DATA[key])
    return data


def _save(data: dict):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── Public DB interface ───────────────────────────────────────────────────────

def get_menu_items(mode: str = "burger", filters: dict | None = None) -> list:
    filters = filters or {}
    data = _load()
    key = "pizzas" if mode == "pizza" else "burgers"
    items = list(data.get("menu", {}).get(key, []))

    # Normalize diet field
    for item in items:
        d = item.get("diet", [])
        if isinstance(d, str):
            try:
                item["diet"] = json.loads(d)
            except Exception:
                item["diet"] = [d] if d else []

    category = filters.get("category")
    diet = filters.get("diet")
    search = (filters.get("search") or "").lower().strip()
    sort = filters.get("sort", "popular")

    if category:
        items = [i for i in items if i.get("category", "").lower() == category.lower()]
    if diet and diet != "all":
        items = [i for i in items if diet in (i.get("diet") or [])]
    if search:
        items = [i for i in items if search in i.get("name", "").lower() or search in i.get("desc", "").lower()]

    if sort == "price-low":
        items.sort(key=lambda i: i.get("price", 0))
    elif sort == "price-high":
        items.sort(key=lambda i: i.get("price", 0), reverse=True)
    elif sort == "calories":
        items.sort(key=lambda i: i.get("calories", 0))

    return items


def get_coupon(code: str) -> dict | None:
    data = _load()
    for c in data.get("coupons", []):
        if c["code"].upper() == code.upper() and c.get("active"):
            return c
    return None


def create_order(order_data: dict) -> dict:
    with _lock:
        data = _load()
        order_id = "ORD-" + str(uuid.uuid4()).upper()[:8]
        order = {
            "orderId": order_id,
            "status": "RECEIVED",
            "createdAt": _now(),
            "userId": order_data.get("userId"),
            "customer": {
                "name": order_data["customerName"],
                "address": order_data["deliveryAddress"],
                "phone": order_data["phone"],
                "paymentMethod": order_data.get("paymentMethod", "card"),
            },
            "items": order_data["items"],
            "pricing": {
                "subtotal": order_data["subtotal"],
                "discount": order_data.get("discount", 0),
                "deliveryFee": order_data["deliveryFee"],
                "tax": order_data["tax"],
                "tip": order_data.get("tip", 0),
                "grandTotal": order_data["grandTotal"],
            },
            "courier": {"name": "Marcus B.", "vehicle": "Express E-Bike"},
        }
        data.setdefault("orders", []).append(order)
        _save(data)
        return order


def get_recent_orders(limit: int = 50) -> list:
    data = _load()
    orders = data.get("orders", [])
    return list(reversed(orders[-limit:]))


def get_order_by_id(order_id: str) -> dict | None:
    data = _load()
    for o in data.get("orders", []):
        if o.get("orderId", "").upper() == order_id.upper():
            return o
    return None


def update_order_status(order_id: str, status: str) -> dict | None:
    with _lock:
        data = _load()
        for o in data.get("orders", []):
            if o.get("orderId", "").upper() == order_id.upper():
                o["status"] = status
                _save(data)
                return o
    return None


def get_user_orders(identifier: str) -> list:
    data = _load()
    result = []
    for o in data.get("orders", []):
        uid = o.get("userId", "")
        phone = (o.get("customer") or {}).get("phone", "")
        if identifier and (uid == identifier or phone == identifier):
            result.append(o)
    return list(reversed(result))


# ── User / Auth ───────────────────────────────────────────────────────────────

def register_user(name: str, email: str, password: str, phone: str = "", address: str = "") -> dict:
    with _lock:
        data = _load()
        users = data.setdefault("users", [])
        if any(u.get("email", "").lower() == email.lower() for u in users):
            return {"success": False, "error": "An account with that email already exists."}
        salt, pw_hash = _hash_password(password)
        token = "tok_" + secrets.token_hex(24)
        user = {
            "userId": "usr_" + str(uuid.uuid4())[:8],
            "name": name,
            "email": email.lower(),
            "phone": phone,
            "address": address,
            "passwordHash": pw_hash,
            "passwordSalt": salt,
            "token": token,
            "createdAt": _now(),
        }
        users.append(user)
        _save(data)
        safe = {k: v for k, v in user.items() if k not in ("passwordHash", "passwordSalt")}
        return {"success": True, "user": safe, "token": token}


def login_user(email: str, password: str) -> dict:
    data = _load()
    for u in data.get("users", []):
        if u.get("email", "").lower() == email.lower():
            if _verify_password(password, u["passwordSalt"], u["passwordHash"]):
                safe = {k: v for k, v in u.items() if k not in ("passwordHash", "passwordSalt")}
                return {"success": True, "user": safe, "token": u["token"]}
            return {"success": False, "error": "Incorrect password."}
    return {"success": False, "error": "No account found with that email."}


def get_user_by_token(token: str) -> dict | None:
    data = _load()
    for u in data.get("users", []):
        if u.get("token") == token:
            return {k: v for k, v in u.items() if k not in ("passwordHash", "passwordSalt")}
    return None


def update_user_profile(user_id: str, name: str = None, phone: str = None, address: str = None) -> dict | None:
    with _lock:
        data = _load()
        for u in data.get("users", []):
            if u.get("userId") == user_id:
                if name:    u["name"] = name
                if phone:   u["phone"] = phone
                if address: u["address"] = address
                _save(data)
                return {k: v for k, v in u.items() if k not in ("passwordHash", "passwordSalt")}
    return None
