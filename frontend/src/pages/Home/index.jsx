import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BookCard from '../../components/BookCard';
import { Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        if (res.data.books) {
           setBooks(res.data.books);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const categories = ['All', 'Business', 'Productivity', 'Investing', 'Communication', 'Technology'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="Books background" className="w-full h-full object-cover" />
        </div>
        <div className="relative px-8 py-20 md:py-32 md:px-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover Your Next <span className="text-indigo-400">Great Read</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl">
            Explore thousands of new and pre-loved books at unbeatable prices. From gripping thrillers to insightful non-fiction, ShelfMart has it all.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search by title, author, or ISBN..." 
              className="w-full pl-6 pr-14 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-2xl bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 transition-colors shadow-lg">
              <Search className="w-6 h-6" />
            </button>
          </form>
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
            <p className="text-gray-500 mt-2">Handpicked titles you might love</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-96 border border-gray-100 shadow-sm">
                 <div className="bg-gray-200 h-2/3 rounded-t-xl"></div>
                 <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                   <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No books found matching your search.
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Categories preview */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-12">
         <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  if (cat === 'All') {
                    navigate('/search');
                  } else {
                    navigate(`/search?category=${encodeURIComponent(cat)}`);
                  }
                }}
                className={`transition-all duration-300 px-6 py-3 rounded-full font-semibold border-2 ${
                  selectedCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                  : 'bg-transparent text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                 {cat}
              </button>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Home;
