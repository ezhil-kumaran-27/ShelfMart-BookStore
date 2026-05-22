from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.order_model import Order
from app.models.book_model import Book
from app.models.payment_model import Payment
from app.extensions import db

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@admin_required
def get_admin_stats():
    total_users = User.query.count()
    total_orders = Order.query.count()
    total_books = Book.query.count()
    
    # Calculate total revenue
    orders = Order.query.all()
    total_revenue = sum(order.total_amount for order in orders if order.payment_status in ['paid', 'pending'])
    
    return jsonify({
        'users': total_users,
        'orders': total_orders,
        'books': total_books,
        'revenue': total_revenue
    }), 200

@admin_required
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    
    orders_data = []
    for order in orders:
        order_dict = order.to_dict()
        user = User.query.get(order.user_id)
        order_dict['user'] = user.to_dict() if user else None
        orders_data.append(order_dict)
        
    return jsonify({'orders': orders_data}), 200

@admin_required
def update_order_status(order_id):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['processing', 'shipped', 'delivered', 'cancelled']:
        return jsonify({'message': 'Invalid status'}), 400
        
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    order.order_status = new_status
    db.session.commit()
    
    return jsonify({'message': f'Order status updated to {new_status}', 'order': order.to_dict()}), 200
