from flask import Blueprint
from app.controllers.order_controller import place_order, get_order_history, cancel_order

order_routes_bp = Blueprint('order_routes', __name__)

order_routes_bp.route('/', methods=['POST'], strict_slashes=False)(place_order)
order_routes_bp.route('/', methods=['GET'], strict_slashes=False)(get_order_history)
order_routes_bp.route('/<int:order_id>/cancel', methods=['PUT'])(cancel_order)
