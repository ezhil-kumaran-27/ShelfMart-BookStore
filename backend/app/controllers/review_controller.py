from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.review_model import Review
from app.models.book_model import Book
from app.extensions import db

def get_book_reviews(book_id):
    try:
        reviews = Review.query.filter_by(book_id=book_id).order_by(Review.created_at.desc()).all()
        return jsonify([review.to_dict() for review in reviews]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jwt_required()
def add_review(book_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        rating = data.get('rating')
        comment = data.get('comment', '')
        
        if not rating:
            return jsonify({'error': 'Rating is required'}), 400
            
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404
            
        # Check if user already reviewed this book
        existing_review = Review.query.filter_by(user_id=current_user_id, book_id=book_id).first()
        if existing_review:
            return jsonify({'error': 'You have already reviewed this book'}), 400
            
        new_review = Review(
            user_id=current_user_id,
            book_id=book_id,
            rating=float(rating),
            comment=comment
        )
        
        db.session.add(new_review)
        
        # Update book average rating
        all_reviews = Review.query.filter_by(book_id=book_id).all()
        # Including the new review in average calculation
        total_rating = sum(r.rating for r in all_reviews) + float(rating)
        book.rating = total_rating / (len(all_reviews) + 1)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Review added successfully',
            'review': new_review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
