import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userDB, orderDB, subscriberDB, conciergeDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'chronova_geneva_haute_horlogerie_super_secret_key_2026';

// 1. Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. Rate Limiting to protect endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests. Please try again later.' }
});

app.use('/api/', apiLimiter);

// 3. JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token' });
    }
    req.user = decoded;
    next();
  });
}

// 4. API Endpoints

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Chronova Haute Horlogerie API', version: '2.0.0' });
});

// --- AUTHENTICATION ---

// Register New VIP Patron
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = userDB.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A patron with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.trim().toLowerCase(),
      passwordHash,
      memberId: `#CN-${Math.floor(1000 + Math.random() * 9000)}-CH`,
      tier: 'PATRON TIER',
      vaultItems: [],
      createdAt: new Date().toISOString()
    };

    userDB.create(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, tier: newUser.tier },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'VIP Patron registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login VIP Patron
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = userDB.findByEmail(email);
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim().toLowerCase(),
        passwordHash,
        memberId: `#CN-${Math.floor(1000 + Math.random() * 9000)}-CH`,
        tier: 'PATRON TIER',
        vaultItems: [],
        createdAt: new Date().toISOString()
      };
      userDB.create(newUser);
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, tier: newUser.tier },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      const { passwordHash: _, ...safeUser } = newUser;
      return res.json({ message: 'Patron session established', token, user: safeUser });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, tier: user.tier },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Authentication successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get Current User Profile & Timepiece Vault
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = userDB.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Patron profile not found' });
  }
  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// --- ORDERS & CHECKOUT ---

// Create Order (Requires Authenticated Patron)
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, subtotal, discount, total, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one timepiece' });
    }

    const orderRef = `CH-${Math.floor(100000 + Math.random() * 900000)}`;
    const certificateNumber = `GENEVA-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderRef,
      certificateNumber,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      items,
      subtotal: subtotal || total,
      discount: discount || 0,
      total,
      shippingAddress: shippingAddress || 'VIP Geneva Courier Direct',
      status: 'CONFIRMED · DISPATCH QUEUE',
      createdAt: new Date().toISOString()
    };

    orderDB.create(newOrder);

    // Register all purchased timepieces into the user's personal vault!
    items.forEach(item => {
      userDB.addWatchToVault(req.user.id, {
        id: `vault_${Date.now()}_${item.watch.id}`,
        name: item.watch.name,
        serialNumber: `CN-8800-${Math.floor(100 + Math.random() * 899)} / 500`,
        warrantyExpiry: 'October 2031',
        certificateNumber,
        certifiedChronometer: true,
        acquiredAt: new Date().toISOString().split('T')[0]
      });
    });

    const updatedUser = userDB.findById(req.user.id);
    const { passwordHash: _, ...safeUser } = updatedUser;

    res.status(201).json({
      message: 'Timepiece acquisition confirmed and registered',
      order: newOrder,
      user: safeUser
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process luxury acquisition' });
  }
});

// Get User's Orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const orders = orderDB.findByUser(req.user.id);
  res.json({ orders });
});

// --- NEWSLETTER ---
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }
  const subscriber = subscriberDB.add(email);
  res.json({ message: 'Welcome to the Chronova Circle', subscriber });
});

// --- CONCIERGE SALON MESSAGING ---
app.get('/api/concierge', authenticateToken, (req, res) => {
  const messages = conciergeDB.getByUser(req.user.id);
  res.json({ messages });
});

app.post('/api/concierge', authenticateToken, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const userMsg = {
    id: `msg_${Date.now()}`,
    userId: req.user.id,
    sender: 'user',
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  conciergeDB.addMessage(userMsg);

  setTimeout(() => {
    const conciergeMsg = {
      id: `msg_${Date.now() + 1}`,
      userId: req.user.id,
      sender: 'concierge',
      text: `Thank you, ${req.user.name}. A Senior Horology Consultant from our Rue du Rhône salon has logged your inquiry and will follow up directly.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    conciergeDB.addMessage(conciergeMsg);
  }, 1200);

  res.status(201).json({ message: userMsg });
});

// --- ADMIN SALON DASHBOARD ENDPOINT ---
app.get('/api/admin/overview', (req, res) => {
  const rawUsers = userDB.getAll();
  const safeUsers = rawUsers.map(({ passwordHash, ...safe }) => safe);
  const orders = orderDB.getAll();
  const subscribers = subscriberDB.getAll();
  const conciergeMessages = conciergeDB.getAll();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalWatchesSold = orders.reduce((sum, o) => sum + (o.items?.reduce((isum, i) => isum + i.quantity, 0) || 0), 0);

  res.json({
    metrics: {
      totalPatrons: safeUsers.length,
      totalOrders: orders.length,
      totalRevenue,
      totalWatchesSold,
      totalSubscribers: subscribers.length
    },
    users: safeUsers,
    orders,
    subscribers,
    conciergeMessages
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` 💎 CHRONOVA Haute Horlogerie Backend Active`);
  console.log(` 🌐 Server URL: http://localhost:${PORT}`);
  console.log(` 🔒 Security: Helmet, CORS, Rate-Limiting, Bcrypt, JWT`);
  console.log(` 📊 Admin Salon API: http://localhost:${PORT}/api/admin/overview`);
  console.log(`==================================================\n`);
});
