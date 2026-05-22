from flask import Blueprint
from app.controllers.book_controller import get_all_books, get_single_book, add_book, search_books, upload_book_image

book_routes_bp = Blueprint('book_routes', __name__)

book_routes_bp.route('/', methods=['GET'], strict_slashes=False)(get_all_books)
book_routes_bp.route('/<int:book_id>', methods=['GET'], strict_slashes=False)(get_single_book)
book_routes_bp.route('/', methods=['POST'], strict_slashes=False)(add_book)
book_routes_bp.route('/search', methods=['GET'], strict_slashes=False)(search_books)
book_routes_bp.route('/upload-image', methods=['POST'], strict_slashes=False)(upload_book_image)
