from flask import Blueprint, request, jsonify
from ..db import get_menu_items

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/', methods=['GET'], strict_slashes=False)
@menu_bp.route('', methods=['GET'], strict_slashes=False)
def get_menu():
    try:
        mode = request.args.get('mode', 'burger')
        category = request.args.get('category')
        diet = request.args.get('diet')
        search = request.args.get('search')
        sort = request.args.get('sort', 'popular')

        clean_mode = 'pizza' if mode == 'pizza' else 'burger'
        items = get_menu_items(clean_mode, {
            'category': category,
            'diet': diet,
            'search': search,
            'sort': sort
        })

        return jsonify({
            'success': True,
            'mode': clean_mode,
            'count': len(items),
            'data': items
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
