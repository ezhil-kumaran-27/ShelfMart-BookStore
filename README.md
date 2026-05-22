# ShelfMart - Full Stack Online Bookstore

ShelfMart is a modern online bookstore platform built with React, Tailwind CSS, Flask, and PostgreSQL. It allows users to browse books, manage their cart, place orders, and sell pre-loved books. The platform also includes an admin dashboard for inventory and user management.

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Book Browsing**: Explore books by categories, search by title/author.
- **Shopping Cart**: Add books to cart, manage quantities, and checkout.
- **Order Management**: Place orders (with mock Razorpay integration) and view order history.
- **Sell Old Books**: Users can list their pre-loved books for sale (requires admin approval).
- **Admin Dashboard**: Admins can approve/reject book listings, view sales statistics, and monitor overall platform activity.
- **Responsive UI**: Built with Tailwind CSS, offering a clean, modern, and fully responsive experience.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Context API (State Management)
- Lucide React (Icons)

### Backend
- Python Flask
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Flask-JWT-Extended
- Flask-CORS

## Folder Structure

```
ShelfMart/
├── backend/
│   ├── app/
│   │   ├── config/          # Configuration settings (DB, Cloudinary, Razorpay)
│   │   ├── controllers/     # Business logic for auth, books, cart, orders, etc.
│   │   ├── middleware/      # Custom middlewares
│   │   ├── models/          # SQLAlchemy Database Models
│   │   ├── routes/          # API Route Definitions
│   │   ├── utils/           # Helper functions
│   │   ├── __init__.py      # Flask App Factory
│   │   └── extensions.py    # Flask Extensions (DB, JWT, CORS)
│   ├── .env                 # Environment Variables
│   ├── requirements.txt     # Python Dependencies
│   └── run.py               # Entry point to start the server
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/          # Static assets
    │   ├── components/      # Reusable UI components (Navbar, Footer, BookCard, etc.)
    │   ├── context/         # React Contexts (AuthContext, CartContext)
    │   ├── pages/           # Application Pages (Home, Login, BookDetails, etc.)
    │   ├── routes/          # React Router Setup
    │   ├── services/        # API integration (Axios setup)
    │   ├── utils/           # Helper functions
    │   ├── App.jsx          # Main App Component
    │   ├── index.css        # Tailwind directives
    │   └── main.jsx         # React DOM Render
    ├── .env                 # Environment Variables
    ├── package.json         # NPM Dependencies
    └── tailwind.config.js   # Tailwind Configuration
```

## Installation Steps

### Prerequisites
- Node.js & npm
- Python 3.10+
- PostgreSQL Server running locally (or remote)

### 1. Database Setup
Ensure PostgreSQL is running. The default setup expects a database named `shelfmart` with user `postgres` and password `postgres18`.
You can create the database manually using `psql` or run the provided `create_db.py` script.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server (this will also create the database tables automatically)
python run.py
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
SECRET_KEY=supersecretkey123
JWT_SECRET_KEY=supersecretjwtkey123
DATABASE_URL=postgresql://postgres:postgres18@localhost:5432/shelfmart
CLOUDINARY_CLOUD_NAME=mock_cloud_name
CLOUDINARY_API_KEY=mock_api_key
CLOUDINARY_API_SECRET=mock_api_secret
RAZORPAY_KEY_ID=mock_rzp_key
RAZORPAY_KEY_SECRET=mock_rzp_secret
```

## API Routes

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Books**: `/api/books`, `/api/books/<id>`, `/api/books/search`
- **Cart**: `/api/cart`
- **Orders**: `/api/orders`, `/api/orders/<id>/cancel`
- **Payments**: `/api/payments/create-order`, `/api/payments/verify`

## Future Enhancements
- Real Cloudinary integration for image uploads.
- Real Razorpay payment gateway integration.
- Admin portal for comprehensive inventory management.
- User reviews and ratings for books.
- Advanced search with multiple filters (price range, condition).
