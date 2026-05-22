import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartLoading) {
    return <div className="text-center py-20">Loading cart...</div>;
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any books yet.</p>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center border-b border-gray-100 last:border-0 py-6 last:pb-0 first:pt-0">
                  <img 
                    src={item.book.image_url || 'https://via.placeholder.com/150'} 
                    alt={item.book.title} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop'; }}
                    className="w-24 h-32 object-cover rounded-md shadow-sm mb-4 sm:mb-0 sm:mr-6"
                  />
                  
                  <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                    <Link to={`/book/${item.book.id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                      {item.book.title}
                    </Link>
                    <p className="text-sm text-gray-500 mb-4">{item.book.author}</p>
                    
                    <div className="flex items-center space-x-4 w-full justify-between sm:justify-start">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock}
                          className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-right w-full sm:w-auto">
                    <p className="text-lg font-bold text-gray-900">₹{item.book.price * item.quantity}</p>
                    <p className="text-sm text-gray-500">₹{item.book.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-medium text-gray-900">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-indigo-600">₹{calculateTotal()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center group"
            >
              Proceed to Checkout 
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
