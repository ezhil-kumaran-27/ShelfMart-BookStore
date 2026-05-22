import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 h-32 relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="bg-white p-2 rounded-full inline-block shadow-lg border-4 border-white">
               <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User className="w-12 h-12" />
               </div>
            </div>
            {user.role === 'admin' && (
              <span className="px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full font-bold text-sm flex items-center shadow-sm">
                <Shield className="w-4 h-4 mr-1" /> Admin
              </span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.username}</h2>
          <p className="text-gray-500 mb-8 flex items-center">
            <Mail className="w-4 h-4 mr-2" /> {user.email}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-gray-200 pb-2">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Username</p>
                  <p className="text-gray-900 font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="text-gray-900 font-semibold">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Member Since
                  </p>
                  <p className="text-gray-900 font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link to="/orders" className="block bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-2">My Orders</h3>
                <p className="text-sm text-gray-500">View your order history, track deliveries, and manage returns.</p>
              </Link>
              
              <Link to="/sell" className="block bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-2">Sell a Book</h3>
                <p className="text-sm text-gray-500">List your pre-loved books for sale on our platform.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
