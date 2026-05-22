from flask import Blueprint
from app.controllers.auth_controller import register_user, login_user, get_user_profile

auth_routes_bp = Blueprint('auth_routes', __name__)

auth_routes_bp.route('/register', methods=['POST'])(register_user)
auth_routes_bp.route('/login', methods=['POST'])(login_user)
auth_routes_bp.route('/profile', methods=['GET'])(get_user_profile)
