from flask import Flask
from app.config.settings import Config
from app.extensions import db, jwt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Flask extensions here
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints here
    from app.routes.auth_routes import auth_routes_bp as auth_bp
    from app.routes.book_routes import book_routes_bp as book_bp
    from app.routes.cart_routes import cart_routes_bp as cart_bp
    from app.routes.order_routes import order_routes_bp as order_bp
    from app.routes.payment_routes import payment_routes_bp as payment_bp
    from app.routes.review_routes import review_routes_bp as review_bp
    from app.routes.admin_routes import admin_routes_bp as admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(book_bp, url_prefix='/api/books')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Create database tables
    with app.app_context():
        # Import models so they are registered with SQLAlchemy
        from app.models.user_model import User
        from app.models.book_model import Book
        from app.models.cart_model import Cart
        from app.models.order_model import Order, OrderItem
        from app.models.payment_model import Payment
        from app.models.review_model import Review
        
        db.create_all()
        
    return app
