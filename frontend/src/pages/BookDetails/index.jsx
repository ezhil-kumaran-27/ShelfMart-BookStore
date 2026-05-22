import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingCart, ArrowLeft, Tag, Book, User as UserIcon, Star, Calendar, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setBook(bookRes.data.book);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookAndReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${id}`, {
        rating: ratingInput,
        comment: commentInput
      });
      setReviews([res.data.review, ...reviews]);
      setCommentInput('');
      toast.success('Review added successfully!');
      
      // Update book rating
      const bookRes = await api.get(`/books/${id}`);
      setBook(bookRes.data.book);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const imageUrl = book.image_url || 'https://via.placeholder.com/400x600?text=Book+Cover';
  const themeGradient = book.theme_color ? `bg-gradient-to-br ${book.theme_color}` : 'bg-gradient-to-br from-indigo-500 to-purple-600';

  return (
    <div className="py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-indigo-600 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to browse
      </Link>
      
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          
          {/* Left Column: Image and Theme */}
          <div className={`${themeGradient} p-8 md:p-16 flex justify-center items-center relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
            
            <img 
              src={imageUrl} 
              alt={book.title} 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'; }}
              className="z-10 w-full max-w-sm h-auto object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-r-xl rounded-l-md transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
            />
          </div>
          
          {/* Right Column: Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full uppercase tracking-wider">
                {book.category}
              </span>
              {book.condition === 'old' && (
                <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-full flex items-center tracking-wider">
                  <Tag className="w-4 h-4 mr-1.5" /> Pre-loved
                </span>
              )}
              {book.published_year && (
                <span className="px-4 py-1.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-full flex items-center tracking-wider">
                  <Calendar className="w-4 h-4 mr-1.5" /> {book.published_year}
                </span>
              )}
              <div className="flex items-center ml-auto bg-yellow-50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className="font-bold text-yellow-700">{book.rating ? book.rating.toFixed(1) : 'New'}</span>
                <span className="text-yellow-600/70 text-xs ml-1">({reviews.length})</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight leading-tight">
              {book.title}
            </h1>
            
            {book.tagline && (
              <h3 className="text-xl md:text-2xl text-gray-500 font-medium italic mb-6">
                "{book.tagline}"
              </h3>
            )}
            
            <p className="text-lg text-gray-600 mb-8 flex items-center font-medium">
              <UserIcon className="w-5 h-5 mr-2 text-indigo-500" /> By {book.author}
            </p>
            
            <div className="prose prose-lg prose-indigo mb-10">
              <p className="text-gray-700 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>
            
            <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Price</p>
                <div className="flex items-baseline">
                  <span className="text-2xl text-gray-900 font-semibold mr-1">₹</span>
                  <span className="text-5xl font-black text-gray-900 tracking-tight">{book.price}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                <button 
                  onClick={() => {
                    addToCart(book.id);
                    toast.success('Added to cart!');
                  }}
                  disabled={book.stock < 1}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-1 ${
                    book.stock > 0 
                    ? 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50' 
                    : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  onClick={async () => {
                    const success = await addToCart(book.id);
                    if (success) {
                      navigate('/checkout');
                    }
                  }}
                  disabled={book.stock < 1}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-xl hover:-translate-y-1 ${
                    book.stock > 0 
                    ? 'bg-gray-900 hover:bg-black text-white hover:shadow-black/20' 
                    : 'hidden'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center text-sm text-gray-500 font-medium gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center">
                <Book className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{book.condition === 'new' ? 'Brand New Condition' : 'Gently Used'}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${book.stock > 0 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                <span className={book.stock > 0 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                  {book.stock > 0 ? `${book.stock} Copies Available` : 'Currently Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 flex items-center">
              <MessageCircle className="w-8 h-8 mr-3 text-indigo-600" />
              Reader Reviews
            </h2>
            <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
              <Star className="w-6 h-6 text-yellow-500 fill-current mr-2" />
              <span className="text-2xl font-black text-gray-900">{book.rating ? book.rating.toFixed(1) : 'New'}</span>
              <span className="text-gray-500 ml-2 font-medium">({reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Write Review */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
                {user ? (
                  <form onSubmit={submitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-8 h-8 ${star <= ratingInput ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                      <textarea
                        rows="4"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="What did you think about this book?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center transition-colors shadow-lg shadow-indigo-500/30"
                    >
                      {submittingReview ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4 font-medium">Please sign in to share your thoughts.</p>
                    <Link to="/login" className="inline-block bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-black transition-colors">
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xl font-semibold text-gray-500">No reviews yet.</p>
                  <p className="text-gray-400 mt-1">Be the first to review this book!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mr-3">
                          {review.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{review.user}</p>
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-13">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
