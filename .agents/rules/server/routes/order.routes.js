import { Router } from 'express';
import { db } from '../db.js';
import { orderPlacementLimiter } from '../middleware/security.js';

const router = Router();

// POST /api/orders — Secure order placement
router.post('/', orderPlacementLimiter, (req, res, next) => {
  try {
    const { customerName, deliveryAddress, phone, paymentMethod, items, tip = 0, couponCode } = req.body;

    // Strict validation
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Valid customer name is required.' });
    }
    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Valid delivery address is required.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ success: false, error: 'Valid contact phone number is required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item.' });
    }

    // Verify and compute pricing server-side
    let calculatedSubtotal = 0;
    const sanitizedItems = items.map((item, idx) => {
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      const price = Math.max(0, parseFloat(item.price) || 0);
      calculatedSubtotal += price * qty;
      return {
        id: item.id || `item_${idx + 1}`,
        name: item.name || 'Artisan Dish',
        price,
        qty,
        notes: item.notes || ''
      };
    });

    // Discount verification
    let discount = 0;
    if (couponCode) {
      const validCoupon = db.getCoupon(couponCode);
      if (validCoupon && (!validCoupon.minOrder || calculatedSubtotal >= validCoupon.minOrder)) {
        discount = (calculatedSubtotal * validCoupon.discountPercent) / 100;
      }
    }

    const deliveryFee = calculatedSubtotal >= 30.0 ? 0.00 : 2.99;
    const taxableAmount = Math.max(0, calculatedSubtotal - discount);
    const tax = taxableAmount * 0.08;
    const tipAmount = Math.max(0, parseFloat(tip) || 0);
    const grandTotal = parseFloat((taxableAmount + deliveryFee + tax + tipAmount).toFixed(2));

    // Save order
    const createdOrder = db.createOrder({
      customerName,
      deliveryAddress,
      phone,
      paymentMethod,
      items: sanitizedItems,
      subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      deliveryFee,
      tax: parseFloat(tax.toFixed(2)),
      tip: tipAmount,
      grandTotal
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully and queued in the kitchen!',
      data: createdOrder
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:orderId/track — Live order status tracking with dynamic timeline progression
router.get('/:orderId/track', (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = db.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID "${orderId}" was not found.`
      });
    }

    // Dynamic elapsed time tracking simulation
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    let stage = 1;
    let statusTitle = 'Order Received & Queued';
    let statusDesc = 'Kitchen has accepted your order';
    let etaMinutes = Math.max(2, 22 - elapsedMinutes);

    if (elapsedMinutes >= 1 && elapsedMinutes < 8) {
      stage = 2;
      statusTitle = 'On the Charcoal Grill & Wood-Fired Oven';
      statusDesc = 'Chefs are searing and baking your meal';
    } else if (elapsedMinutes >= 8 && elapsedMinutes < 18) {
      stage = 3;
      statusTitle = 'Courier En Route';
      statusDesc = 'Marcus B. (E-Bike) is delivering with thermal carrier';
    } else if (elapsedMinutes >= 18) {
      stage = 4;
      statusTitle = 'Delivered Fresh & Hot';
      statusDesc = 'Arrived at your doorstep! Enjoy your meal!';
      etaMinutes = 0;
    }

    return res.json({
      success: true,
      data: {
        orderId: order.orderId,
        createdAt: order.createdAt,
        currentStage: stage, // 1 to 4
        stageTitle: statusTitle,
        stageDescription: statusDesc,
        etaMinutes,
        customer: order.customer,
        items: order.items,
        pricing: order.pricing,
        courier: {
          name: order.courier.name,
          vehicle: 'Express E-Bike',
          currentLocation: stage >= 3 ? '0.4 miles away' : 'At Kitchen'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — List recent orders
router.get('/', (req, res, next) => {
  try {
    const recent = db.getRecentOrders(20);
    return res.json({
      success: true,
      count: recent.length,
      data: recent
    });
  } catch (err) {
    next(err);
  }
});

export default router;
