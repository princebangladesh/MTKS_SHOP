// src/context/WishlistContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");
  const isLoggedIn = !!token;

  // -----------------------------------------
  // SET AXIOS AUTH HEADER
  // -----------------------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // -----------------------------------------
  // FETCH WISHLIST FROM BACKEND
  // -----------------------------------------
  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      // Guest user
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(stored);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/wishlist/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const products = res.data[0]?.products || [];
      setWishlist(products);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Sync guest wishlist → backend on login
  // -----------------------------------------
  const syncGuestWishlist = async () => {
    const guestList = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!isLoggedIn || guestList.length === 0) return;

    for (const item of guestList) {
      try {
        await axios.post(`${BASE_URL}/api/wishlist/`, {
          product_id: item.id,
        });
      } catch (err) {
        console.error("Error syncing guest wishlist:", err);
      }
    }

    localStorage.removeItem("wishlist");
  };


  useEffect(() => {
    (async () => {
      if (isLoggedIn) await syncGuestWishlist();
      fetchWishlist();
    })();
  }, [isLoggedIn]);

  // -----------------------------------------
  // ADD TO WISHLIST
  // -----------------------------------------
  const addToWishlist = async (product) => {
    if (isLoggedIn) {
      try {
        await axios.post(`${BASE_URL}/api/wishlist/`, {
          product_id: product.id,
        });

  
        fetchWishlist();
      } catch (err) {
        console.error("Add to wishlist error:", err);
      }
    } else {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        const updated = exists ? prev : [...prev, product];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // -----------------------------------------
  // REMOVE FROM WISHLIST
  // -----------------------------------------
  const removeFromWishlist = async (productId) => {
    if (isLoggedIn) {
      try {
        await axios.delete(`${BASE_URL}/api/wishlist/remove/`, {
          data: { product_id: productId },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Refetch so UI always matches server
        fetchWishlist();
      } catch (err) {
        console.error("Remove from wishlist error:", err);
      }
    } else {
      const updated = wishlist.filter((item) => item.id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlist(updated);
    }
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
        isLoggedIn,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
