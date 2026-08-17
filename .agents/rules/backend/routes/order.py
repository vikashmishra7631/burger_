from flask import Blueprint, request, jsonify
from ..db import (
    create_order,
    get_recent_orders,
    get_order_by_id,
    update_order_status,
    get_user_orders,
    get_user_by_token,
    get_coupon
)
from ..middleware.security import get_sanitized_json

order_bp = Blueprint('orders', __name__)

@order_bp.route('', methods=['POST'], strict_slashes=False)
def place_order():
    try:
        body = get_sanitized_json()
        customer_name = body.get('customerName')
        delivery_address = body.get('deliveryAddress')
        phone = body.get('phone')
        payment_method = body.get('paymentMethod', 'card')
        items = body.get('items')
        tip = body.get('tip', 0)
        coupon_code = body.get('couponCode')
        user_id = body.get('userId')

        # Optional token verification
        authenticated_user_id = user_id or None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_user = get_user_by_token(auth_header)
            if auth_user:
                authenticated_user_id = auth_user.get('userId')

        # Strict validation
        if not customer_name or len(str(customer_name).strip()) < 2:
            return jsonify({'success': False, 'error': 'Valid customer name is required.'}), 400
        if not delivery_address or len(str(delivery_address).strip()) < 5:
            return jsonify({'success': False, 'error': 'Valid delivery address is required.'}), 400
        if not phone or len(str(phone).strip()) < 7:
            return jsonify({'success': False, 'error': 'Valid contact phone number is required.'}), 400
        if not isinstance(items, list) or len(items) == 0:
            return jsonify({'success': False, 'error': 'Order must contain at least 1 item.'}), 400

        # Verify and compute pricing server-side
        calculated_subtotal = 0.0
        sanitized_items = []
        for idx, item in enumerate(items):
            try:
                qty = max(1, int(item.get('qty', 1)))
            except (ValueError, TypeError):
                qty = 1
            try:
                price = max(0.0, float(item.get('price', 0.0)))
            except (ValueError, TypeError):
                price = 0.0

            calculated_subtotal += price * qty
            sanitized_items.append({
                'id': item.get('id', f'item_{idx + 1}'),
                'name': item.get('name', 'Artisan Dish'),
                'price': price,
                'qty': qty,
                'notes': item.get('notes', '')
            })

        # Discount calculation
        discount = 0.0
        if coupon_code:
            valid_coupon = get_coupon(coupon_code)
            if valid_coupon:
                min_order = valid_coupon.get('minOrder', 0)
                if not min_order or calculated_subtotal >= min_order:
                    discount = (calculated_subtotal * valid_coupon.get('discountPercent', 0)) / 100.0

        delivery_fee = 0.0 if calculated_subtotal >= 30.0 else 2.99
        taxable_amount = max(0.0, calculated_subtotal - discount)
        tax = round(taxable_amount * 0.08, 2)
        try:
            tip_amount = max(0.0, float(tip))
        except (ValueError, TypeError):
            tip_amount = 0.0

        grand_total = round(taxable_amount + delivery_fee + tax + tip_amount, 2)

        created = create_order({
            'userId': authenticated_user_id,
            'customerName': customer_name,
            'deliveryAddress': delivery_address,
            'phone': phone,
            'paymentMethod': payment_method,
            'items': sanitized_items,
            'subtotal': round(calculated_subtotal, 2),
            'discount': round(discount, 2),
            'deliveryFee': delivery_fee,
            'tax': tax,
            'tip': tip_amount,
            'grandTotal': grand_total
        })

        return jsonify({
            'success': True,
            'message': 'Order created successfully and queued in the kitchen!',
            'data': created
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@order_bp.route('', methods=['GET'], strict_slashes=False)
def list_orders():
    try:
        recent = get_recent_orders(50)
        return jsonify({
            'success': True,
            'count': len(recent),
            'data': recent
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@order_bp.route('/my-orders', methods=['GET'])
def my_orders():
    try:
        auth_header = request.headers.get('Authorization')
        email = request.args.get('email')
        phone = request.args.get('phone')
        user_id = request.args.get('userId')
        identifier = user_id or email or phone

        if auth_header:
            auth_user = get_user_by_token(auth_header)
            if auth_user:
                identifier = auth_user.get('userId')

        if not identifier:
            return jsonify({'success': True, 'data': []}), 200

        user_order_list = get_user_orders(identifier)
        return jsonify({
            'success': True,
            'count': len(user_order_list),
            'data': user_order_list
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@order_bp.route('/<order_id>/track', methods=['GET'])
def track_order(order_id):
    try:
        order = get_order_by_id(order_id)
        if not order:
            return jsonify({
                'success': False,
                'error': f'Order with ID "{order_id}" was not found.'
            }), 404

        status = (order.get('status') or 'RECEIVED').upper()
        stage = 1
        status_title = 'Order Received & Queued'
        status_desc = 'Kitchen has accepted your order'
        eta_minutes = 22
        courier_location = 'At Kitchen'
        courier_position_percent = 15

        if status == 'PREPARING':
            stage = 2
            status_title = 'On the Charcoal Grill & Wood-Fired Oven'
            status_desc = 'Chefs are searing and baking your meal'
            eta_minutes = 14
            courier_location = 'Waiting at Kitchen'
            courier_position_percent = 40
        elif status == 'IN_TRANSIT':
            stage = 3
            status_title = 'Courier En Route with Thermal Carrier'
            status_desc = 'Marcus B. (Express E-Bike) is delivering to your address'
            eta_minutes = 6
            courier_location = '0.3 miles away (Arriving Soon)'
            courier_position_percent = 70
        elif status == 'DELIVERED':
            stage = 4
            status_title = 'Delivered Fresh & Hot! 🎉'
            status_desc = 'Arrived at your doorstep! Enjoy your meal!'
            eta_minutes = 0
            courier_location = 'At Your Doorstep'
            courier_position_percent = 90

        return jsonify({
            'success': True,
            'data': {
                'orderId': order.get('orderId'),
                'createdAt': order.get('createdAt'),
                'status': order.get('status'),
                'currentStage': stage,
                'stageTitle': status_title,
                'stageDescription': status_desc,
                'etaMinutes': eta_minutes,
                'customer': order.get('customer'),
                'items': order.get('items'),
                'pricing': order.get('pricing'),
                'courier': {
                    'name': (order.get('courier') or {}).get('name', 'Marcus B.'),
                    'vehicle': 'Express E-Bike',
                    'currentLocation': courier_location,
                    'positionPercent': courier_position_percent
                }
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@order_bp.route('/<order_id>/status', methods=['PATCH'])
def update_status(order_id):
    try:
        body = request.get_json(silent=True) or {}
        status = body.get('status')

        valid_statuses = ['RECEIVED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']
        if not status or status.upper() not in valid_statuses:
            return jsonify({
                'success': False,
                'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }), 400

        updated = update_order_status(order_id, status.upper())
        if not updated:
            return jsonify({
                'success': False,
                'error': f'Order with ID "{order_id}" was not found.'
            }), 404

        return jsonify({
            'success': True,
            'message': f'Order #{order_id} status updated to {status.upper()}',
            'data': updated
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
