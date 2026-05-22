from flask import Blueprint
from app.controllers.review_controller import get_book_reviews, add_review

review_routes_bp = Blueprint('review_routes', __name__)

review_routes_bp.route('/<int:book_id>', methods=['GET'])(get_book_reviews)
review_routes_bp.route('/<int:book_id>', methods=['POST'])(add_review)
