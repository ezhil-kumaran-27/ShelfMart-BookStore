from flask import Blueprint
from app.controllers.cart_controller import get_user_cart, add_to_cart, remove_from_cart, update_cart_quantity

cart_routes_bp = Blueprint('cart_routes', __name__)

cart_routes_bp.route('/', methods=['GET'], strict_slashes=False)(get_user_cart)
cart_routes_bp.route('/', methods=['POST'], strict_slashes=False)(add_to_cart)
cart_routes_bp.route('/<int:item_id>', methods=['DELETE'])(remove_from_cart)
cart_routes_bp.route('/<int:item_id>', methods=['PUT'])(update_cart_quantity)
