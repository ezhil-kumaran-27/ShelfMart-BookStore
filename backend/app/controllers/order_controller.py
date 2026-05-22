from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order_model import Order, OrderItem
from app.models.cart_model import Cart
from app.models.book_model import Book
from app.extensions import db

@jwt_required()
def place_order():
    current_user_id = int(get_jwt_identity())
    
    # Get user's cart
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    if not cart_items:
        return jsonify({'message': 'Cart is empty'}), 400
        
    total_amount = 0
    order_items = []
    
    for item in cart_items:
        book = item.book
        if book.stock < item.quantity:
            return jsonify({'message': f'Not enough stock for book: {book.title}'}), 400
            
        total_amount += book.price * item.quantity
        order_item = OrderItem(book_id=book.id, quantity=item.quantity, price=book.price)
        order_items.append(order_item)
        
        # Deduct stock
        book.stock -= item.quantity
        
    # Create order
    new_order = Order(user_id=current_user_id, total_amount=total_amount)
    db.session.add(new_order)
    db.session.flush() # To get order ID
    
    for order_item in order_items:
        order_item.order_id = new_order.id
        db.session.add(order_item)
        
    # Clear cart
    Cart.query.filter_by(user_id=current_user_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Order placed successfully', 'order': new_order.to_dict()}), 201

@jwt_required()
def get_order_history():
    current_user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=current_user_id).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [order.to_dict() for order in orders]}), 200

@jwt_required()
def cancel_order(order_id):
    current_user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
    
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    if order.order_status not in ['processing']:
        return jsonify({'message': 'Order cannot be cancelled'}), 400
        
    # Restore stock
    for item in order.items:
        book = Book.query.get(item.book_id)
        if book:
            book.stock += item.quantity
            
    order.order_status = 'cancelled'
    db.session.commit()
    return jsonify({'message': 'Order cancelled successfully'}), 200
