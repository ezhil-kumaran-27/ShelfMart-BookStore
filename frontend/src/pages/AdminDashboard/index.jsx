import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Package, DollarSign, BookOpen, Check, X, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    books: 0
  });
  const [pendingBooks, setPendingBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ordersRes, booksRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/books') // Assuming pending books can be derived, or mocking for now
      ]);
      
      setStats({
        users: statsRes.data.users,
        orders: statsRes.data.orders,
        revenue: statsRes.data.revenue,
        books: statsRes.data.books
      });
      
      setOrders(ordersRes.data.orders);
      
      // Mocking pending books for demo
      setPendingBooks([
        { id: 991, title: 'Calculus Early Transcendentals', author: 'James Stewart', price: 800, condition: 'old', seller_id: 2 }
      ]);
      
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveBook = (id) => {
    toast.success("Book approved successfully!");
    setPendingBooks(pendingBooks.filter(b => b.id !== id));
  };

  const handleRejectBook = (id) => {
    toast.success("Book listing rejected.");
    setPendingBooks(pendingBooks.filter(b => b.id !== id));
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      fetchAdminData(); // Refresh orders
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.orders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Books', value: stats.books, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Registered Users', value: stats.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Orders Management */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <p className="text-sm text-gray-500 mt-1">View and update customer order statuses</p>
          </div>
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold shadow-sm">
            {orders.length} Total Orders
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{order.user ? order.user.username : 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.user ? order.user.email : ''}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.total_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleOrderStatusUpdate(order.id, 'shipped')}
                        disabled={order.order_status === 'shipped' || order.order_status === 'delivered' || order.order_status === 'cancelled'}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Mark as Shipped"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                        disabled={order.order_status === 'delivered' || order.order_status === 'cancelled'}
                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Mark as Delivered"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Book Approvals</h2>
            <p className="text-sm text-gray-500 mt-1">Review books listed by users before they go public</p>
          </div>
          <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold shadow-sm">
            {pendingBooks.length} Pending
          </span>
        </div>
        
        {pendingBooks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {pendingBooks.map((book) => (
              <div key={book.id} className="p-8 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex-grow mb-4 md:mb-0 text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                  <p className="text-gray-500 mb-2 font-medium">by {book.author}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm font-bold">
                    <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">₹{book.price}</span>
                    <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase text-xs tracking-wider">Used Book</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleApproveBook(book.id)}
                    className="flex items-center px-6 py-3 bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-sm rounded-xl font-bold transition-all"
                  >
                    <Check className="w-5 h-5 mr-2" /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectBook(book.id)}
                    className="flex items-center px-6 py-3 bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-sm rounded-xl font-bold transition-all"
                  >
                    <X className="w-5 h-5 mr-2" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 font-medium">
            No pending book approvals at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
