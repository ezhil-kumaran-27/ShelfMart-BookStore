import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import BookCard from '../../components/BookCard';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || 'All';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

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

  const categories = ['All', 'Business', 'Productivity', 'Investing', 'Communication', 'Technology'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8 animate-fade-in min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse All Books</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="Title, Author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                Showing {filteredBooks.length} results
                {searchTerm && <span> for "<span className="font-semibold text-gray-900">{searchTerm}</span>"</span>}
                {selectedCategory !== 'All' && <span> in <span className="font-semibold text-gray-900">{selectedCategory}</span></span>}
              </p>
              
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="bg-indigo-50 text-indigo-700 font-bold px-6 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default SearchPage;
