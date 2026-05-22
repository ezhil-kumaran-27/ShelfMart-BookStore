from app.extensions import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    razorpay_payment_id = db.Column(db.String(255))
    razorpay_order_id = db.Column(db.String(255))
    status = db.Column(db.String(50), default='created') # 'created', 'successful', 'failed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_id': self.order_id,
            'razorpay_payment_id': self.razorpay_payment_id,
            'razorpay_order_id': self.razorpay_order_id,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
