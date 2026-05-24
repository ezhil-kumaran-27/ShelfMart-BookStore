from app import create_app
from app.extensions import db
from app.models.user_model import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Check if admin already exists
    admin = User.query.filter_by(email='admin@shelfmart.com').first()
    
    if not admin:
        hashed_password = generate_password_hash('admin123')
        new_admin = User(
            username='admin',
            email='admin@shelfmart.com',
            password_hash=hashed_password,
            role='admin'
        )
        db.session.add(new_admin)
        db.session.commit()
        print("Successfully created Admin user!")
        print("Email: admin@shelfmart.com")
        print("Password: admin123")
    else:
        print("Admin user already exists in the database.")
