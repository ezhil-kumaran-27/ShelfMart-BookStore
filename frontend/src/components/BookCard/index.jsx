import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  // Array of beautiful placeholder covers
  const placeholders = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589998059171-989d887df466?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614285457768-646f65ce85d5?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476275466078-4007374efac4?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop'
  ];
  
  const fallbackImg = placeholders[book.id % placeholders.length];
  
  const imageUrl = book.image_url || fallbackImg;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 group">
      <Link to={`/book/${book.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img 
          src={imageUrl} 
          alt={book.title} 
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {book.condition === 'old' && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            Pre-loved
          </span>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">{book.category}</span>
          <div className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {book.rating ? book.rating.toFixed(1) : 'New'}
          </div>
        </div>
        
        <Link to={`/book/${book.id}`} className="block mb-1 group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1" title={book.title}>{book.title}</h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{book.author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">₹{book.price}</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={async () => {
                const success = await addToCart(book.id);
                if (success) {
                  navigate('/checkout');
                }
              }}
              disabled={book.stock < 1}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                book.stock > 0 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'hidden'
              }`}
            >
              Buy Now
            </button>
            <button 
              onClick={() => addToCart(book.id)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Add to cart"
              disabled={book.stock < 1}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
        {book.stock < 1 && (
           <span className="text-xs text-red-500 font-semibold mt-2">Out of Stock</span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
