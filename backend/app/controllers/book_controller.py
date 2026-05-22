from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book_model import Book
from app.models.user_model import User
from app.extensions import db

def get_all_books():
    books = Book.query.filter_by(is_approved=True).all()
    return jsonify({'books': [book.to_dict() for book in books]}), 200

def get_single_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    return jsonify({'book': book.to_dict()}), 200

@jwt_required()
def add_book():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    # If user is not admin, they are selling an old book
    is_admin = user.role == 'admin'
    condition = 'new' if is_admin else 'old'
    is_approved = True if is_admin else False
    
    new_book = Book(
        title=data.get('title'),
        author=data.get('author'),
        description=data.get('description'),
        category=data.get('category'),
        price=data.get('price'),
        stock=data.get('stock', 1),
        condition=condition,
        image_url=data.get('image_url'),
        seller_id=current_user_id if not is_admin else None,
        is_approved=is_approved
    )
    
    db.session.add(new_book)
    db.session.commit()
    
    message = 'Book added successfully' if is_admin else 'Book submitted for approval'
    return jsonify({'message': message, 'book': new_book.to_dict()}), 201

def search_books():
    query = request.args.get('q', '')
    category = request.args.get('category')
    condition = request.args.get('condition')
    
    books_query = Book.query.filter_by(is_approved=True)
    
    if query:
        books_query = books_query.filter(Book.title.ilike(f'%{query}%') | Book.author.ilike(f'%{query}%'))
    if category:
        books_query = books_query.filter_by(category=category)
    if condition:
        books_query = books_query.filter_by(condition=condition)
        
    books = books_query.all()
    return jsonify({'books': [book.to_dict() for book in books]}), 200

@jwt_required()
def upload_book_image():
    # Mock Cloudinary Upload
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    # In a real scenario, we'd upload to Cloudinary here
    # Mock URL
    mock_url = f"https://mock-cloudinary.com/shelfmart/{file.filename}"
    
    return jsonify({'message': 'Image uploaded successfully', 'image_url': mock_url}), 200
