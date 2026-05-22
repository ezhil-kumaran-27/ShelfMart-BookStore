import os
import sys
from datetime import datetime

# Add the backend directory to sys.path to allow importing app modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.extensions import db
from app.models.user_model import User
from app.models.book_model import Book
from app.models.review_model import Review
from werkzeug.security import generate_password_hash

sample_books = [
  # BUSINESS
  {
    "title": "Zero to One",
    "author": "Peter Thiel",
    "description": "Notes on startups, or how to build the future. A profound exploration of how to create new things and escape competition by building monopolies.",
    "category": "Business",
    "condition": "new",
    "price": 499,
    "stock": 45,
    "rating": 4.8,
    "tagline": "How to Build the Future",
    "published_year": 2014,
    "theme_color": "from-sky-600 to-blue-900",
    "image_prompt": "Minimalist premium cover, white and blue gradient, abstract startup growth chart, modern sans-serif."
  },
  {
    "title": "The Hard Thing About Hard Things",
    "author": "Ben Horowitz",
    "description": "A brutally honest look at the difficulties of running a business, sharing essential advice for navigating the toughest problems that business schools don't cover.",
    "category": "Business",
    "condition": "old",
    "price": 399,
    "stock": 20,
    "rating": 4.7,
    "tagline": "Building a Business When There Are No Easy Answers",
    "published_year": 2014,
    "theme_color": "from-stone-800 to-black",
    "image_prompt": "Dark mode cover, gritty stone texture, bold white typography, cinematic lighting."
  },
  {
    "title": "The 4-Hour Workweek",
    "author": "Tim Ferriss",
    "description": "Escape the 9-5, live anywhere, and join the new rich. A step-by-step guide to lifestyle design and extreme productivity.",
    "category": "Business",
    "condition": "new",
    "price": 550,
    "stock": 65,
    "rating": 4.5,
    "tagline": "Escape 9-5, Live Anywhere, and Join the New Rich",
    "published_year": 2007,
    "theme_color": "from-orange-400 to-amber-600",
    "image_prompt": "Tropical sunset gradient, orange and yellow, minimalist palm tree icon, bold typography."
  },

  # PRODUCTIVITY
  {
    "title": "Deep Work",
    "author": "Cal Newport",
    "description": "Rules for focused success in a distracted world. Master the ability to focus without distraction on a cognitively demanding task.",
    "category": "Productivity",
    "condition": "new",
    "price": 450,
    "stock": 120,
    "rating": 4.8,
    "tagline": "Focused Success in a Distracted World",
    "published_year": 2016,
    "theme_color": "from-yellow-400 to-yellow-600",
    "image_prompt": "Bright yellow cover, minimalist black text, abstract focus lens or target."
  },
  {
    "title": "The 7 Habits of Highly Effective People",
    "author": "Stephen R. Covey",
    "description": "A holistic, integrated, principle-centered approach for solving personal and professional problems and cultivating enduring success.",
    "category": "Productivity",
    "condition": "new",
    "price": 599,
    "stock": 200,
    "rating": 4.9,
    "tagline": "Powerful Lessons in Personal Change",
    "published_year": 1989,
    "theme_color": "from-red-700 to-rose-900",
    "image_prompt": "Deep red cover, classic serif typography, golden accents."
  },
  {
    "title": "Eat That Frog!",
    "author": "Brian Tracy",
    "description": "21 Great Ways to Stop Procrastinating and Get More Done in Less Time. Tackle your most challenging tasks first to maximize daily achievement.",
    "category": "Productivity",
    "condition": "old",
    "price": 250,
    "stock": 15,
    "rating": 4.6,
    "tagline": "Stop Procrastinating Now",
    "published_year": 2001,
    "theme_color": "from-green-500 to-emerald-700",
    "image_prompt": "Vibrant green, abstract minimalist frog icon, bold white text."
  },

  # INVESTING
  {
    "title": "The Intelligent Investor",
    "author": "Benjamin Graham",
    "description": "The definitive book on value investing. Learn how to protect yourself from substantial error and develop long-term wealth strategies.",
    "category": "Investing",
    "condition": "new",
    "price": 799,
    "stock": 80,
    "rating": 4.9,
    "tagline": "The Definitive Book on Value Investing",
    "published_year": 1949,
    "theme_color": "from-red-800 to-red-950",
    "image_prompt": "Classic deep red and white block design, traditional finance typography."
  },
  {
    "title": "Learn to Earn",
    "author": "Peter Lynch",
    "description": "A beginner's guide to the basics of investing and business. Understand how to read stock tables, analyze companies, and build a strong portfolio.",
    "category": "Investing",
    "condition": "new",
    "price": 499,
    "stock": 40,
    "rating": 4.7,
    "tagline": "A Beginner's Guide to the Basics of Investing",
    "published_year": 1995,
    "theme_color": "from-slate-100 to-slate-300",
    "image_prompt": "Light grey/white clean background, minimalist finance graph, crisp text."
  },
  {
    "title": "The Joys of Compounding",
    "author": "Gautam Baid",
    "description": "The passionate pursuit of lifelong learning. Understand how the principle of compounding applies to both investing and personal growth.",
    "category": "Investing",
    "condition": "new",
    "price": 650,
    "stock": 55,
    "rating": 4.8,
    "tagline": "The Passionate Pursuit of Lifelong Learning",
    "published_year": 2020,
    "theme_color": "from-amber-200 to-yellow-500",
    "image_prompt": "Warm golden yellow background, classic serif typography, elegant design."
  },

  # COMMUNICATION
  {
    "title": "How to Win Friends & Influence People",
    "author": "Dale Carnegie",
    "description": "Timeless advice on human relations. Learn the core principles of making friends quickly, winning people to your way of thinking, and leading effectively.",
    "category": "Communication",
    "condition": "new",
    "price": 350,
    "stock": 300,
    "rating": 4.9,
    "tagline": "The Only Book You Need to Lead You to Success",
    "published_year": 1936,
    "theme_color": "from-orange-500 to-red-600",
    "image_prompt": "Warm orange and red block layout, large vintage typography."
  },
  {
    "title": "Never Split the Difference",
    "author": "Chris Voss",
    "description": "A former international hostage negotiator for the FBI offers a new, field-tested approach to high-stakes negotiations.",
    "category": "Communication",
    "condition": "new",
    "price": 550,
    "stock": 95,
    "rating": 4.8,
    "tagline": "Negotiating As If Your Life Depended On It",
    "published_year": 2016,
    "theme_color": "from-red-600 to-red-800",
    "image_prompt": "Bold red and black design, minimalist typography, intense thriller-style lighting."
  },
  {
    "title": "Talk Like TED",
    "author": "Carmine Gallo",
    "description": "The 9 public-speaking secrets of the world's top minds. Learn how to deliver a presentation that is engaging, persuasive, and memorable.",
    "category": "Communication",
    "condition": "old",
    "price": 299,
    "stock": 25,
    "rating": 4.6,
    "tagline": "The 9 Public-Speaking Secrets of the World's Top Minds",
    "published_year": 2014,
    "theme_color": "from-white to-gray-200",
    "image_prompt": "Minimalist white background, bold red typography, elegant layout."
  },

  # TECHNOLOGY
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "description": "A Handbook of Agile Software Craftsmanship. Discover the principles, patterns, and practices of writing clean, maintainable code.",
    "category": "Technology",
    "condition": "new",
    "price": 1250,
    "stock": 50,
    "rating": 4.8,
    "tagline": "A Handbook of Agile Software Craftsmanship",
    "published_year": 2008,
    "theme_color": "from-gray-800 to-gray-900",
    "image_prompt": "Dark minimalist cover, clean crisp white and green typography."
  },
  {
    "title": "A Brief History of Time",
    "author": "Stephen Hawking",
    "description": "From the Big Bang to Black Holes. A landmark volume in science writing by one of the great minds of our time.",
    "category": "Technology",
    "condition": "new",
    "price": 499,
    "stock": 85,
    "rating": 4.7,
    "tagline": "From the Big Bang to Black Holes",
    "published_year": 1988,
    "theme_color": "from-blue-900 to-indigo-950",
    "image_prompt": "Deep space background, stars, glowing typography."
  },
  {
    "title": "The Selfish Gene",
    "author": "Richard Dawkins",
    "description": "A classic exposition of evolutionary thought. An incredible journey into the gene's-eye view of evolution and life.",
    "category": "Technology",
    "condition": "old",
    "price": 350,
    "stock": 10,
    "rating": 4.6,
    "tagline": "The classic exposition of evolutionary thought",
    "published_year": 1976,
    "theme_color": "from-sky-400 to-blue-500",
    "image_prompt": "Vibrant sky blue background, abstract DNA double helix pattern."
  }
]


def seed_database():
    app = create_app()
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        
        # Create a mock user
        print("Creating mock user...")
        hashed_pw = generate_password_hash('password123')
        test_user = User(
            username='johndoe',
            email='john@example.com',
            password_hash=hashed_pw,
            role='user'
        )
        db.session.add(test_user)
        db.session.commit()
        
        # Insert Books
        print(f"Inserting {len(sample_books)} books...")
        for idx, b_data in enumerate(sample_books):
            book = Book(
                title=b_data['title'],
                author=b_data['author'],
                description=b_data['description'],
                category=b_data['category'],
                condition=b_data['condition'],
                price=b_data['price'],
                stock=b_data['stock'],
                rating=b_data['rating'],
                tagline=b_data['tagline'],
                published_year=b_data['published_year'],
                theme_color=b_data['theme_color'],
                image_prompt=b_data['image_prompt'],
                image_url=f"/images/books/book_{idx+1}.jpg" # Placeholder for now
            )
            db.session.add(book)
        
        db.session.commit()
        
        # Add some mock reviews
        print("Adding mock reviews...")
        all_books = Book.query.all()
        for book in all_books:
            review1 = Review(
                user_id=test_user.id,
                book_id=book.id,
                rating=book.rating,
                comment=f"This book was exactly what I was looking for. Highly recommended!"
            )
            db.session.add(review1)
            
        db.session.commit()
        
        print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
