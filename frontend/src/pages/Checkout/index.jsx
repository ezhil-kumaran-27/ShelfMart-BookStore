import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Truck, CheckCircle, ArrowRight, ShieldCheck, MapPin, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { cart, cartLoading, fetchCart, clearCartState } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Payment
  const [paymentMethod, setPaymentMethod] = useState('netbanking');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Mock form state
  const [shippingDetails, setShippingDetails] = useState({
    name: 'John Doe',
    address: '123 Fiction Lane, Book City, IN 400001',
    phone: '9876543210'
  });

  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderRes = await api.post('/orders');
      const orderId = orderRes.data.order.id;

      if (paymentMethod === 'netbanking') {
        const paymentRes = await api.post('/payments/create-order', { order_id: orderId });
        const { razorpay_order_id } = paymentRes.data;

        await api.post('/payments/verify', {
          razorpay_order_id,
          razorpay_payment_id: `mock_payment_${Math.floor(Math.random() * 1000000)}`
        });
      }

      clearCartState();
      
      // Simulate Email
      toast.success('📧 Order Confirmation Email Sent!', { duration: 5000, style: { background: '#10B981', color: '#fff' } });
      
      if (paymentMethod === 'cod') {
        setSuccess(true);
      } else {
        toast.success('Order placed successfully! Thank you for your purchase.');
        navigate('/orders');
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading || (!success && cart.length === 0)) return null;

  if (success) {
    return (
      <div className="py-16 max-w-2xl mx-auto text-center animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 flex flex-col items-center">
          <img 
            src="/order_success.png" 
            alt="Order Successful" 
            className="w-64 h-64 object-contain mb-8 drop-shadow-xl" 
          />
          <h1 className="text-4xl font-black text-indigo-900 mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Thank you for shopping at ShelfMart. Your books are being packed and will be delivered soon via Cash on Delivery.
          </p>
          <div className="flex gap-4">
            <Link to="/" className="px-8 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
              Continue Shopping
            </Link>
            <Link to="/orders" className="px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Secure Checkout</h1>
        <div className="flex items-center justify-center space-x-4 text-sm font-medium">
          <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>1</span>
            Shipping Details
          </div>
          <div className={`w-16 h-1 border-t-2 ${step >= 2 ? 'border-indigo-600' : 'border-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>2</span>
            Payment Gateway
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                      <p className="text-gray-500 text-sm">Where should we send your books?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input type="text" value={shippingDetails.name} onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                      <textarea rows="3" value={shippingDetails.address} onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 resize-none transition-colors"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input type="text" value={shippingDetails.phone} onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors" />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-10 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center group"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
              
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                      <p className="text-gray-500 text-sm">All transactions are encrypted and secure.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-2xl mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5 text-indigo-500" />
                      <div>
                        <h4 className="font-bold text-indigo-900 text-lg mb-1">Simulated Payment Environment</h4>
                        <p className="text-indigo-700/80 leading-relaxed text-sm">
                          This is a demonstration of the 90% completed ShelfMart project. Clicking "Pay Now" will simulate a successful Razorpay gateway transaction and create your order in the database.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'netbanking' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200'}`}>
                      <input type="radio" name="payment" className="form-radio text-indigo-600 w-5 h-5" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
                      <div className="ml-4">
                        <span className="block font-bold text-gray-900">UPI / Credit Card / Debit Card</span>
                        <span className="block text-sm text-gray-500">Powered by Razorpay</span>
                      </div>
                      <CreditCard className="w-6 h-6 ml-auto text-indigo-600" />
                    </label>
                    
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200'}`}>
                      <input type="radio" name="payment" className="form-radio text-indigo-600 w-5 h-5" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div className="ml-4">
                        <span className="block font-bold text-gray-900">Cash on Delivery (COD)</span>
                        <span className="block text-sm text-gray-500">Pay when your order arrives</span>
                      </div>
                      <Truck className="w-6 h-6 ml-auto text-indigo-600" />
                    </label>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className={`flex-grow py-4 rounded-xl font-bold text-lg flex items-center justify-center text-white shadow-xl transition-all ${
                        loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-1'
                      }`}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {paymentMethod === 'netbanking' ? <CreditCard className="w-6 h-6 mr-2" /> : <ShoppingBag className="w-6 h-6 mr-2" />}
                          {paymentMethod === 'netbanking' ? `Pay ₹${calculateTotal()} securely` : `Place Order (₹${calculateTotal()})`}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
        
        {/* Right Column: Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.book.image_url} alt={item.book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center flex-grow">
                    <span className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{item.book.title}</span>
                    <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                  </div>
                  <div className="font-bold text-gray-900 flex items-center">₹{item.book.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Checkout;
