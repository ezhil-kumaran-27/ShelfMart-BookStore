from app import create_app
from app.extensions import db
from app.models.book_model import Book

app = create_app()

new_books = [
    # Fiction/Literature
    {
        "title": "1984", "author": "George Orwell", "category": "Fiction", "price": 12.99,
        "description": "A dystopian social science fiction novel and cautionary tale.",
        "image_url": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 15
    },
    {
        "title": "The Return", "author": "Hisham Matar", "category": "Literature", "price": 14.50,
        "description": "Fathers, Sons and the Land in Between. A Pulitzer Prize winning memoir.",
        "image_url": "https://images.unsplash.com/photo-1495640388908-05fd9211f692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 8
    },
    {
        "title": "Reasons to Stay Alive", "author": "Matt Haig", "category": "Literature", "price": 11.99,
        "description": "An exploration of making the most of your time on earth.",
        "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 10
    },
    {
        "title": "Before the Coffee Gets Cold", "author": "Toshikazu Kawaguchi", "category": "Fiction", "price": 13.99,
        "description": "A story about a cafe that allows its customers to travel back in time.",
        "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 20
    },
    {
        "title": "Less", "author": "Andrew Sean Greer", "category": "Fiction", "price": 15.00,
        "description": "A Pulitzer Prize winning satirical comedy novel.",
        "image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 5
    },
    {
        "title": "The Covenant of Water", "author": "Abraham Verghese", "category": "Fiction", "price": 18.99,
        "description": "A stunning and magisterial epic of love, faith, and medicine.",
        "image_url": "https://images.unsplash.com/photo-1476275466078-4007374efac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 12
    },
    {
        "title": "Tomorrow, and Tomorrow, and Tomorrow", "author": "Gabrielle Zevin", "category": "Fiction", "price": 16.50,
        "description": "Two friends--often in love, but never lovers--come together as creative partners.",
        "image_url": "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 25
    },
    
    # Self-Improvement
    {
        "title": "Atomic Habits", "author": "James Clear", "category": "Productivity", "price": 16.00,
        "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
        "image_url": "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 30
    },
    {
        "title": "The 7 Habits of Highly Effective People", "author": "Stephen R. Covey", "category": "Productivity", "price": 14.99,
        "description": "Powerful lessons in personal change.",
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 22
    },
    {
        "title": "Peace is Every Step", "author": "Thich Nhat Hanh", "category": "Self-Improvement", "price": 12.50,
        "description": "The Path of Mindfulness in Everyday Life.",
        "image_url": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 15
    },
    {
        "title": "Think on these things", "author": "J. Krishnamurti", "category": "Self-Improvement", "price": 13.00,
        "description": "Examinations of human nature, fear, and freedom.",
        "image_url": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 10
    },
    {
        "title": "Improv Wisdom", "author": "Patricia Ryan Madson", "category": "Self-Improvement", "price": 11.00,
        "description": "Don't Prepare, Just Show Up. Maxims for an improvisational life.",
        "image_url": "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 9
    },
    {
        "title": "The Creative Act: A Way of Being", "author": "Rick Rubin", "category": "Self-Improvement", "price": 20.00,
        "description": "A beautiful and generous course of study that illuminates the path of the artist.",
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 18
    },
    {
        "title": "What I Know For Sure", "author": "Oprah Winfrey", "category": "Self-Improvement", "price": 14.95,
        "description": "Candid, moving, exhilarating, uplifting, and frequently humorous revelations.",
        "image_url": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 20
    },

    # Science & Technology
    {
        "title": "A Brief History of Time", "author": "Stephen Hawking", "category": "Technology", "price": 15.50,
        "description": "A landmark volume in science writing by one of the great minds of our time.",
        "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 14
    },
    {
        "title": "The Selfish Gene", "author": "Richard Dawkins", "category": "Technology", "price": 16.99,
        "description": "A classic exposition of evolutionary thought.",
        "image_url": "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 11
    },
    {
        "title": "Clean Code", "author": "Robert C. Martin", "category": "Technology", "price": 29.99,
        "description": "A Handbook of Agile Software Craftsmanship.",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 25
    },

    # Business & Leadership
    {
        "title": "Deep Work", "author": "Cal Newport", "category": "Business", "price": 17.50,
        "description": "Rules for Focused Success in a Distracted World.",
        "image_url": "https://images.unsplash.com/photo-1506784951206-81c19b8df79d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 19
    },
    {
        "title": "Good to Great", "author": "Jim Collins", "category": "Business", "price": 18.00,
        "description": "Why Some Companies Make the Leap...And Others Don't.",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 15
    },
    {
        "title": "The Lean Startup", "author": "Eric Ries", "category": "Business", "price": 16.99,
        "description": "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
        "image_url": "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 21
    },
    {
        "title": "Leaders Eat Last", "author": "Simon Sinek", "category": "Business", "price": 15.99,
        "description": "Why Some Teams Pull Together and Others Don't.",
        "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 17
    },

    # Communication
    {
        "title": "Never Split the Difference", "author": "Chris Voss", "category": "Communication", "price": 16.50,
        "description": "Negotiating As If Your Life Depended On It.",
        "image_url": "https://images.unsplash.com/photo-1558021211-6d1403321394?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 23
    },
    {
        "title": "Surrounded by Idiots", "author": "Thomas Erikson", "category": "Communication", "price": 15.00,
        "description": "The Four Types of Human Behavior and How to Effectively Communicate with Each in Business.",
        "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 16
    },
    {
        "title": "How to Talk to Anyone", "author": "Leil Lowndes", "category": "Communication", "price": 12.99,
        "description": "92 Little Tricks for Big Success in Relationships.",
        "image_url": "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 20
    },
    {
        "title": "How to Win Friends and Influence People", "author": "Dale Carnegie", "category": "Communication", "price": 14.00,
        "description": "The only book you need to lead you to success.",
        "image_url": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 35
    },

    # Investing
    {
        "title": "Coffee Can Investing", "author": "Saurabh Mukherjea", "category": "Investing", "price": 18.50,
        "description": "The Low Risk Road to Stupendous Wealth.",
        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 12
    },
    {
        "title": "Learn to Earn", "author": "Peter Lynch", "category": "Investing", "price": 14.50,
        "description": "A Beginner's Guide to the Basics of Investing and Business.",
        "image_url": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 14
    },
    {
        "title": "The Intelligent Investor", "author": "Benjamin Graham", "category": "Investing", "price": 22.99,
        "description": "The Definitive Book on Value Investing.",
        "image_url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 28
    },
    {
        "title": "The Joys of Compounding", "author": "Gautam Baid", "category": "Investing", "price": 24.00,
        "description": "The Passionate Pursuit of Lifelong Learning.",
        "image_url": "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "condition": "new", "stock": 10
    }
]

with app.app_context():
    for b_data in new_books:
        # Avoid duplicates based on title
        existing = Book.query.filter_by(title=b_data['title']).first()
        if not existing:
            book = Book(**b_data)
            db.session.add(book)
    
    db.session.commit()
    print(f"Successfully seeded {len(new_books)} new books.")
