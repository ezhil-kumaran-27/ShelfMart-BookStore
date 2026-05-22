import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 text-lg">You haven't placed any orders.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Order History</h1>
      
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm mb-4 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
                <div>
                  <p className="text-gray-500 font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-gray-900 font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-gray-900 font-semibold">₹{order.total_amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-gray-900 font-semibold">{order.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center ${getStatusColor(order.order_status)}`}>
                  {order.order_status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                  {order.order_status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {order.order_status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                  {order.order_status}
                </span>
                
                {order.order_status === 'processing' && (
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6 divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center">
                  <img 
                    src={item.book.image_url || 'https://via.placeholder.com/80'} 
                    alt={item.book.title} 
                    className="w-16 h-24 object-cover rounded shadow-sm mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900">{item.book.title}</h3>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                    <p className="mt-1 text-gray-700 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
