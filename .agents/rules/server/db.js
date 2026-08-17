import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'burger_db.json');

// Helper for secure password hashing
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, originalHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// Default initial database state
const INITIAL_DATA = {
  coupons: [
    { code: 'FLAME25', discountPercent: 25, minOrder: 0, active: true, description: '25% OFF on all orders' },
    { code: 'BURGER10', discountPercent: 10, minOrder: 15, active: true, description: '10% OFF on orders over $15' },
    { code: 'PIZZA20', discountPercent: 20, minOrder: 20, active: true, description: '20% OFF on orders over $20' }
  ],
  menu: {
    burgers: [
      {
        id: 'b1',
        name: 'Smash Beast Double',
        category: 'smash',
        price: 11.99,
        origPrice: 13.99,
        calories: 780,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
        desc: 'Double smashed grass-fed beef patties, American aged cheese, crispy caramelized onions, stack glaze on toasted buttered brioche.'
      },
      {
        id: 'b2',
        name: 'Inferno Double Angus',
        category: 'angus',
        price: 13.99,
        origPrice: 16.50,
        calories: 890,
        diet: ['spicy', 'bestseller'],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        desc: 'Double 1/3 lb Angus, Smoked Gouda, charred jalapeño crisps & house brisket jam on toasted brioche.'
      },
      {
        id: 'b3',
        name: 'Truffle & Smoked Gouda',
        category: 'angus',
        price: 15.99,
        origPrice: 18.00,
        calories: 840,
        diet: [],
        image: 'https://images.unsplash.com/photo-1583032015879-6725bc7c5db0?w=800&auto=format&fit=crop&q=80',
        desc: 'Black truffle butter aioli, sautéed wild porcini mushrooms, melted smoked gouda cheese & baby arugula on brioche.'
      },
      {
        id: 'b4',
        name: 'Nashville Crispy Clucker',
        category: 'chicken',
        price: 12.99,
        origPrice: 14.50,
        calories: 760,
        diet: ['spicy'],
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
        desc: '24hr buttermilk fried chicken breast tossed in fiery cayenne pepper oil, tangy dill pickles, creamy slaw & ranch drizzle.'
      },
      {
        id: 'b5',
        name: 'Smokey BBQ Bacon Stack',
        category: 'smash',
        price: 13.49,
        origPrice: 15.99,
        calories: 860,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80',
        desc: 'Applewood smoked thick-cut bacon, double cheddar, crispy beer-battered onion strings & hickory chipotle BBQ glaze.'
      },
      {
        id: 'b6',
        name: 'Green Supreme Beyond Burger',
        category: 'plant',
        price: 13.99,
        origPrice: 15.99,
        calories: 620,
        diet: ['veggie'],
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80',
        desc: '100% Plant-based Beyond Patty, avocado puree, vegan garlic aioli, heirloom tomatoes & crispy iceberg in vegan potato bun.'
      },
      {
        id: 's1',
        name: 'Cajun Truffle Waffle Fries',
        category: 'sides',
        price: 5.99,
        calories: 420,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
        desc: 'Criss-cross waffle potatoes dusted in signature Creole spice, white truffle oil & shaved parmesan cheese.'
      },
      {
        id: 's2',
        name: 'Beer-Battered Onion Rings',
        category: 'sides',
        price: 5.49,
        calories: 390,
        diet: [],
        image: 'https://images.unsplash.com/photo-1639024471287-032f6670523d?w=800&auto=format&fit=crop&q=80',
        desc: 'Jumbo sweet vidalia onions soaked in craft IPA batter, fried to golden crunch. Served with campfire dipping sauce.'
      },
      {
        id: 'd1',
        name: 'Smoked Vanilla Salted Caramel Shake',
        category: 'drinks',
        price: 6.49,
        calories: 510,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
        desc: 'Madagascar vanilla bean ice cream hand-spun with smoked bourbon caramel, sea salt crystals & toasted marshmallow topping.'
      }
    ],
    pizzas: [
      {
        id: 'pz1',
        name: 'Diavola Hot Honey Pepperoni',
        category: 'neapolitan',
        price: 15.99,
        origPrice: 18.50,
        calories: 960,
        diet: ['spicy', 'bestseller'],
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80',
        desc: 'Artisan cupping pepperoni, fresh buffalo mozzarella, crushed red pepper flakes, hot honey drizzle & fresh basil.'
      },
      {
        id: 'pz2',
        name: 'Truffle Burrata & Wild Porcini',
        category: 'neapolitan',
        price: 17.49,
        origPrice: 19.99,
        calories: 880,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
        desc: 'Creamy pugliese burrata heart, black truffle crema, sautéed wild mushrooms & fresh thyme on sourdough crust.'
      },
      {
        id: 'pz3',
        name: 'Margherita D.O.P. Classica',
        category: 'neapolitan',
        price: 13.99,
        origPrice: 15.50,
        calories: 740,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
        desc: 'San Marzano tomato sauce, fior di latte mozzarella, extra virgin cold-pressed olive oil & sweet Genovese basil.'
      },
      {
        id: 'pz4',
        name: 'Detroit Crispy Edge Pepperoni',
        category: 'deepdish',
        price: 18.99,
        origPrice: 21.00,
        calories: 1080,
        diet: ['spicy'],
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
        desc: 'Thick caramelized Wisconsin brick cheddar cheese crust, racing stripes of rich red sauce, and double crispy pepperoni cups.'
      },
      {
        id: 'pz5',
        name: 'Prosciutto Di Parma & Arugula',
        category: 'thincrispy',
        price: 16.99,
        origPrice: 19.00,
        calories: 820,
        diet: [],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
        desc: '24-month aged Prosciutto di Parma, shaved Parmigiano-Reggiano, organic baby arugula & balsamic reduction glaze.'
      },
      {
        id: 'pz6',
        name: 'Vegan Margherita Supreme',
        category: 'vegan',
        price: 15.49,
        origPrice: 17.50,
        calories: 680,
        diet: ['veggie'],
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
        desc: 'House-made cashew mozzarella, roasted heirloom cherry tomatoes, basil pesto & cold-pressed Sicilian olive oil.'
      },
      {
        id: 'pzs1',
        name: 'Garlic Parmesan Dough Knots (6pc)',
        category: 'appetizers',
        price: 6.49,
        calories: 360,
        diet: ['bestseller'],
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=80',
        desc: 'Warm fluffy sourdough knots brushed with melted roasted garlic butter, parsley & aged grated pecorino.'
      },
      {
        id: 'pzs2',
        name: 'Crispy Stuffed Mozzarella Sticks',
        category: 'appetizers',
        price: 6.99,
        calories: 410,
        diet: [],
        image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&auto=format&fit=crop&q=80',
        desc: 'Herb-breaded whole milk mozzarella with bubbling cheese pull, served with warm San Marzano marinara dip.'
      }
    ]
  },
  users: [],
  orders: []
};

// Thread-safe in-memory cache synchronized with JSON storage
let dbData = { ...INITIAL_DATA };

// Load database from file or initialize
function initDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      dbData = JSON.parse(raw);
      if (!dbData.users) dbData.users = [];
      if (!dbData.orders) dbData.orders = [];
    } else {
      saveDB();
    }
  } catch (err) {
    console.error('[DB] Error loading database file, initializing default:', err.message);
    dbData = { ...INITIAL_DATA };
    saveDB();
  }
}

// Persist data to file
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error saving to disk:', err.message);
  }
}

// Initialize on module load
initDB();

export const db = {
  // Menu queries
  getMenuItems(mode = 'burger', { category = 'all', diet = 'all', search = '', sort = 'popular' } = {}) {
    const list = mode === 'pizza' ? dbData.menu.pizzas : dbData.menu.burgers;
    let filtered = list.filter(item => {
      // Normalize diet to always be an array (guards against DB file corruption where it may be stored as a string)
      const dietArr = Array.isArray(item.diet) ? item.diet : (item.diet ? String(item.diet).split(' ') : []);
      const matchCat = category === 'all' || item.category === category;
      const matchDiet = diet === 'all' || dietArr.includes(diet);
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchDiet && matchSearch;
    });

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'calories') filtered.sort((a, b) => a.calories - b.calories);

    return filtered;
  },

  // Coupon lookup
  getCoupon(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return dbData.coupons.find(c => c.code === cleanCode && c.active) || null;
  },

  // User Authentication & Management
  registerUser({ name, email, password, phone = '', address = '' }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) return { success: false, error: 'Email and password are required' };

    const existing = dbData.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists' };
    }

    const { salt, hash } = hashPassword(password);
    const userId = `USR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;

    const newUser = {
      userId,
      name: name.trim() || 'Food Lover',
      email: cleanEmail,
      phone: phone.trim() || '',
      address: address.trim() || '',
      salt,
      passwordHash: hash,
      token,
      createdAt: new Date().toISOString(),
      role: 'customer'
    };

    dbData.users.push(newUser);
    saveDB();

    const { salt: _s, passwordHash: _p, ...safeUser } = newUser;
    return { success: true, user: safeUser, token };
  },

  loginUser({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = dbData.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
    user.token = token;
    saveDB();

    const { salt: _s, passwordHash: _p, ...safeUser } = user;
    return { success: true, user: safeUser, token };
  },

  getUserByToken(token) {
    if (!token) return null;
    const cleanToken = token.replace('Bearer ', '').trim();
    const user = dbData.users.find(u => u.token === cleanToken);
    if (!user) return null;
    const { salt: _s, passwordHash: _p, ...safeUser } = user;
    return safeUser;
  },

  updateUserProfile(userId, { name, phone, address }) {
    const user = dbData.users.find(u => u.userId === userId);
    if (!user) return null;
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (address) user.address = address.trim();
    saveDB();
    const { salt: _s, passwordHash: _p, ...safeUser } = user;
    return safeUser;
  },

  // Create and save new order
  createOrder(orderPayload) {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    
    const newOrder = {
      orderId,
      userId: orderPayload.userId || null,
      createdAt: now.toISOString(),
      customer: {
        name: orderPayload.customerName,
        address: orderPayload.deliveryAddress,
        phone: orderPayload.phone,
        paymentMethod: orderPayload.paymentMethod || 'card'
      },
      items: orderPayload.items,
      pricing: {
        subtotal: orderPayload.subtotal,
        discount: orderPayload.discount || 0,
        deliveryFee: orderPayload.deliveryFee || 0,
        tax: orderPayload.tax || 0,
        tip: orderPayload.tip || 0,
        grandTotal: orderPayload.grandTotal
      },
      status: 'PREPARING', // 'RECEIVED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED'
      courier: {
        name: 'Marcus B. (E-Bike)',
        etaMinutes: 18,
        lat: 40.7128,
        lng: -74.0060
      }
    };

    dbData.orders.unshift(newOrder);
    saveDB();
    return newOrder;
  },

  // Lookup order
  getOrderById(orderId) {
    if (!orderId) return null;
    return dbData.orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase()) || null;
  },

  // List recent orders
  getRecentOrders(limit = 50) {
    return dbData.orders.slice(0, limit);
  },

  // Get orders by customer email or user ID
  getUserOrders(userIdOrEmail) {
    if (!userIdOrEmail) return [];
    const val = userIdOrEmail.toLowerCase();
    return dbData.orders.filter(o => 
      (o.userId && o.userId.toLowerCase() === val) ||
      (o.customer?.phone && o.customer.phone === val) ||
      (o.customer?.name && o.customer.name.toLowerCase() === val)
    );
  },

  // Update order status
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.status = newStatus;
    saveDB();
    return order;
  }
};

export default db;

