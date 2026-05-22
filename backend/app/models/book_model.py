from app.extensions import db
from datetime import datetime

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=1)
    condition = db.Column(db.String(50), default='new') # 'new' or 'old'
    image_url = db.Column(db.String(500))
    rating = db.Column(db.Float, default=0.0)
    tagline = db.Column(db.String(255))
    published_year = db.Column(db.Integer)
    theme_color = db.Column(db.String(50))
    image_prompt = db.Column(db.Text)
    
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # null for new books sold by store
    is_approved = db.Column(db.Boolean, default=True) # for old books
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    cart_items = db.relationship('Cart', backref='book', lazy=True, cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='book', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='book', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'category': self.category,
            'price': self.price,
            'stock': self.stock,
            'condition': self.condition,
            'image_url': self.image_url,
            'rating': self.rating,
            'tagline': self.tagline,
            'published_year': self.published_year,
            'theme_color': self.theme_color,
            'seller_id': self.seller_id,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat()
        }
