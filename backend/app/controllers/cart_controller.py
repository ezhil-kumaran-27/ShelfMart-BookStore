from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.cart_model import Cart
from app.models.book_model import Book
from app.extensions import db

@jwt_required()
def get_user_cart():
    current_user_id = int(get_jwt_identity())
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    return jsonify({'cart': [item.to_dict() for item in cart_items]}), 200

@jwt_required()
def add_to_cart():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    book_id = data.get('book_id')
    quantity = data.get('quantity', 1)
    
    if not book_id:
        return jsonify({'message': 'Book ID is required'}), 400
        
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
        
    # Check if item already in cart
    existing_item = Cart.query.filter_by(user_id=current_user_id, book_id=book_id).first()
    
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = Cart(user_id=current_user_id, book_id=book_id, quantity=quantity)
        db.session.add(new_item)
        
    db.session.commit()
    return jsonify({'message': 'Added to cart successfully'}), 200

@jwt_required()
def remove_from_cart(item_id):
    current_user_id = int(get_jwt_identity())
    item = Cart.query.filter_by(id=item_id, user_id=current_user_id).first()
    
    if not item:
        return jsonify({'message': 'Item not found in cart'}), 404
        
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Removed from cart'}), 200

@jwt_required()
def update_cart_quantity(item_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    quantity = data.get('quantity')
    
    if not quantity or quantity < 1:
        return jsonify({'message': 'Invalid quantity'}), 400
        
    item = Cart.query.filter_by(id=item_id, user_id=current_user_id).first()
    
    if not item:
        return jsonify({'message': 'Item not found in cart'}), 404
        
    item.quantity = quantity
    db.session.commit()
    return jsonify({'message': 'Quantity updated'}), 200
