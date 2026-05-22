import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-indigo-600">
          <BookOpen className="w-8 h-8" />
          <span>ShelfMart</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/sell" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Sell Book
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  Dashboard
                </Link>
              )}
              <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none">
                  <User className="w-6 h-6" />
                  <span className="font-medium">{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
