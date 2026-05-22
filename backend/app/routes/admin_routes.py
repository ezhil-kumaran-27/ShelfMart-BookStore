from flask import Blueprint
from app.controllers.admin_controller import get_admin_stats, get_all_orders, update_order_status

admin_routes_bp = Blueprint('admin_routes', __name__)

admin_routes_bp.route('/stats', methods=['GET'], strict_slashes=False)(get_admin_stats)
admin_routes_bp.route('/orders', methods=['GET'], strict_slashes=False)(get_all_orders)
admin_routes_bp.route('/orders/<int:order_id>/status', methods=['PUT'], strict_slashes=False)(update_order_status)
