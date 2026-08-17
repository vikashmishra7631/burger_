import { Router } from 'express';
import { db } from '../db.js';

const router = Router();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bistro2026';

// Middleware to extract authentic authenticated user
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authentication token required' });
  }

  const user = db.getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
  }

  req.user = user;
  next();
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const result = db.registerUser({ name, email, password, phone, address });
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Bistro & Stack.',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const result = db.loginUser({ email, password });
    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me - Check current session
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  const user = db.getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Session expired' });
  }

  return res.json({
    success: true,
    user
  });
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updated = db.updateUserProfile(req.user.userId, { name, phone, address });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/admin-login - Authentic Store Manager PIN / Password
router.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, error: 'Admin passcode is required.' });
  }

  if (password.trim() === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Admin authorization granted.',
      adminToken: 'adm_' + Buffer.from(`admin_${Date.now()}`).toString('base64'),
      role: 'admin'
    });
  } else {
    return res.status(403).json({
      success: false,
      error: 'Invalid admin passcode. Access denied.'
    });
  }
});

export default router;
