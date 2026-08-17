from flask import Blueprint, request, jsonify
from ..db import get_coupon
from ..middleware.security import get_sanitized_json

coupon_bp = Blueprint('coupons', __name__)

@coupon_bp.route('/validate', methods=['POST'], strict_slashes=False)
def validate_coupon():
    try:
        body = get_sanitized_json()
        code = body.get('code')
        subtotal = body.get('subtotal', 0)

        if not code:
            return jsonify({
                'success': False,
                'error': 'Coupon promo code is required.'
            }), 400

        coupon = get_coupon(code)
        if not coupon:
            return jsonify({
                'success': False,
                'error': f'Promo code "{code.upper()}" is invalid or expired.'
            }), 404

        try:
            num_subtotal = float(subtotal)
        except (ValueError, TypeError):
            num_subtotal = 0.0

        min_order = coupon.get('minOrder', 0)
        if min_order and num_subtotal < min_order:
            return jsonify({
                'success': False,
                'error': f'Coupon "{coupon["code"]}" requires a minimum order of ${min_order:.2f}.'
            }), 400

        discount_percent = coupon.get('discountPercent', 0)
        discount_amount = round((num_subtotal * discount_percent) / 100.0, 2)

        return jsonify({
            'success': True,
            'data': {
                'code': coupon['code'],
                'discountPercent': discount_percent,
                'discountAmount': discount_amount,
                'description': coupon.get('description', '')
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
