// src/context/WishlistContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Toast from './toast';

// Create context
const WishlistContext = createContext();

// Provider
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access'));
  
  const isLoggedIn = !!token;

  // Sync token from localStorage (in case it changes elsewhere)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access');
      if (newToken !== token) setToken(newToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  // Update axios default Authorization header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Set axios auth header:', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Removed axios auth header');
    }
  }, [token]);

  // Fetch wishlist from backend
  useEffect(() => {
  const fetchWishlist = async () => {
    const currentToken = localStorage.getItem('access');
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      // Sync localStorage wishlist to backend after login
      const guestWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

      if (guestWishlist.length > 0) {
        console.log(`Syncing ${guestWishlist.length} items from guest wishlist to backend...`);
        for (const product of guestWishlist) {
          try {
            await axios.post('http://localhost:8000/wishlist/', { product_id: product.id });
          } catch (err) {
            console.error(`Error syncing product ${product.id}:`, err.response || err.message);
          }
        }
        localStorage.removeItem('wishlist'); // Clear local guest wishlist
      }

      // Now fetch wishlist from backend
      const res = await axios.get('http://localhost:8000/wishlist/', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const product = res.data[0]?.products || [];
      setWishlist(product);
      console.log('Fetched wishlist from backend:', product.length);
    } catch (err) {
      console.error('Fetch wishlist error:', err.response?.status, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    fetchWishlist();
  } else {
    // Fallback for guests
    const stored = localStorage.getItem('wishlist');
    setWishlist(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }
}, [isLoggedIn]);


  // Add to wishlist
  const addToWishlist = async (product) => {
    if (isLoggedIn) {
    try {
      const currentToken = localStorage.getItem('access');
      console.log('Adding to wishlist with token:', currentToken);
      const response = await axios.post('http://localhost:8000/wishlist/', { product_id: product.id });
      console.log('Add to wishlist response:', response.data);
      
      // After successful add, you may want to refetch or update the wishlist properly
      // Instead of blindly appending, it's safer to refetch or merge carefully
      setWishlist(prev => {
        // Only add if not already in wishlist
        if (!prev.find(p => p.id === product.id)) {
          return [...prev, product];
        }
        return prev;
      });
    } catch (err) {
      console.error('Add error:', err.response || err.message);
    }
  } else {
    setWishlist(prev => {
      const updated = prev.find(p => p.id === product.id) ? prev : [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  }
};

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
  if (isLoggedIn) {
    try {
      const currentToken = localStorage.getItem('access');
      console.log('Removing from wishlist with token:', currentToken);

      // Make DELETE request with product_id in request body
      await axios.delete('http://localhost:8000/wishlist/remove/', {
        headers: {
          Authorization: `Bearer ${currentToken}`
        },
        data: { product_id: productId },
      });

      // Optimistically update local wishlist state by filtering out removed item
      setWishlist(prev => prev.filter(item => item.id !== productId));

      // Optionally, refetch the wishlist from backend to ensure syncing
      // const res = await axios.get('http://localhost:8000/wishlist/', {
      //   headers: { Authorization: `Bearer ${currentToken}` }
      // });
      // setWishlist(res.data[0]?.products || []);

    } catch (err) {
      console.error('Remove error:', err.response || err.message);
      // Optionally, you can alert the user here or revert UI state
    }
  } else {
    // For guests, update localStorage and state directly
    const updated = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
  }
};

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
        token,
        setToken,
        isLoggedIn,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
