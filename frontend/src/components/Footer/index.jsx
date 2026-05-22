import React from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-2xl font-bold text-white mb-4">
              <img src="/logo.jpg" alt="ShelfMart Logo" className="h-10 w-auto object-contain rounded bg-white p-1" />
              <span>ShelfMart</span>
            </div>
            <p className="text-gray-400">
              Your one-stop destination for new and pre-loved books. Read more, spend less.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/sell" className="text-gray-400 hover:text-indigo-400 transition-colors">Sell Old Books</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-indigo-400 transition-colors">Cart</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-indigo-400 transition-colors">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Fiction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Non-Fiction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Academic</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Children's Books</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Connect</h3>
            <p className="text-gray-400 mb-2">Subscribe to our newsletter</p>
            <div className="flex w-full shadow-lg rounded-md overflow-hidden">
              <input type="email" placeholder="Email address" className="px-4 py-2 w-full min-w-0 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-medium transition-colors whitespace-nowrap flex-shrink-0 text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ShelfMart. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for Book Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
