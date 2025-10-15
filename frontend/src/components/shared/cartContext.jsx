import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { useLoader } from './loaderContext';

const BASE_API = 'http://localhost:8000';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// --- Guest cart initialization
const initialGuestCart = () => {
  const token = localStorage.getItem('access');
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  }

  return []; // Logged-in users: fetch from backend later
};

export const CartProvider = ({ children }) => {
  const { loading, setLoading } = useLoader();
  const [token, setToken] = useState(localStorage.getItem('access'));
  const isLoggedIn = !!token;
  const [cart, setCart] = useState(initialGuestCart);

  // Track previous login state
  const prevIsLoggedInRef = useRef(isLoggedIn);

  // Save cart to localStorage on logout
  useEffect(() => {
    if (prevIsLoggedInRef.current && !isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    prevIsLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, cart]);

  // Sync token changes from storage
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access');
      setToken(newToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Set axios auth headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch cart for logged-in users & merge guest cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) return;

      try {
        const guestCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (guestCart.length > 0) {
          await Promise.all(
            guestCart.map(item =>
              axios.post(`${BASE_API}/cart-items/add/`, {
                product_id: item.product.id,
                quantity: item.quantity,
              })
            )
          );
          localStorage.removeItem('cart');
        }

        const res = await axios.get(`${BASE_API}/cart-items/`);
        setCart(res.data.items || []);
      } catch (err) {
        console.error('Error fetching cart:', err.response || err.message);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // --- Core Cart Methods

  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn) {
      try {
        await axios.post(`${BASE_API}/cart-items/add/`, {
          product_id: product.id,
          quantity,
        });

        setCart(prev => {
          const exists = prev.find(item => item.product.id === product.id);
          if (exists) {
            return prev.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { product, quantity }];
        });
      } catch (err) {
        console.error('Add to cart error:', err.response || err.message);
      }
    } else {
      setCart(prev => {
        const exists = prev.find(item => item.product.id === product.id);
        if (exists) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
  };

  const increaseQty = async (id) => {
    setLoading(true);
    if (isLoggedIn) {
      try {
        await axios.post(`${BASE_API}/cart-items/update_quantity/`, {
          product_id: id,
          quantity: getQty(id) + 1,
        });
      } catch (err) {
        console.error('Increase qty error:', err.response || err.message);
      }
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    setTimeout(() => setLoading(false), 300);
  };

  const decreaseQty = async (id) => {
    setLoading(true);
    const currentQty = getQty(id);
    if (isLoggedIn && currentQty > 1) {
      try {
        await axios.post(`${BASE_API}/cart-items/update_quantity/`, {
          product_id: id,
          quantity: currentQty - 1,
        });
      } catch (err) {
        console.error('Decrease qty error:', err.response || err.message);
      }
    }

    setCart(prev =>
      prev
        .map(item =>
          item.product.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );

    setTimeout(() => setLoading(false), 300);
  };

  const removeFromCart = async (id) => {
    setLoading(true);
    if (isLoggedIn) {
      try {
        await axios.post(`${BASE_API}/cart-items/remove/`, {
          product_id: id,
        });
      } catch (err) {
        console.error('Remove from cart error:', err.response || err.message);
      }
    }

    setCart(prev => prev.filter(item => item.product.id !== id));
    setTimeout(() => setLoading(false), 300);
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await axios.delete(`${BASE_API}/cart-items/clear/`);
      } catch (err) {
        console.error('Clear cart error:', err.response || err.message);
      }
    }
    setCart([]);
  };

  const getQty = (id) => {
    const item = cart.find(item => item.product.id === id);
    return item ? item.quantity : 0;
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isInCart = (id) => cart.some(item => item.product.id === id);

  const value = useMemo(() => ({
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    total,
    isInCart,
    getQty,
    loading,
    token,
    isLoggedIn,
    setToken,
  }), [cart, loading, token, isLoggedIn]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
 