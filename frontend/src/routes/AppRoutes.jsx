import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BookDetails from '../pages/BookDetails';
import CartPage from '../pages/CartPage';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import SellBook from '../pages/SellBook';
import Profile from '../pages/Profile';
import SearchPage from '../pages/Search';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/book/:id" element={<BookDetails />} />
      <Route path="/search" element={<SearchPage />} />
      
      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/sell" element={
        <ProtectedRoute>
          <SellBook />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
    </Routes>
  );
};

export default AppRoutes;
