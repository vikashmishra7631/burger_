import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Coupon promo code is required.'
      });
    }

    const coupon = db.getCoupon(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: `Promo code "${code.toUpperCase()}" is invalid or expired.`
      });
    }

    const numSubtotal = Number(subtotal) || 0;
    if (coupon.minOrder && numSubtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        error: `Coupon "${coupon.code}" requires a minimum order of $${coupon.minOrder.toFixed(2)}.`
      });
    }

    const discountAmount = Number(((numSubtotal * coupon.discountPercent) / 100).toFixed(2));

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        description: coupon.description
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
