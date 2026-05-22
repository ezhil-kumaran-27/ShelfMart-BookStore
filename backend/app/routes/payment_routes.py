from flask import Blueprint
from app.controllers.payment_controller import create_payment_order, verify_payment

payment_routes_bp = Blueprint('payment_routes', __name__)

payment_routes_bp.route('/create-order', methods=['POST'])(create_payment_order)
payment_routes_bp.route('/verify', methods=['POST'])(verify_payment)
