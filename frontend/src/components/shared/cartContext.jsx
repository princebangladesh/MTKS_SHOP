// Full regenerated CartContext with fixes applied
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/api"; // Adjust the import path as needed
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");
  const isLoggedIn = !!token;

  /* ----------------------------
     Fetch Cart (Guest + Auth)
  ----------------------------- */
  const fetchCart = async () => {
    setLoading(true);

    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      const normalized = localCart.map((item) => ({
        ...item,
        variant_id: item.variant?.id ?? item.variant_id ?? null,
        default_variant_id: item.product?.sku ?? item.default_variant_id ?? null,
      }));

      setCart(normalized);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get(`${BASE_URL}/api/cart-items/`);

      const normalized = res.data.items.map((item) => ({
        ...item,
        variant_id: item.variant?.id ?? null,
        default_variant_id: item.product?.sku ?? null,
      }));

      setCart(normalized);
    } catch (err) {
      console.error("Fetch cart error:", err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Load cart only once
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  /* ----------------------------
     Add To Cart
  ----------------------------- */
  const addToCart = async (item, quantity = 1) => {
    const productObj = item.productData || item.product || null;
    const variantId = item?.variant?.id ?? null;
    const productId = productObj?.id ?? null;

    const stock =
      item?.variant?.quantity ?? productObj?.total_stock ?? 0;

    if (!token) {
      const local = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = local.find((el) => {
        return (
          (variantId && el.variant_id === variantId) ||
          (!variantId && el.product?.id === productId)
        );
      });

      if (existing) {
        if (existing.quantity + quantity > stock) {
          alert(`Not enough stock. Only ${stock} items left.`);
          return;
        }
        existing.quantity += quantity;
      } else {
        local.push({
          product: productObj,
          variant: item.variant || null,
          quantity,
          variant_id: variantId,
          default_variant_id: productObj?.sku,
        });
      }

      localStorage.setItem("cart", JSON.stringify(local));
      setCart(local);
      return;
    }

    try {
      const payload = variantId
        ? { variant_id: variantId, quantity }
        : { product_id: productId, quantity };

      await axios.post(
        `${BASE_URL}/api/cart-items/add/`,
        payload
      );

      await fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err.response?.data);
    }
  };

  /* ----------------------------
     Remove From Cart
  ----------------------------- */
  const removeFromCart = async (item) => {
    if (token) {
      try {
        await axios.post(`${BASE_URL}/api/cart-items/remove/`, {
          variant_id: item.variant_id ?? undefined,
          product_id: item.variant_id ? undefined : item.product?.id,
        });
        await fetchCart();
      } catch (err) {
        console.error("Remove error:", err.response?.data);
      }
      return;
    }

    const updated = cart.filter(
      (el) =>
        !(
          el.variant_id === item.variant_id ||
          el.product?.id === item.product?.id
        )
    );

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  /* ----------------------------
     Update Quantity
  ----------------------------- */
  const updateQty = async (itemId, qty) => {
    const item = cart.find(
      (i) =>
        i.id === itemId ||
        i.variant_id === itemId ||
        i.product?.id === itemId
    );
    if (!item) return;

    const stock =
      item.variant?.quantity ?? item.product?.total_stock ?? Infinity;

    if (qty > stock || qty < 1) return;

    if (token) {
      try {
        await axios.post(
          `${BASE_URL}/api/cart-items/update_quantity/`,
          {
            variant_id: item.variant_id ?? undefined,
            product_id: item.variant_id ? undefined : item.product.id,
            quantity: qty,
          }
        );
        await fetchCart();
      } catch (err) {
        console.error("Qty update error:", err.response?.data);
      }
      return;
    }

    const updated = cart.map((el) =>
      el.variant_id === item.variant_id || el.product?.id === item.product?.id
        ? { ...el, quantity: qty }
        : el
    );

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const increaseQty = (id) => {
    const item = cart.find(
      (i) => i.id === id || i.variant_id === id || i.product?.id === id
    );
    if (!item) return;
    updateQty(id, item.quantity + 1);
  };

  const decreaseQty = (id) => {
    const item = cart.find(
      (i) => i.id === id || i.variant_id === id || i.product?.id === id
    );
    if (!item || item.quantity <= 1) return;
    updateQty(id, item.quantity - 1);
  };

  /* ----------------------------
     FIXED Clear Cart
  ----------------------------- */
  const clearCart = async () => {
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/api/cart-items/clear/`);
      } catch (err) {
        console.error("Clear cart error:", err.response?.data);
      }
      setCart([]);
      return;
    }

    // Guest fix — must overwrite instead of remove
    localStorage.setItem("cart", JSON.stringify([]));
    setCart([]);
  };

  /* ----------------------------
     Calculations
  ----------------------------- */
  const subtotal = cart.reduce((sum, item) => {
    const price =
      parseFloat(item.variant?.price) ||
      parseFloat(item.product?.current_price) ||
      0;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    subtotal,
    tax,
    total,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
