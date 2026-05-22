import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setCartLoading(false);
      return;
    }
    
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (book_id) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      await api.post('/cart', { book_id, quantity: 1 });
      toast.success('Added to cart');
      fetchCart();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (item_id) => {
    try {
      await api.delete(`/cart/${item_id}`);
      toast.success('Removed from cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (item_id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${item_id}`, { quantity });
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const clearCartState = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, cartLoading, addToCart, removeFromCart, updateQuantity, fetchCart, clearCartState }}>
      {children}
    </CartContext.Provider>
  );
};
