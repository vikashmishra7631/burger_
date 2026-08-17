import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/menu?mode=burger|pizza&category=...&diet=...&search=...&sort=...
router.get('/', (req, res, next) => {
  try {
    const { mode = 'burger', category, diet, search, sort } = req.query;
    
    // Validate food mode
    const cleanMode = mode === 'pizza' ? 'pizza' : 'burger';

    const items = db.getMenuItems(cleanMode, { category, diet, search, sort });
    
    return res.json({
      success: true,
      mode: cleanMode,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

export default router;
