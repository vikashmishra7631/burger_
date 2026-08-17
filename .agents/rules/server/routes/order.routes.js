import { Router } from 'express';
import { db } from '../db.js';
import { orderPlacementLimiter } from '../middleware/security.js';

const router = Router();

// POST /api/orders — Secure order placement
router.post('/', orderPlacementLimiter, (req, res, next) => {
  try {
    const { customerName, deliveryAddress, phone, paymentMethod, items, tip = 0, couponCode, userId } = req.body;

    // Optional auth token verification to associate order
    let authenticatedUserId = userId || null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        authenticatedUserId = authUser.userId;
      }
    }

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
      userId: authenticatedUserId,
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

// GET /api/orders — List recent orders
router.get('/', (req, res, next) => {
  try {
    const recent = db.getRecentOrders(50);
    return res.json({
      success: true,
      count: recent.length,
      data: recent
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/my-orders — Fetch orders for logged-in user or by phone/email
// IMPORTANT: Must be declared BEFORE /:orderId wildcard routes to prevent Express
// from matching the literal string "my-orders" as an orderId parameter.
router.get('/my-orders', (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const { email, phone, userId } = req.query;
    let identifier = userId || email || phone;

    if (authHeader) {
      const authUser = db.getUserByToken(authHeader);
      if (authUser) {
        identifier = authUser.userId;
      }
    }

    if (!identifier) {
      return res.json({ success: true, data: [] });
    }

    const userOrders = db.getUserOrders(identifier);
    return res.json({
      success: true,
      count: userOrders.length,
      data: userOrders
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:orderId/track — Live order status tracking synchronized with Admin actions
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

    const status = (order.status || 'RECEIVED').toUpperCase();
    let stage = 1;
    let statusTitle = 'Order Received & Queued';
    let statusDesc = 'Kitchen has accepted your order';
    let etaMinutes = 22;
    let courierLocation = 'At Kitchen';
    let courierPositionPercent = 15; // percentage on delivery track

    if (status === 'PREPARING') {
      stage = 2;
      statusTitle = 'On the Charcoal Grill & Wood-Fired Oven';
      statusDesc = 'Chefs are searing and baking your meal';
      etaMinutes = 14;
      courierLocation = 'Waiting at Kitchen';
      courierPositionPercent = 40;
    } else if (status === 'IN_TRANSIT') {
      stage = 3;
      statusTitle = 'Courier En Route with Thermal Carrier';
      statusDesc = 'Marcus B. (Express E-Bike) is delivering to your address';
      etaMinutes = 6;
      courierLocation = '0.3 miles away (Arriving Soon)';
      courierPositionPercent = 70;
    } else if (status === 'DELIVERED') {
      stage = 4;
      statusTitle = 'Delivered Fresh & Hot! 🎉';
      statusDesc = 'Arrived at your doorstep! Enjoy your meal!';
      etaMinutes = 0;
      courierLocation = 'At Your Doorstep';
      courierPositionPercent = 90;
    }

    return res.json({
      success: true,
      data: {
        orderId: order.orderId,
        createdAt: order.createdAt,
        status: order.status,
        currentStage: stage,
        stageTitle: statusTitle,
        stageDescription: statusDesc,
        etaMinutes,
        customer: order.customer,
        items: order.items,
        pricing: order.pricing,
        courier: {
          name: order.courier?.name || 'Marcus B.',
          vehicle: 'Express E-Bike',
          currentLocation: courierLocation,
          positionPercent: courierPositionPercent
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:orderId/status — Update order state from Admin dashboard
router.patch('/:orderId/status', (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['RECEIVED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = db.updateOrderStatus(orderId, status.toUpperCase());
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Order with ID "${orderId}" was not found.`
      });
    }

    return res.json({
      success: true,
      message: `Order #${orderId} status updated to ${status.toUpperCase()}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

export default router;
