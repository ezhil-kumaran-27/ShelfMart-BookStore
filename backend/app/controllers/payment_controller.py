from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from app.models.payment_model import Payment
from app.models.order_model import Order
from app.extensions import db

@jwt_required()
def create_payment_order():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    order_id = data.get('order_id')
    
    order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    # MOCK RAZORPAY ORDER CREATION
    mock_razorpay_order_id = f"order_{uuid.uuid4().hex[:14]}"
    
    payment = Payment(
        user_id=current_user_id,
        order_id=order.id,
        razorpay_order_id=mock_razorpay_order_id
    )
    db.session.add(payment)
    db.session.commit()
    
    return jsonify({
        'message': 'Payment order created',
        'razorpay_order_id': mock_razorpay_order_id,
        'amount': order.total_amount * 100, # In paise
        'currency': 'INR'
    }), 200

@jwt_required()
def verify_payment():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id') # e.g., mock_payment_id
    
    payment = Payment.query.filter_by(razorpay_order_id=razorpay_order_id).first()
    if not payment:
        return jsonify({'message': 'Payment not found'}), 404
        
    # MOCK PAYMENT VERIFICATION
    payment.razorpay_payment_id = razorpay_payment_id
    payment.status = 'successful'
    
    # Update order status
    order = Order.query.get(payment.order_id)
    if order:
        order.payment_status = 'paid'
        
    db.session.commit()
    
    return jsonify({'message': 'Payment verified successfully'}), 200
